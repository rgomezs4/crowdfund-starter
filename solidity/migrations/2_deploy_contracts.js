var Dashboard = artifacts.require("./Dashboard.sol");
var Factory = artifacts.require("./Factory.sol");

module.exports = function(deployer) {
  deployer.deploy(Factory).then(() => {
    deployer.deploy(Dashboard, Factory.address).then(() => {
      console.log('dashboard address:');
      console.log(Dashboard.address);
    })
  })
};