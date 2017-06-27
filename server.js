/*
  Browser Commander
  By 54chi - Feb 2017
  Remote control your browser via REST services
*/
require('dotenv').config();
var express = require('express');
var app = express();

// selenium-webdriver for NodeJS
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();
var timeout = 10000;

// opens a chrome browser
driver.manage().window().maximize();
driver.manage().timeouts().implicitlyWait(timeout);

var requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(requestTime)

var JiraLogin = function(driver){
  driver.getCurrentUrl().then(
    function(currentUrl){
      if (currentUrl.indexOf("login") > -1){
        //login if needed
        console.log("login");
        driver.findElement(By.id("username")).sendKeys(process.env.JIRA_USERNAME);
        driver.findElement(By.id("login-submit")).click() ;
        driver.wait(function () {
          return driver.findElement(By.id("password")).isEnabled();
        }, timeout);
        driver.findElement(By.id("password")).sendKeys(process.env.JIRA_PASSWORD);
        driver.findElement(By.id("login-submit")).click() ;
      }
    }
  );
}

// Start Custom Browser Commands //
  app.get('/apps/homepage', function(req, res) {
    // opens HP
    driver.get(process.env.HOMEPAGE_URL);
    res.send([{action: 'apps/homepage', url: process.env.HOMEPAGE_URL, requestTime: req.requestTime}]);
  });
  app.get('/apps/jira', function(req, res) {
    // opens JIRA
    driver.get(process.env.JIRA_URL);
    //  driver.sleep(timeout);
    JiraLogin(driver);
    res.send([{action: 'apps/jira', url: process.env.JIRA_URL, requestTime: req.requestTime}]);
  });
  app.get('/apps/jira/:id', function(req, res) {
    driver.get(process.env.JIRA_URL_TICKETBASE+req.params.id);
    JiraLogin(driver);
    res.send([{action: 'apps/jira/:id', url: process.env.JIRA_URL_TICKETBASE+req.params.id, requestTime: req.requestTime}]);
  });
  app.get('/apps/confluence/:searchText', function(req, res) {
    driver.get(process.env.CONFLUENCE_URL+encodeURI(req.params.searchText)+"%22+and+space+in+("+process.env.CONFLUENCE_SPACES+")");
    JiraLogin(driver);
    res.send([{action: '/apps/confluence/:searchText', url: process.env.CONFLUENCE_URL+encodeURI(req.params.searchText)+"%22+and+space+in+("+process.env.CONFLUENCE_SPACES+")", requestTime: req.requestTime}]);
  });
  app.get('/apps/youtube', function(req, res) {
    driver.get(process.env.PLAYLIST_URL);
    driver.findElement(By.className("ytp-fullscreen-button")).click();
    res.send([{action: 'apps/youtube', url: process.env.PLAYLIST_URL, requestTime: req.requestTime}]);
  });
// End Custom Browser commands //

// Start General Browser Commands //
  app.get('/command/back',function(req,res){
    driver.navigate().back();
    res.send([{action: 'command/back', requestTime: req.requestTime}]);
  });
  app.get('/command/forward',function(req,res){
    driver.navigate().forward();
    res.send([{action: 'command/forward', requestTime: req.requestTime}]);
  });
  app.get('/command/refresh',function(req,res){
    driver.executeScript("document.location.reload()");
    res.send([{action: 'command/refresh', requestTime: req.requestTime}]);
  });
  app.get('/command/scrollX/:pixels',function(req,res){
    try{
      var tActions = driver.touchActions();
      tActions.scroll({x: Number(req.params.pixels), y:0}).perform();
    }catch (err){
      console.log(err)
    }
    res.send([{action: 'command/scrollX/:pixels', requestTime: req.requestTime}]);
  });
  app.get('/command/scrollY/:pixels',function(req,res){
    try{
      var tActions = driver.touchActions();
      tActions.scroll({x: 0,y: Number(req.params.pixels)}).perform();
    }catch (err){
      console.log(err)
    }
    res.send([{action: 'command/scrollY/:pixels', requestTime: req.requestTime}]);
  });
// End General Browser commands //

app.listen(3000);
console.log('Browser Commander - Listening on port 3000...');
