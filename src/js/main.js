$(document).ready(function() {

	var nem = require("nem-sdk").default;

	// Create an NIS endpoint object
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

	// create common object to store private key
	var common = nem.model.objects.get("common");

	// Get an empty un-prepared transfer transaction object
	var transferTransaction = nem.model.objects.get("transferTransaction");

	// Nemesis Block's Time (to calculate the time of a transaction using timestamp)
	var nemesisTime = 1427587585;

	var cookieData = document.cookie;
	if(cookieData != undefined && cookieData != "") {

	    var ca = cookieData.split(';');
	    var ky = ca[0];


	    // Private key of the user
	    var priKey = ky.substring("privateKey=".length,cookieData.length);

	    // Public address of the user

	    var keyPair = nem.crypto.keyPair.create(priKey);
	    var publicKey = keyPair.publicKey.toString();
	    // NEM Address of the user 			// here we use testnet network ID
	    var address = nem.model.address.toAddress(publicKey, nem.model.network.data.testnet.id);
	}

	var newBountyPool = "TC2HLXSGBOBIVZHDHOHFYCERJDOIFPLDQC3QAKZL";
	var closedBountyPool = "TAGI6BUAY4VDNAQJWXL5VH6A5MUGSFXO34LNALB3";

	// dishendra's account : TB5C7AVB2XPGMSTVDZX3GIBBQ3TXRN3GXPTUURTU
	// himanshu's account  : TABVE6MB5FOPQBAGE5NZNJZ6744JQJL65OKPPO4H

	/*
	/	Logout function
	*/

	var delete_cookie = function(name) {
	    document.cookie = name+'=; Max-Age=-99999999;';  
	};


	function send(msg) {
		// Check form for errors
		if(!priKey || !newBountyPool) return alert('private key missing !');
		if (!nem.model.address.isValid(nem.model.address.clean(newBountyPool))) return alert('Invalid recipent address !');

		// Set the private key in common object
		common.privateKey = priKey;

		// Check private key for errors
		if (common.privateKey.length !== 64 && common.privateKey.length !== 66) return alert('Invalid private key, length must be 64 or 66 characters !');
    	if (!nem.utils.helpers.isHexadecimal(common.privateKey)) return alert('Private key must be hexadecimal only !');
		// Set the cleaned amount into transfer transaction object
		transferTransaction.amount = nem.utils.helpers.cleanTextAmount(0);

		// Recipient address must be clean (no hypens: "-")
		transferTransaction.recipient = nem.model.address.clean(newBountyPool);

		// Set message
		transferTransaction.message = msg;

		// Prepare the updated transfer transaction object
		var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);
		
		// Serialize transfer transaction and announce
		nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res){
			// If code >= 2, it's an error
			if (res.code >= 2) {
				alert(JSON.stringify(res));
			} else {
				alert(JSON.stringify(res));
			}
		}, function(err) {
			alert(JSON.stringify(err));
		});
	}


	function sendToOwner(recipientAddr, msg) {
		// Check form for errors
		if(!priKey || !newBountyPool) return alert('private key missing !');
		if (!nem.model.address.isValid(nem.model.address.clean(newBountyPool))) return alert('Invalid recipent address !');

		// Set the private key in common object
		common.privateKey = priKey;

		// Check private key for errors
		if (common.privateKey.length !== 64 && common.privateKey.length !== 66) return alert('Invalid private key, length must be 64 or 66 characters !');
    	if (!nem.utils.helpers.isHexadecimal(common.privateKey)) return alert('Private key must be hexadecimal only !');
		// Set the cleaned amount into transfer transaction object
		transferTransaction.amount = nem.utils.helpers.cleanTextAmount(0);

		// Recipient address must be clean (no hypens: "-")
		transferTransaction.recipient = nem.model.address.clean(recipientAddr);

		// Set message
		transferTransaction.message = msg;

		// Prepare the updated transfer transaction object
		var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);
		
		// Serialize transfer transaction and announce
		nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res){
			// If code >= 2, it's an error
			if (res.code >= 2) {
				alert(JSON.stringify(res));
			} else {
				alert(JSON.stringify(res));
			}
		}, function(err) {
			alert(JSON.stringify(err));
		});
	}


		function sendAmount(recipientAddr, amount, msg) {
			// Check form for errors
			if(!priKey || !newBountyPool) return alert('private key missing !');
			if (!nem.model.address.isValid(nem.model.address.clean(newBountyPool))) return alert('Invalid recipent address !');

			// Set the private key in common object
			common.privateKey = priKey;

			// Check private key for errors
			if (common.privateKey.length !== 64 && common.privateKey.length !== 66) return alert('Invalid private key, length must be 64 or 66 characters !');
	    	if (!nem.utils.helpers.isHexadecimal(common.privateKey)) return alert('Private key must be hexadecimal only !');
			// Set the cleaned amount into transfer transaction object
			transferTransaction.amount = nem.utils.helpers.cleanTextAmount(amount);

			// Recipient address must be clean (no hypens: "-")
			transferTransaction.recipient = nem.model.address.clean(recipientAddr);

			// Set message
			transferTransaction.message = msg;

			// Prepare the updated transfer transaction object
			var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);
			
			// Serialize transfer transaction and announce
			nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res){
				// If code >= 2, it's an error
				if (res.code >= 2) {
					alert(JSON.stringify(res));
				} else {
					alert(JSON.stringify(res));
				}
			}, function(err) {
				alert(JSON.stringify(err));
			});
		}

	
	var $title;
	var $detail;
	var $amount;
	var $resultInfo;


	$("#create_bounty").on('click', ()=> {
		document.location = "./create_bounty.html";
	});

	$("#create_information").on('click', ()=> {
		document.location = "./create_information.html";
	});


	// create a bounty
	$("#submit_bounty_to_blockchain").on('click', ()=> {

		$title = $("#bounty_title").val();
		$detail = $("#bounty_details").val();
		$amount = $("#bounty_amount").val();

		/*
		* 	JSON {
		*	"t": "title",
		*	"d": "detail",
		*	"a": "amount",
		*	"p": "property"		// type of bounty i.e. Bounty/Information
		*	}
		*/

		if(($title != null || $title != "") && ($detail != null || $detail != "") && ($amount != null || $amount != "")) {
			var msg = '{"t":"'+$title+'","d":"'+$detail+'","a":"'+$amount+'","p":"b"}';
			send(msg);

		} else {
			alert("please check your input data.")
		}

		var time = 0;
		$up = $('#countdown_bounty');
		var miningCountdown = setInterval(()=>{
			$up.innerHTML = "wait "+(25-time)+" seconds for the transaction to get harvested.";
			time++;
		},1000)
		
		setTimeout(()=>{
			clearInterval(miningCountdown);
			document.location = "./index.html";
		},25000);

	});

	// create an information
	$("#submit_information_to_blockchain").on('click', ()=> {

		$title = $("#information_title").val();
		$detail = $("#information_details").val();
		$amount = $("#information_amount").val();

		if(($title != null || $title != "") && ($detail != null || $detail != "") && ($amount != null || $amount != "")) {
			var msg = '{"t":"'+$title+'","d":"'+$detail+'","a":"'+$amount+'","p":"i"}';
			transferTransaction.message = msg;
			send(msg);

		} else {
			alert("please check your input data.")
		}

	});


	/*
	/
	/ FETCH ALL Incoming TRANSACTIONS of an account
	/
	*/

	let allCompletedTransactions = [];
	let allCompletedHashes = {};

	readIncoming2 = function(address, startTrxId, successCallback, failureCallback) {

	        
	        // 3rd argument is the transaction hash (always empty)
	        // 4th argument is the transaction ID to begin with
	        nem.com.requests.account.transactions
	            .incoming(endpoint, address, null, startTrxId)
	            .then(function(response)
	        {
	            let transactions = response.data;
	            // console.log(transactions);
	            allCompletedTransactions = allCompletedTransactions.concat(transactions);
	            // console.log(allCompletedTransactions);
	            let lastId = startTrxId;
	            for (let i = 0; i < allCompletedTransactions.length; i++) {
	                let trx = transactions[i];
	                let tid = trx.meta.id;

	                lastId = tid; // parameter used for NIS request
	            }

	            if (transactions.length < 25) {
	                // done reading all incoming2 transactions for this account
	                if (typeof successCallback == "function") {
	                    return successCallback("success");
	                }
	            }

	            // recursion until we read all incoming2 transactions for this account.
	            return readIncoming2(address, lastId, successCallback, failureCallback);


	        }, function(error) {
	            console.log("NIS Error: " + JSON.stringify(error));
	            if (typeof failureCallback == "function") {
	                return failureCallback(error);
	            }
	        });
	    }

	/*
	/
	/	FETCH all incoming2 transactions from SERVERADDRESS
	/
	*/

	if(document.title == 'Home | TipHunter') {
	 	readIncoming2(closedBountyPool, null, function(success) {			//MODIFIED

	 		for(let i=0; i<allCompletedTransactions.length; i++) {
	 			try {
	 				msg = hex2a(allCompletedTransactions[i].transaction.message.payload);
	 				msg = msg.replace(/(\r\n|\n|\r)/gm,"");
	 				JSONmsg = JSON.parse(msg);
	 				result = JSONmsg.r;
	 				completedhash = JSONmsg.h;

	 				allCompletedHashes[completedhash] = result;
	 			} catch(e) {
	 				continue;
	 			}
	 		}
	 	}, function(failure) {
	 		console.log(failure);
	 	});
	 }




	/*
	/
	/ FETCH ALL INCOMING TRANSACTIONS of an account
	/
	*/

	let allTransactions = [];
	let userIncomingTransactions = [];
	let allTransactionsHash = {};
	let owner = {};

	readIncoming = function(localAddr, startTrxId, successCallback, failureCallback) {

	        nem.com.requests.account.transactions
	            .incoming(endpoint, localAddr, null, startTrxId)
	            .then(function(response)
	        {
	            let transactions = response.data;

	            if(localAddr == newBountyPool) {
	            	allTransactions = allTransactions.concat(transactions);
	            	for(let i=0; i<transactions.length; i++) {

	            		try {
	            			var ownerAddress = nem.model.address.toAddress(transactions[i].transaction.signer, nem.model.network.data.testnet.id);
	            			owner[transactions[i].meta.hash.data] = ownerAddress;
	            			if(allTransactions[i].transaction.message.payload == undefined) throw e;
	            			var msg = hex2a(allTransactions[i].transaction.message.payload);
	            			msg = msg.replace(/(\r\n|\n|\r)/gm,"");
	 						JSONmsg = JSON.parse(msg);
	 						allTransactionsHash[transactions[i].meta.hash.data] = JSONmsg;
	            		} catch(e) {
	            			allTransactionsHash[transactions[i].meta.hash.data] = true;
	            		}
	            		
	            	}
	            } else {
	            	userIncomingTransactions = userIncomingTransactions.concat(transactions);
	            }
	            
	            let lastId = startTrxId;
	            for (let i = 0; i < transactions.length; i++) {
	                let trx = transactions[i];
	                let tid = trx.meta.id;
	                lastId = tid; // parameter used for NIS request
	            }

	            if (transactions.length < 25) {
	                // done reading all incoming2 transactions for this account
	                if (typeof successCallback == "function") {
	                    return successCallback("success");
	                }
	            }

	            // recursion until we read all incoming2 transactions for this account.
	            return readIncoming(localAddr, lastId, successCallback, failureCallback);


	        }, function(error) {
	            console.log("NIS Error: " + JSON.stringify(error));
	            if (typeof failureCallback == "function") {
	                return failureCallback(error);
	            }
	        });
	    }


	/*
	/
	/ FETCH ALL THE Incoming TRANSACTIONS OF THE SERVERADDRESS
	/
	*/

	if(document.title == 'Home | TipHunter') {
		readIncoming(newBountyPool, null, function(success) {		//MODIFIED

			let bcount, icount;
			bcount = icount = 0;
			for(let i=0; i<allTransactions.length; i++) {
				msg = hex2a(allTransactions[i].transaction.message.payload);
				msg = msg.replace(/(\r\n|\n|\r)/gm,"");
				try {
					JSONmsg = JSON.parse(msg);
					title = JSONmsg.t;
					detail = JSONmsg.d;
					amount = JSONmsg.a;
					hash = allTransactions[i].meta.hash.data;

					if(JSONmsg.p == 'b') {
						if(!(allCompletedHashes[hash])) {
							fillBounties(title, detail, amount, hash);
							bcount++;
						}
					} else if(JSONmsg.p == 'i') {
						if(!(allCompletedHashes[hash])) {
							fillInformations(title ,detail, amount, hash);
							icount++;
						}
					} else {
						continue;
					}

				} catch(e) {
					continue;
				}
			}
			if(!bcount) {

				var mydiv = document.getElementById("bounty_row");
				var newDiv = document.createElement('div');
			    newDiv.innerHTML = "<div>No Bounty Available.</div>";
			    // alert(newDiv.innerHTML);

			    mydiv.appendChild(newDiv.firstChild);			  
			}
			if(!icount) {
				var mydiv = document.getElementById("information_row");
				var newDiv = document.createElement('div');
			    newDiv.innerHTML = "<div>No Information Available.</div>";

			    mydiv.appendChild(newDiv.firstChild);
			}

			$form = $('#submit_form');
			// Click Listeners for cards
			$('.information_btn').on('click',function(){
				$form.attr('action', 'view_information.html');
				$form.find('input')[0].value = $(this).attr('name');
			  	$form.submit();
			});

			$('.bounty_btn').on('click',function(){
				$form.attr('action', 'view_bounty.html');
				$form.find('input')[0].value = $(this).attr('name');
			  	$form.submit();
			});



		}, function(failure) {
			console.log(failure);
		});


	}

	/*
	/
	/	Fetch all Bounties/Informations Created by the user (For the Dashboard page)
	/
	*/

	var myBounties = [];
	var myBountiesHash = {};
	var myMessages = [];
	
	if(document.title == 'Dashboard | TipHunter') {

		readIncoming2(closedBountyPool, null, function(success){		//MODIFIED
			for(let i=0; i<allCompletedTransactions.length; i++) {
				try {
					msg = hex2a(allCompletedTransactions[i].transaction.message.payload);
					msg = msg.replace(/(\r\n|\n|\r)/gm,"");
					JSONmsg = JSON.parse(msg);
					result = JSONmsg.r;
					completedhash = JSONmsg.h;

					allCompletedHashes[completedhash] = result;
				} catch(e) {
					continue;
				}
			}
		}, function(failure) {
	 		console.log("failed to read server's incoming2 transactions.");
	 	});

		readIncoming(newBountyPool, null, function(success) {					// MODIFIED

			// read user's incoming transactions for any tip/bounty related message.
			readIncoming(address, null, function(success) {

				for(let i=0, j=0; i<allTransactions.length; i++) {
					if(allTransactions[i].transaction.signer == publicKey) {
						try {
							var msg = hex2a(allTransactions[i].transaction.message.payload);
							msg = msg.replace(/(\r\n|\n|\r)/gm,"");
							var hash = allTransactions[i].meta.hash.data;
							var JSONmsg = JSON.parse(msg);
							if(((JSONmsg.p == 'i') || (JSONmsg.p == 'b')) && !(allCompletedHashes[hash])) {
								myBounties.push(JSONmsg);
								j++;
								myBountiesHash[hash] = j;
								createBountyTable(j, JSONmsg.t, hash);
							}
						} catch(e) {
							continue;
						}
					}
				}

				for(let i=0, j=0; i<userIncomingTransactions.length; i++) {
					try {
						var msg = hex2a(userIncomingTransactions[i].transaction.message.payload);
						msg = msg.replace(/(\r\n|\n|\r)/gm,"");
						var sender = nem.model.address.toAddress(userIncomingTransactions[i].transaction.signer, nem.model.network.data.testnet.id);
						var JSONmsg = JSON.parse(msg);
						var hash = JSONmsg.h;
						if(myBountiesHash[hash]) {
							var date = toDate(parseInt(userIncomingTransactions[i].transaction.timeStamp)+nemesisTime);
							fillMessage(myBountiesHash[hash], JSONmsg, date, sender);
						}
					} catch(e) {
						continue;
					}
				}
				$popupBody = $('#popup_body');
				$popupTitle = $('#popup_title');
				$sender = $('#sender');

				$('.bounty_title').on('click',function(){

					var _hash = $(this)[0].attributes['data-hash'].value;
					var _title = $(this)[0].childNodes[0].wholeText;
					$popupBody.html('<p style="color: red;">Do you really want to close this bounty/information with a status of "fail" ?</p>');
					$popupTitle.html("<b>"+_title+"</b>");
					$('#accept_btn').css('display','none');
					$('#close_btn').css('display','inline-block');
					$('#close_btn').attr('data-hash', _hash);
				});
				$('.msg_dt').on('click',function(){

					$popupBody.html($(this).find('td')[0].innerText);
					$popupTitle.html("<b>Date:</b> "+$(this).find('td')[1].innerText);
					$sender.html('<b>Sender: </b>'+$(this)[0].attributes['data-sender'].value);
					$('#close_btn').css('display','none');
					$('#accept_btn').css('display','inline-block');
					$('#accept_btn').attr('data-hash', $(this)[0].attributes['data-hash'].value);
					$('#accept_btn').attr('data-sender', $(this)[0].attributes['data-sender'].value);
				});
				$('#accept_btn').on('click',function(){

					var _hash = $(this)[0].attributes['data-hash'].value;
					var _sender = $(this)[0].attributes['data-sender'].value;
					var _msg = '{"r":"p","h":"'+_hash+'"}';
					var _amount = allTransactionsHash[_hash].a;
					sendToOwner(closedBountyPool, _msg);
					_msg = '{"m":"bounty reward for sending the tip","h":"'+_hash+'"}';
					sendAmount(_sender, _amount, _msg);
				});
				$('#close_btn').on('click',function(){

					var _hash = $(this)[0].attributes['data-hash'].value;
					var _msg = '{"r":"f","h":"'+_hash+'"}';
					sendToOwner(closedBountyPool, _msg);
				});

			}, function(failure) {
				console.log("failed to read users incoming transactions.\n");
				console.log(failure);
			});



		}, function(failure) {
			console.log("failed to read server's incoming transactions.\n");
			console.log(failure);
		});
		
		
	}

	/*
	/
	/ populate the details in view_bounty page
	/
	*/

	if(document.title == 'View Bounty | TipHunter') {

		var searchHash = findGetParameter('hash');

		readIncoming2(closedBountyPool, null, function(success) {		//MODIFIED

			for(let i=0; i<allCompletedTransactions.length; i++) {
				try {
					msg = hex2a(allCompletedTransactions[i].transaction.message.payload);
					msg = msg.replace(/(\r\n|\n|\r)/gm,"");
					JSONmsg = JSON.parse(msg);
					result = JSONmsg.r;
					completedhash = JSONmsg.h;

					allCompletedHashes[completedhash] = result;
				} catch(e) {
					continue;
				}
			}
		}, function(failure) {
			console.log(failure);
		});

		readIncoming(newBountyPool, null, function(success) {		//MODIFIED


			try {
				if(allTransactionsHash[searchHash]) {
					try {
						JSONmsg = allTransactionsHash[searchHash];
						title = JSONmsg.t;
						detail = JSONmsg.d;
						amount = JSONmsg.a;
						property = JSONmsg.p;
					} catch(e) {}
					if(allCompletedHashes[searchHash]) {
						$('body').html('<div style="color: red; text-align: center; font-size: 2em;">Sorry, This bounty is Closed.</div>');
					} else {
						if(property == 'b') {
							fillViewBounty(title, detail, amount, owner[searchHash]);
						} else {
							$('body').html('<div style="color: red; text-align: center; font-size: 2em;">Sorry, the info you are trying to access is of type \'Information\' Visit the view_information page instead.</div>');
						}
					}
				} else {
					console.log(1);
					$('body').html('<div style="color: red; text-align: center; font-size: 2em;">Sorry, This bounty does not exist.</div>');
					console.log(2);
				}


				// listner for submit msg button
				$message = $('#message');
				var msg;
				$('#msg_submit').on('click', ()=>{
					msg = $message.val();
					var msgToSend = '{"m":"'+msg+'","h":"'+searchHash+'"}';
					recipent = owner[searchHash];
					sendToOwner(recipent, msgToSend);
				});

			} catch(e) {
				console.log('error'+e);
			}
		}, function(failure) {
			console.log(failure);
		});
	}


	/*
	/
	/ populate the details in view_information page
	/
	*/

	if(document.title == 'View Information | TipHunter') {

		var searchHash = findGetParameter('hash');

		readIncoming2(closedBountyPool, null, function(success) {		//MODIFIED

			for(let i=0; i<allCompletedTransactions.length; i++) {
				try {
					msg = hex2a(allCompletedTransactions[i].transaction.message.payload);
					msg = msg.replace(/(\r\n|\n|\r)/gm,"");
					JSONmsg = JSON.parse(msg);
					result = JSONmsg.r;
					completedhash = JSONmsg.h;

					allCompletedHashes[completedhash] = result;
				} catch(e) {
					continue;
				}
			}
		}, function(failure) {
			console.log(failure);
		});

		readIncoming(newBountyPool, null, function(success) {		//MODIFIED


			try {
				if(allTransactionsHash[searchHash]) {
					try {
						JSONmsg = allTransactionsHash[searchHash];
						title = JSONmsg.t;
						detail = JSONmsg.d;
						amount = JSONmsg.a;
						property = JSONmsg.p;
					} catch(e) {}
					if(allCompletedHashes[searchHash]) {
						$('body').html('<div style="color: red; text-align: center; font-size: 2em;">Sorry, This information is Closed.</div>');
					} else {
						if(property == 'i') {
							fillViewInformation(title, detail, amount, owner[searchHash]);
						} else {
							$('body').html('<div style="color: red; text-align: center; font-size: 2em;">Sorry, the info you are trying to access is of type \'Bounty\' Visit the view_bounty page instead.</div>');
						}
					}
				} else {
					console.log(1);
					$('body').html('<div style="color: red; text-align: center; font-size: 2em;">Sorry, This information does not exist.</div>');
					console.log(2);
				}

			} catch(e) {
				console.log('error'+e);
			}

			// listner for submit msg button
			$message = $('#message');
			var msg;
			$('#msg_submit').on('click', ()=>{
				msg = $message.val();
				var msgToSend = '{"m":"'+msg+'","h":"'+searchHash+'"}';
				recipent = owner[searchHash];
				sendToOwner(recipent, msgToSend);
			});

		}, function(failure) {
			console.log(failure);
		});
	}


	/*
	/ 
	/ Search page to find all the available and closed bounties by hash
	/
	*/

	if(document.title == 'Search | TipHunter') {

		var searchHash = findGetParameter('hash');
		$resultInfo = $('#result_info');
		$searchBounty = $('#search_bounty');
		$searchBounty.val(searchHash);


		readIncoming2(closedBountyPool, null, function(success) {		//MODIFIED

			for(let i=0; i<allCompletedTransactions.length; i++) {
				try {
					msg = hex2a(allCompletedTransactions[i].transaction.message.payload);
					msg = msg.replace(/(\r\n|\n|\r)/gm,"");
					JSONmsg = JSON.parse(msg);
					result = JSONmsg.r;
					completedhash = JSONmsg.h;

					allCompletedHashes[completedhash] = result;
				} catch(e) {
					continue;
				}
			}
		}, function(failure) {
			console.log(failure);
		});

		readIncoming(newBountyPool, null, function(success) {		//MODIFIED


			try {
				if(allTransactionsHash[searchHash]) {
					try {
						JSONmsg = allTransactionsHash[searchHash];
						title = JSONmsg.t;
						detail = JSONmsg.d;
						amount = JSONmsg.a;
					} catch(e) {}
					$resultInfo.html('<b style="color: green">Hash: '+searchHash+'.<br><br>Search Successful.</b><br><br>');
					if(allCompletedHashes[searchHash]) {
						$resultInfo.append('<b style="color: red">This bounty is already Closed.</b><hr>')
					} else {
						$resultInfo.append('<hr>');
					}
					fillBounties(title, detail, amount, searchHash);
				} else {
					$resultInfo.html('<b style="color: red">Unable to find any bounty/information with hash: '+searchHash+'.</b>');
				}

			} catch(e) {
				console.log('error'+e);
			}
		}, function(failure) {
			console.log(failure);
		});

		
		if(searchHash) {



			// console.log(ca);
		} else {
			$resultInfo.html('<b style="color: red">Unable to search. Please Enter hash in the search bar.</b>');
		}
		// console.log(hash);
	}


	/*
	/
	/ FUNCTION TO CONVERT HEX TO ASCII
	/
	*/

	function hex2a(hexx) {

		if(hexx == undefined) return "";
	    var hex = hexx.toString();//force conversion
	    var str = '';
	    for (var i = 0; i < hex.length; i += 2)
	        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	    return str;
	}

	/*
	/ Function to convert unix timestamp to Normal Date
	/
	/ @param (unix time)
	*/

	function toDate(unixTime) {

		var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
		var date = new Date();
		offset = date.getTimezoneOffset();
		off = offset*60;
		unixTime +=off;

		
		var date = new Date(unixTime*1000);
		var year = date.getFullYear();
		var month = months[parseInt(date.getMonth())];
		var monthdate = date.getDate();
		var hours = date.getHours();
		var minutes = "0" + date.getMinutes();
		var seconds = "0" + date.getSeconds();
        
		// Will display datetime in dd-mm-yyyy 10:30:23 format
		var formattedDate = monthdate+"-"+month+"-"+year+" "+hours+':'+minutes.substr(-2)+':'+seconds.substr(-2);
		return formattedDate;
	}

	/*
	/
	/ FUNCTION to populate the bounty cards on home page
	/
	*/

	function fillBounties(title,detail,amount,hash) {


		var a1 = '<div class="col-sm-6" style="padding-bottom: 10px;"><div class="card" style="padding: 10px; border: grey solid 1px; border-radius: 4px;"><div class="card-block"><h3 class="card-title">';
		var a2 = '</h3><p class="card-text"><input type="text" name="hash" hidden>';
		var a3 = '.<br></p><a class="bounty_btn btn btn-primary">Bounty Reward: ';
		var a4 = ' XEM</a></div></div></div>';

		var cardTemplate = a1+title+a2+detail+a3+amount+a4;
		// alert(cardTemplate

		var mydiv = document.getElementById("bounty_row");
		var newDiv = document.createElement('div');
	    newDiv.innerHTML = cardTemplate;
	    // alert(newDiv.innerHTML);

	    while (newDiv.firstChild) {
	        mydiv.appendChild(newDiv.firstChild);
	    }				
	    var anchor = mydiv.querySelectorAll('a');

	    anchor[anchor.length-1].name = hash;
	    // console.log(anchor[anchor.length-1].href);
	    // console.log(anchor);
	}


	/*
	/
	/ FUNCTION to populate the Information cards on home page
	/
	*/

	function fillInformations(title,detail,amount,hash) {

		var a1 = '<div class="col-sm-6" style="padding-bottom: 10px;"><div class="card" style="padding: 10px; border: grey solid 1px; border-radius: 4px;"><div class="card-block"><h3 class="card-title">';
		var a2 = '</h3><p class="card-text">';
		var a3 = '.<br></p><a class="information_btn btn btn-primary">Information Value: ';
		var a4 = ' XEM</a></div></div></div>';

		var cardTemplate = a1+title+a2+detail+a3+amount+a4;
		// alert(cardTemplate

		var mydiv = document.getElementById("information_row");
		var newDiv = document.createElement('div');
	    newDiv.innerHTML = cardTemplate;
	    // alert(newDiv.innerHTML);

	    while (newDiv.firstChild) {
	        mydiv.appendChild(newDiv.firstChild);
	    }					  
	    var anchor = mydiv.querySelectorAll('a');

	    anchor[anchor.length-1].name = hash;
	    // console.log(anchor[anchor.length-1].href);

	}

	/*
	/	Function to populate all the Bounties/Informations Created by the User on the Dashboard
	/
	/	@param (bounty number in the view, title of the bounty)
	*/

	function createBountyTable(number, title, hash) { // number is bounty number, title is bounty title, msg is array of all messages related to that bounty;

		
		if(number == 1) {
			var tableTemplate = '<table class="table table-bordered"><tbody id="bounty_table_body"><col width="40"></tbody></table>';
			var mydiv = document.getElementById("table_container");
			mydiv.innerHTML = tableTemplate;
		}

		var newTr = document.createElement('div');
		var trOuter =  `<tr>
		  					<th class="bounty_number" scope="row" style="color: red; font-size: 1.3em;"></th>
		  					<td><b data-hash="`+hash+`" data-toggle="modal" data-target="#popup" class="point-nocolor bounty_title">Bounty Title</b><br><br>
			  					<table class="table bounty_inner_table">
			  						<tbody>
			  						</tbody>
								</table>
			  				</td>
						</tr>`

		
		newDiv.innerHTML = trOuter;
		$tbody = $('#bounty_table_body');
		$tbody.append(trOuter);
		$tr = $('#bounty_table_body tr:nth-child('+number+')');
		$bountyNumber = $tr.children('th.bounty_number');
		$bountyNumber[0].innerHTML = number+".";
		$bountyTitle = $tr.children('td').children('b.bounty_title');
		$bountyTitle[0].innerHTML = title;		
	}


	/*
	/	Function to Fill the messages corresponding to a particular Bounty/Information.
	/
	/	@param (bounty number in the view, message of the sender, date of the message)
	*/

	function fillMessage(number, msg, date, sender) {

		var trInner =  `<tr data-toggle="modal" data-target="#popup" data-hash="`+msg.h+`" data-sender="`+sender+`" class="point msg_dt">
						  <td scope="col" class=" limit_char same_line message"><span class="glyphicon glyphicon-triangle-right"></span> </td>
						  <td scope="col" class="message_date"></td>
						</tr><br>`
	
		$tr = $('#bounty_table_body tr:nth-child('+number+')');
		$innerTable = $tr.find('table');
		$innerBody = $innerTable.find('tbody');
		$innerBody.append(trInner);
		$message = $innerBody.find('td.message').last();
		$message.append(msg.m);
		$msgDate = $innerBody.find('td.message_date').last();
		$msgDate.append(date);
	}

	/*
	/ Function to retrieve the GET parameter from the search bar
	/
	/ @param : parameterName
	/
	/ @return :string contaning the parameter;
	*/

	function findGetParameter(parameterName) {
		var result = null,
		    tmp = [];
		location.search
		    .substr(1)
		    .split("&")
		    .forEach(function (item) {
		      tmp = item.split("=");
		      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
		});
		return result;
	}

	/*
	/
	/ function to fill details view_bounty page
	/
	*/

	function fillViewBounty(title, detail, amount, owner) {

		var hash = findGetParameter('hash');
		$title = $('#bounty_title');
		$detail = $('#bounty_details');
		$reward = $('#reward_value');
		$owner = $('#owner');

		$title.html(title);
		$detail.html(detail);
		$reward.html(amount+" XEM");
		$owner.html(owner);
	}


	/*
	/
	/ function to fill details view_information page
	/
	*/

	function fillViewInformation(title, detail, amount, owner) {

		var hash = findGetParameter('hash');
		$title = $('#info_title');
		$detail = $('#info_details');
		$reward = $('#reward_value');
		$owner = $('#owner');

		$title.html(title);
		$detail.html(detail);
		$reward.html(amount+" XEM");
		$owner.html(owner);
	}

	setTimeout(()=>{
		$('#logout').on('click',()=>{
			delete_cookie("userName");
			delete_cookie("PrivateKey");
			window.location = "./login.html";
		});
	},3000)
});