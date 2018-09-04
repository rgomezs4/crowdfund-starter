import React from 'react'
import { Card, Icon, Image, Progress } from 'semantic-ui-react'
import DonateModal from './DonateModal'

import { ABI_DASHBOARD, ABI_CAMPAIGN, ADDRESS } from '../constants/constants'

const UNIX_TIME = 1535829759

const style = {
  campaignDiv: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
  },
  campaignCard: {
    margin: '1rem',
  }
}

class Campaigns extends React.Component{
  constructor(props) {
    super(props)
    this.state = {campaigns: []}
  }
  async componentWillMount() {
    let campaings = await getCampaigns();
    this.setState({campaigns: campaings})
  }
  render () {
    if(this.state.campaigns.length === 0) {
      return (
        <h2> No campaigns found.</h2>
      )
    }
    else {
      return (
        <div style={style.campaignDiv} >
          {this.state.campaigns.map((campaign, i) => {
            return <span key={i}><Campaign {...campaign} /></span>
          })}
        </div>
      )
    }
  }

}

const getCampaignsCount = async () => {
  const Dashboard = window.web3.eth.contract(ABI_DASHBOARD);
  let dashboardInstance = Dashboard.at(ADDRESS);
  return new Promise((resolve, reject) => {
    dashboardInstance.campaignCount((err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    });
  });
}
const getCampaigns = async () => {
  let count = await getCampaignsCount();
  let addressArray = [];
  for(let i = 1; i <= count; i ++){
    let address = await getCampaign(i);
    let info = await getCampaignInfo(address);
    var campaignInfo = info.split(",");
    addressArray.push({
      id: i,
      name: campaignInfo[2],
      target: campaignInfo[0],
      raised: campaignInfo[3],
      ipfsImage: 'https://react.semantic-ui.com/images/avatar/large/matthew.png',
      funderCount: campaignInfo[4],
      expires: UNIX_TIME + 3600 * 4,
      address: address
    });
  }
  return addressArray;
}

const getCampaignInfo = async (address) => {
  const Campaign = window.web3.eth.contract(ABI_CAMPAIGN);
  let campaignInstance = Campaign.at(address);
  return new Promise((resolve, reject) => {
    campaignInstance.getCampaignInfo((err, data) => {
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

// NOTE: This functions is marked as async, consider using await (promises) inside of it
const getCampaign = async (address) => {
  const Dashboard = window.web3.eth.contract(ABI_DASHBOARD);
  let dashboardInstance = Dashboard.at(ADDRESS);
  return new Promise((resolve, reject) => {
    dashboardInstance.getCampaignAddress(address, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    });
  });
}

const Campaign = (props) => {
  return (
    <Card style={style.campaignCard}>
      <Image src={props.ipfsImage} />
      <Card.Content>
        <Card.Header>{props.name}</Card.Header>
        <Card.Meta>
          <Progress percent={props.raised / props.target * 100} />
        </Card.Meta>
        <Card.Description>{props.raised} wei/{props.target} wei</Card.Description>
        <DonateModal id={props.id}/>
      </Card.Content>
      <Card.Content extra>
        <a>
          <Icon name='user' />
          {props.funderCount} Funders
        </a>
      </Card.Content>
    </Card>
  )
}

export default Campaigns