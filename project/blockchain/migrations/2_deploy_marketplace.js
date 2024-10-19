// blockchain/migrations/2_deploy_marketplace.js

const Marketplace = artifacts.require('Marketplace');

module.exports = function (deployer) {
    deployer.deploy(Marketplace);
};
