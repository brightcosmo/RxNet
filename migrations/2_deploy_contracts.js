const contract = artifacts.require("PrescriptionNFT");

module.exports = function(deployer, network, accounts) {
    if(network == 'development') {
        deployer.deploy(contract,
          [accounts[4], accounts[5]],
          ["Dr. med. Bob Smith", "Dr. med. Michael Brown"]);
    }
    else {
        deployer.deploy(contract, ["0xe95f524fbe1443c2cfeEBE60bF4a6B17BE0f0D72"], ["Dr. Hofer"])
    }
};