/*
1) Open a browser using OPN (with a fixed URL)
2) Set a REST api to receive a URL
3) Redirect browser with the URL
4) Connect this with an Alexa skill
*/

var http = require("http");
const opn = require('opn');

http.createServer(function(req, res){
	res.writeHead(301, {
		"location" : "http://54chi.com"
	});
	res.end();
}).listen(3030, "127.0.0.1");

console.log("server redirects from localhost to technotip.org")

// Opens the url in the default browser
//opn('http://localhost:3030', {app: 'firefox', wait:false});
