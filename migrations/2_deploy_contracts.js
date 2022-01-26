const ShroomieS = artifacts.require("ShroomieS");
const Heroes = artifacts.require("Heroes");
const HeroesSale = artifacts.require("HeroesSale");
// const LucidLandsGem = artifacts.require("LucidLandsGem");

module.exports = async function(deployer) {
  await deployer.deploy(ShroomieS);
  // await deployer.deploy(LucidLandsGem);
  await deployer.deploy(Heroes).then(function() {
    return deployer.deploy(HeroesSale, Heroes.address);
  });
};
