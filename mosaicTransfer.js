/*

Module used : https://github.com/QuantumMechanics/NEM-sdk

*/

var nem = require('nem-sdk').default;

var endpoint = nem.model.objects.create('endpoint')(nem.model.nodes.defaultTestnet,'7890');

var common = nem.model.objects.create('common')('','82edc2d2bc60d42e4894cc4592d0e1ad12a7a2d58bbd1ce35c27c014eda743ae');

var transferTransaction = nem.model.objects.create("transferTransaction")("TABVE6MB5FOPQBAGE5NZNJZ6744JQJL65OKPPO4H", 1, "bounty template");

var mosaicAttachment2 = nem.model.objects.create("mosaicAttachment")("dishendra", "bounty", 1);

var mosaicDefinitionMetaDataPair = nem.model.objects.get("mosaicDefinitionMetaDataPair");

// nem.com.requests.namespace.mosaicDefinitions(endpoint, mosaicAttachment.mosaicId.namespaceId).then(function(res) {console.log(JSON.stringify(res))});

nem.com.requests.namespace.mosaicDefinitions(endpoint, mosaicAttachment2.mosaicId.namespaceId).then(function(res) {

	// Look for the mosaic definition(s) we want in the request response (Could use ["eur", "usd"] to return eur and usd mosaicDefinitionMetaDataPairs)
	var neededDefinition = nem.utils.helpers.searchMosaicDefinitionArray(res.data, ["bounty"]);
	console.log(JSON.stringify(res));
	// Get full name of mosaic to use as object key
	var fullMosaicName  = nem.utils.format.mosaicIdToName(mosaicAttachment2.mosaicId);
	
	// Check if the mosaic was found
	if(undefined === neededDefinition[fullMosaicName]) {
		return console.error("Mosaic not found !");
	}

	// Set bounty mosaic definition into mosaicDefinitionMetaDataPair
	mosaicDefinitionMetaDataPair[fullMosaicName] = {};
	
	mosaicDefinitionMetaDataPair[fullMosaicName].mosaicDefinition = neededDefinition[fullMosaicName];
	//console.log(mosaicDefinitionMetaDataPair);
	//console.log(neededDefinition[fullMosaicName]);
	
	transferTransaction.mosaics.push(mosaicAttachment2);
	//console.log(transferTransaction)
	
	// Prepare the transfer transaction object
	var transactionEntity = nem.model.transactions.prepare("mosaicTransferTransaction")(common, transferTransaction, mosaicDefinitionMetaDataPair, nem.model.network.data.testnet.id);
	//console.log(transactionEntity);

	// Serialize transfer transaction and announce
	//nem.model.transactions.send(common, transactionEntity, endpoint)
}, 
function(err) {
	console.error(err);
});
