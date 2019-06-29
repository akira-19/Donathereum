var Donathereum = artifacts.require("./Donathereum.sol");

module.exports = function(deployer) {
  deployer.deploy(Donathereum, "token", "token");
};
