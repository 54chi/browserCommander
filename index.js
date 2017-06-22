/*
1) Open a browser using OPN (with a fixed URL)
2) Set a REST api to receive a URL
3) Redirect browser with the URL
4) Connect this with an Alexa skill
*/

var http = require("http");
var qs = require("querystring");
const opn = require('opn');
var testUrl="";

http.createServer(function(req, res){

	//length of http://localhost:3030?url=
	res.writeHead(301, {
		"location" : decodeURIComponent(testUrl)
	});

	console.log(res);
	res.end();

}).listen(3030, "127.0.0.1");

testUrl=encodeURIComponent("https://cloudcraze.atlassian.net/secure/RapidBoard.jspa?rapidView=55&view=detail&quickFilter=365#");
console.log(testUrl);
// Opens the url in the default browser
opn('http://localhost:3030', {wait:false});
