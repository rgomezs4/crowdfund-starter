const Dashboard = artifacts.require("./Dashboard.sol");
const Factory = artifacts.require("./Factory.sol");

module.exports = function(deployer) {
  deployer.deploy(Factory).then(() => {
    deployer.deploy(Dashboard, Factory.address)
  })
};
