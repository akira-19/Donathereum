var Donathereum = artifacts.require("./Donathereum.sol");

module.exports = function(deployer) {
  deployer.deploy(Donathereum, "test", "test");
};
