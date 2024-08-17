const PrescriptionNFT = artifacts.require("PrescriptionNFT");

module.exports = function(deployer) {
  deployer.deploy(PrescriptionNFT);
};