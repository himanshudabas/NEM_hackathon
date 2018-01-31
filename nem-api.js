var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();
var transfer 	   =		 require("./transfer");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/createbounty',function(req,res){
	// var user_name=req.body.public;
	// var password=req.body.password;
	// res.setHeader('Content-Type', 'application/json');
	// res.send(JSON.stringify({ a: 1 }, null, 3));
	transfer.sendNEM(req.body.senderPassword, req.body.senderKey, 
		req.body.recieverAddress, req.body.amount, req.body.message);
	// transfer.sendNEM("root123", 
	// "82edc2d2bc60d42e4894cc4592d0e1ad12a7a2d58bbd1ce35c27c014eda743ae" ,
	// "TABVE6-MB5FOP-QBAGE5-NZNJZ6-744JQJ-L65OKP-PO4H", 1 , "testing");
	res.send("XEM send");
});

app.listen(3000,function(){
  console.log("Started on PORT 3000");
})

//		SEND post request with json like this
// json = {
// 	"senderPassword"  	: "root123", 
// 	"senderKey"			: "82edc2d2bc60d42e4894cc4592d0e1ad12a7a2d58bbd1ce35c27c014eda743ae" ,
// 	"recieverAddress"	: "TABVE6-MB5FOP-QBAGE5-NZNJZ6-744JQJ-L65OKP-PO4H",
// 	"amount" 			: 0.1, 
// 	"message"         	: "testing using express post"
// }