// Include the library
var nem = require("nem-sdk").default;

// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

module.exports = {

	sendNEM: function(senderPassword, senderKey, recieverAddress, amount, message) {

		// Create a common object holding key
		var common = nem.model.objects.create("common")(senderPassword, senderKey);

		// Create an un-prepared transfer transaction object
		var transferTransaction = nem.model.objects.create("transferTransaction")(recieverAddress, amount, message);

		// Prepare the transfer transaction object
		var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

		// Serialize transfer transaction and announce
		nem.model.transactions.send(common, transactionEntity, endpoint);
	}

};