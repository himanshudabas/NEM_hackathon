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
    var ca = cookieData.split(';');
    var ky = ca[0]

    // Private key of the user
    var priKey = ky.substring("privateKey=".length,cookieData.length);

    // Public address of the user
    var keyPair = nem.crypto.keyPair.create(priKey);
    var publicKey = keyPair.publicKey.toString();

    // NEM Address of the user 			// here we use testnet network ID
    var address = nem.model.address.toAddress(publicKey, nem.model.network.data.testnet.id)

	var serverAddress = "TABVE6MB5FOPQBAGE5NZNJZ6744JQJL65OKPPO4H";

	// dishendra's account : TB5C7AVB2XPGMSTVDZX3GIBBQ3TXRN3GXPTUURTU
	// himanshu's account  : TABVE6MB5FOPQBAGE5NZNJZ6744JQJL65OKPPO4H

	/*
	/	Logout function
	*/

	$(".logout").on('click',()=>{
		delete_cookie("userName");
		delete_cookie("PrivateKey");
		window.location = "./login.html";
	})

	var delete_cookie = function(name) {
	    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	};


	function send(msg) {
		// Check form for errors
		if(!priKey || !serverAddress) return alert('private key missing !');
		if (!nem.model.address.isValid(nem.model.address.clean(serverAddress))) return alert('Invalid recipent address !');

		// Set the private key in common object
		common.privateKey = priKey;

		// Check private key for errors
		if (common.privateKey.length !== 64 && common.privateKey.length !== 66) return alert('Invalid private key, length must be 64 or 66 characters !');
    	if (!nem.utils.helpers.isHexadecimal(common.privateKey)) return alert('Private key must be hexadecimal only !');
		// Set the cleaned amount into transfer transaction object
		transferTransaction.amount = nem.utils.helpers.cleanTextAmount(0);

		// Recipient address must be clean (no hypens: "-")
		transferTransaction.recipient = nem.model.address.clean(serverAddress);

		// Set message
		transferTransaction.message = msg;

		// Prepare the updated transfer transaction object
		var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);
		
		// Serialize transfer transaction and announce
		nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res){
			// If code >= 2, it's an error
			if (res.code >= 2) {
				alert(res);
			} else {
				alert(res);
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

		// var time = 0;
		// $up = $('#countdown_information');
		// var miningCountdown = setInterval(()=>{
		// 	$up.innerHTML = "wait "+(25-time)+" seconds for the transaction to get harvested.";
		// 	time++;
		// },1000)
		
		// setTimeout(()=>{
		// 	clearInterval(miningCountdown);
		// 	document.location = "./index.html";
		// },25000);
	});


	/*
	/
	/ FETCH ALL OUTGOING TRANSACTIONS of an account
	/
	*/

	let allCompletedTransactions = [];
	let allCompletedHashes = {};

	readOutgoing = function(address, startTrxId, successCallback, failureCallback) {

	        
	        // 3rd argument is the transaction hash (always empty)
	        // 4th argument is the transaction ID to begin with
	        nem.com.requests.account.transactions
	            .outgoing(endpoint, address, null, startTrxId)
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
	                // done reading all outgoing transactions for this account
	                if (typeof successCallback == "function") {
	                    return successCallback("success");
	                }
	            }

	            // recursion until we read all outgoing transactions for this account.
	            return readOutgoing(address, lastId, successCallback, failureCallback);


	        }, function(error) {
	            console.log("NIS Error: " + JSON.stringify(error));
	            if (typeof failureCallback == "function") {
	                return failureCallback(error);
	            }
	        });
	    }

	/*
	/
	/	FETCH all outgoing transactions from SERVERADDRESS
	/
	*/

	if(document.title == 'Home | TipHunter') {
	 	readOutgoing(serverAddress, null, function(success) {

	 		for(let i=0; i<allCompletedTransactions.length; i++) {
	 			try {
	 				msg = hex2a(allCompletedTransactions[i].transaction.message.payload);
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

	readIncoming = function(address, startTrxId, successCallback, failureCallback) {

	        

	        // 3rd argument is the transaction hash (always empty)
	        // 4th argument is the transaction ID to begin with 
	        nem.com.requests.account.transactions
	            .incoming(endpoint, address, null, startTrxId)
	            .then(function(response)
	        {
	            let transactions = response.data;
	            if(address == serverAddress) {
	            	allTransactions = allTransactions.concat(transactions);
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
	                // done reading all outgoing transactions for this account
	                if (typeof successCallback == "function") {
	                    return successCallback("success");
	                }
	            }

	            // recursion until we read all outgoing transactions for this account.
	            return readIncoming(address, lastId, successCallback, failureCallback);


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
		readIncoming(serverAddress, null, function(success) {

			let bcount, icount;
			bcount = icount = 0;
			for(let i=0; i<allTransactions.length; i++) {
				msg = hex2a(allTransactions[i].transaction.message.payload);
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

		readOutgoing(serverAddress, null, function(success){
			for(let i=0; i<allCompletedTransactions.length; i++) {
				try {
					msg = hex2a(allCompletedTransactions[i].transaction.message.payload);
					JSONmsg = JSON.parse(msg);
					result = JSONmsg.r;
					completedhash = JSONmsg.h;

					allCompletedHashes[completedhash] = result;
				} catch(e) {
					continue;
				}
			}
		}, function(failure) {
	 		console.log("failed to read server's outgoing transactions.");
	 	});

		readIncoming(serverAddress, null, function(success) {

			// read user's incoming transactions for any tip/bounty related message.
			readIncoming(address, null, function(success) {

				for(let i=0, j=0; i<allTransactions.length; i++) {
					if(allTransactions[i].transaction.signer == publicKey) {
						try {
							var msg = hex2a(allTransactions[i].transaction.message.payload);
							var hash = allTransactions[i].meta.hash.data;
							var JSONmsg = JSON.parse(msg);
							if(((JSONmsg.p == 'i') || (JSONmsg.p == 'b')) && !(allCompletedHashes[hash])) {
								myBounties.push(JSONmsg);
								j++;
								myBountiesHash[hash] = {bnty_nbr:j,msg_nbr:0};
								// console.log(myBountiesHash[hash]);
								createBountyTable(j, JSONmsg.t);
							}
						} catch(e) {
							continue;
						}
					}
				}

				for(let i=0, j=0; i<userIncomingTransactions.length; i++) {
					try {
						var msg = hex2a(userIncomingTransactions[i].transaction.message.payload);
						var JSONmsg = JSON.parse(msg);
						var hash = JSONmsg.h;
						if(myBountiesHash[hash].bnty_nbr) {
						// console.log(hash);
							myBountiesHash[hash].msg_nbr++;
							// console.log(myBountiesHash[hash]);
							var date = toDate(parseInt(userIncomingTransactions[i].transaction.timeStamp)+nemesisTime);
							fillMessage(myBountiesHash[hash].bnty_nbr, JSONmsg.m, date, hash);
						}
					} catch(e) {
						continue;
					}
				}

			}, function(failure) {
				console.log("failed to read users incoming transactions.\n");
				console.log(failure);
			})
		}, function(failure) {
			console.log("failed to read server's incoming transactions.\n");
			console.log(failure);
		});
		
		
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
		var a2 = '</h3><p class="card-text">';
		var a3 = '.<br></p><a href="#" class="btn btn-primary">Bounty Reward: ';
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


	}


	/*
	/
	/ FUNCTION to populate the Information cards on home page
	/
	*/

	function fillInformations(title,detail,amount,hash) {

		var a1 = '<div class="col-sm-6" style="padding-bottom: 10px;"><div class="card" style="padding: 10px; border: grey solid 1px; border-radius: 4px;"><div class="card-block"><h3 class="card-title">';
		var a2 = '</h3><p class="card-text">';
		var a3 = '.<br></p><a href="#" class="btn btn-primary">Information Value: ';
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


	}

	/*
	/	Function to populate all the Bounties/Informations Created by the User on the Dashboard
	/
	/	@param (bounty number in the view, title of the bounty)
	*/

	function createBountyTable(number, title) { // number is bounty number, title is bounty title, msg is array of all messages related to that bounty;

		
		if(number == 1) {
			var tableTemplate = '<table class="table table-bordered"><tbody id="bounty_table_body"><col width="40"></tbody></table>';
			var mydiv = document.getElementById("table_container");
			mydiv.innerHTML = tableTemplate;
		}

		var newTr = document.createElement('div');
		var trOuter =  `<tr>
		  					<th class="bounty_number" scope="row"></th>
		  					<td><b class="bounty_title" >Bounty Title</strong><br><br>
			  					<table class="table bounty_inner_table">
								</table>
			  				</td>
						</tr>`

		

		newDiv.innerHTML = trOuter;
		$tbody = $('#bounty_table_body');
		$tbody.append(trOuter);
		$tr = $('#bounty_table_body tr:nth-child('+number+')');
		$bountyNumber = $tr.children('th.bounty_number');
		$bountyNumber[0].innerHTML = number+".";
		$bountyTitle = $tr.children('td').children('strong.bounty_title');
		$bountyTitle[0].innerHTML = title;
		// var tableTemplate = a1+number+a2+title+a3+msg+a4+msg;
		
	}


	/*
	/	Function to Fill the messages corresponding to a particular Bounty/Information.
	/
	/	@param (bounty number in the view, message of the sender, date of the message)
	*/

	function fillMessage(bounty_number, msg, date, hash) {
// console.log(myBountiesHash[hash].msg_nbr);
		var trInner =  `<tr class="point">
						  <td scope="col" class="message limit_char same_line message"><span class="glyphicon glyphicon-triangle-right"></span> </td>
						  <td scope="col" class="message_date"></td>
						</tr><br>`

		$tr = $('#bounty_table_body tr:nth-child('+bounty_number+')');
		$innerTable = $tr.find('table');
		$innerTr = $innerTable.find('tr:eq(0)');
		console.log(myBountiesHash[hash].msg_nbr);
		console.log($innerTr);
		$innerTable.append(trInner);
		$message = $innerTable.find('td.message:nth-child('+myBountiesHash[hash].msg_nbr+')');
		// console.log($message);
		$message.append(msg);
		$msgDate = $innerTable.find('td.message_date:nth-child('+myBountiesHash[hash].msg_nbr+')');
		// console.log($msgDate);
		// console.log($msgDate);
		$msgDate.append(date);
	}



});