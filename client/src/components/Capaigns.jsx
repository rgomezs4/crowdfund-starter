import React from "react";
import { Card, Icon, Image, Progress } from "semantic-ui-react";
import DonateModal from "./DonateModal";
import { ABI, ADDRESS, ABI_CAMPAIGN } from "../constants/constants";

const UNIX_TIME = 1535829759;

const style = {
  campaignDiv: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr"
  },
  campaignCard: {
    margin: "1rem"
  }
};

class Campaigns extends React.Component {
  constructor(props) {
    super(props);
    this.state = { campaigns: [] };
  }
  async componentWillMount() {
    try {
      let campaigns = await getCampaigns();
      this.setState({ campaigns: campaigns ? campaigns : new Array() });
    } catch (error) {
      console.log(error);
    }

  }
  render() {
    if (this.state.campaigns.length === 0) {
      return <h2> No campaigns found.</h2>;
    } else {
      return (
        <div style={style.campaignDiv}>
          {this.state.campaigns.map((campaign, i) => {
            return (
              <span key={i}>
                <Campaign {...campaign} />
              </span>
            );
          })}
        </div>
      );
    }
  }
}

const getCampaigns = async () => {
  let count = await campaignCount();
  console.log(`count: ${count}`)
  let campaigns = [];
  for (let i = 1; i <= count; i++) {
    let c = await getCampaign(i);
    campaigns.push(c);
  }
  return campaigns;
}

const getCampaign = async id => {
  try {
    let address = await getCampaignAddress(id);
    let campaign = await Promise.all([ 
        getCurrentFunding(id), 
        getTotalFunders(id),
        getCampaignName(address),
        getCampaignGoal(address),
        getCampaignDeadline(address)
      ]);

    return {
      cid: id,
      name: campaign[2],
      target: campaign[3],
      raised: campaign[0],
      ipfsImage: "https://react.semantic-ui.com/images/avatar/large/matthew.png",
      funderCount: campaign[1],
      expires: campaign[4],
      address: address
    };
  } catch (error) {
    console.log(error);
  }
};

const Campaign = props => {
  return (
    <Card style={style.campaignCard}>
      <Image src={props.ipfsImage} />
      <Card.Content>
        <Card.Header>{props.name}</Card.Header>
        <Card.Meta>
          <Progress percent={(props.raised / props.target) * 100} />
        </Card.Meta>
        <Card.Description>
          {props.raised} wei/
          {props.target} wei
        </Card.Description>
        <DonateModal address={props.address} cid={props.cid} />
      </Card.Content>
      <Card.Content extra>
        <a>
          <Icon name="user" />
          {props.funderCount} Funders
        </a>
      </Card.Content>
    </Card>
  );
};

const getCampaignDeadline = async (address) => {
  const Campaign = window.web3.eth.contract(ABI_CAMPAIGN);
  let campaignInstance = Campaign.at(address);
  return new Promise((resolve, reject) => {
    campaignInstance.deadline((err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    });
  });
}

const getCampaignGoal = async (address) => {
  const Campaign = window.web3.eth.contract(ABI_CAMPAIGN);
  let campaignInstance = Campaign.at(address);
  return new Promise((resolve, reject) => {
    campaignInstance.goal((err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    });
  });
}

const getCampaignName = async (address) => {
  const Campaign = window.web3.eth.contract(ABI_CAMPAIGN);
  let campaignInstance = Campaign.at(address);
  return new Promise((resolve, reject) => {
    campaignInstance.name((err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    });
  });
}

const getTotalFunders = async id => {
  const Dashboard = window.web3.eth.contract(ABI);
  let dashboardInstance = Dashboard.at(ADDRESS);
  return new Promise((resolve, reject) => {
    dashboardInstance.viewTotalFunders(id, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
};

const getCurrentFunding = async id => {
  const Dashboard = window.web3.eth.contract(ABI);
  let dashboardInstance = Dashboard.at(ADDRESS);
  return new Promise((resolve, reject) => {
    dashboardInstance.viewCurrentFunding(id, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
};

const getCampaignAddress = async id => {
  const Dashboard = window.web3.eth.contract(ABI);
  let dashboardInstance = Dashboard.at(ADDRESS);
  return await new Promise((resolve, reject) => {
    dashboardInstance.getCampaignAddress(id, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
};

const campaignCount = async () => {
  const Dashboard = window.web3.eth.contract(ABI);
  let dashboardInstance = Dashboard.at(ADDRESS);
  return new Promise((resolve, reject) => {
    dashboardInstance.campaignCount((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
};

export default Campaigns;
