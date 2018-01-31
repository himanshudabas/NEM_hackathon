$(document).ready(function() {

	var cookieData = document.cookie;
    var priKey = cookieData.substring("privateKey=".length,cookieData.length);
	// require the nem-sdk module
	var nem = require("nem-sdk").default;

	// Create an NIS endpoint object
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

	// create common object to store private key
	var common = nem.model.objects.get("common");

	var recipient = "TABVE6MB5FOPQBAGE5NZNJZ6744JQJL65OKPPO4H";

	// dishendra's account : TB5C7AVB2XPGMSTVDZX3GIBBQ3TXRN3GXPTUURTU
	// himanshu's account  : TABVE6MB5FOPQBAGE5NZNJZ6744JQJL65OKPPO4H

	// Get an empty un-prepared transfer transaction object
	var transferTransaction = nem.model.objects.get("transferTransaction");







	function send(msg) {
		// Check form for errors
		if(!priKey || !recipient) return alert('private key missing !');
		if (!nem.model.address.isValid(nem.model.address.clean(recipient))) return alert('Invalid recipent address !');

		// Set the private key in common object
		common.privateKey = priKey;

		// Check private key for errors
		if (common.privateKey.length !== 64 && common.privateKey.length !== 66) return alert('Invalid private key, length must be 64 or 66 characters !');
    	if (!nem.utils.helpers.isHexadecimal(common.privateKey)) return alert('Private key must be hexadecimal only !');
		// Set the cleaned amount into transfer transaction object
		transferTransaction.amount = nem.utils.helpers.cleanTextAmount(0);

		// Recipient address must be clean (no hypens: "-")
		transferTransaction.recipient = nem.model.address.clean(recipient);

		// Set message
		transferTransaction.message = msg;

		// Prepare the updated transfer transaction object
		var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

		// Serialize transfer transaction and announce
		nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res){
			// If code >= 2, it's an error
			if (res.code >= 2) {
				alert(res.message);
			} else {
				alert(res.message);
			}
		}, function(err) {
			alert(JSON.stringify(err));
		});
	}

	
	var $title;
	var $detail;
	var $amount;

	$("#create_bounty").on('click', ()=> {
		document.location = "./bounty.html";
	});

	$("#create_information").on('click', ()=> {
		document.location = "./information.html";
	});

	// create a bounty
	$("#submit_bounty_to_blockchain").on('click', ()=> {

		$title = $("#bounty_title").val();
		$detail = $("#bounty_details").val();
		$amount = $("#bounty_amount").val();

		if(($title != null || $title != "") && ($detail != null || $detail != "") && ($amount != null || $amount != "")) {
			var msg = '{"t":"'+$title+'","d":"'+$detail+'","a":"'+$amount+'"}';
			send(msg);

		} else {
			alert("please check your input data.")
		}
		document.location = "./bounty.html";
	});

	// create an information
	$("#submit_information_to_blockchain").on('click', ()=> {

		$title = $("#information_title").val();
		$detail = $("#information_details").val();
		$amount = $("#information_amount").val();

		if(($title != null || $title != "") && ($detail != null || $detail != "") && ($amount != null || $amount != "")) {
			var msg = '{"t":"'+$title+'","d":"'+$detail+'","a":"'+$amount+'"}';
			transferTransaction.message = msg;
			send(msg);

		} else {
			alert("please check your input data.")
		}
		document.location = "./information.html";
	});

});