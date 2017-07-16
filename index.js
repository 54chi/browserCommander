// Import alexia and create new app
const alexia = require('alexia');
const app = alexia.createApp('BrowserCommander', {shouldEndSessionByDefault: true});

/*
  Since Alexa will call another REST server that is tasked to
  operate the browser, and that the intention is that the browser is
  visible to the Alexa user all the time, there is no need for
  us to keep track of the request completion (e.g. no need for callbacks)
*/
const http = require('http');

// URL that points to your org's Browser Commander app
//const BROWSERCOMMANDER_APP_URL = process.env.BROWSERCOMMANDER_APP_URL;
const BROWSERCOMMANDER_APP_URL = "http://localhost:3000";
const HOMEPAGE_ENDPOINT   = BROWSERCOMMANDER_APP_URL + "/apps/homepage";
const JIRA_ENDPOINT       = BROWSERCOMMANDER_APP_URL + "/apps/jira";
const CONFLUENCE_ENDPOINT = BROWSERCOMMANDER_APP_URL + "/apps/confluence";
const YOUTUBE_ENDPOINT    = BROWSERCOMMANDER_APP_URL + "/apps/youtube";
const BACK_COMMAND        = BROWSERCOMMANDER_APP_URL + "/command/back";
const FORWARD_COMMAND     = BROWSERCOMMANDER_APP_URL + "/command/forward";
const REFRESH_COMMAND     = BROWSERCOMMANDER_APP_URL + "/command/refresh";
const SCROLLUP_COMMAND    = BROWSERCOMMANDER_APP_URL + "/command/scrollY/-1000";
const SCROLLDOWN_COMMAND  = BROWSERCOMMANDER_APP_URL + "/command/scrollY/1000";


/**
 * Register callback to be executed once app is started without any intent.
 * Example invocation: 'Alexa, start Browser Commander'
 */

 app.onStart(() => {
   return 'Welcome to Browser Commander Alexa App. Tell me what you want to get started, or say "HELP" to get a list of commands you can use';
 });

/**
 * Register callback to be executed when app is being terminated.
 */
app.onEnd(() => {
  return app.t('Thank you for using Browser Commander');
});


/** INTENTS **/
/* Example invocation 1:
 *      - 'Alexa, ask <my-app-name> to say hello'
 *
 * Example invocation 2:
 *      - 'Alexa, start <my-app-name>'
 *      - 'hello'
 */
app.intent('HelloIntent', 'Hello', () => {
   return 'Hello there.';
});

app.intent('HelpIntent', 'Help', () => {
   return 'You can ask me to: open Homepage, play Youtube, open Jira, open a Jira ticket and search in Confluence, as well as browser commands like: refresh, go back, go forward, scroll up and scroll down.';
});

app.intent('HomeIntent', 'OpenHomePage', () => {
  var url = HOMEPAGE_ENDPOINT;
  console.log("Endpoint to execute: "+ url);
  http.get(url, () => {
    console.log("Called: " + url)
  }).on('error', (e) =>{
    console.log("Got error: " + e)
  })
  return 'Opening Home Page';
});

app.intent('JiraIntent', 'OpenJiraPage', () => {
  var url = JIRA_ENDPOINT;
  console.log("Endpoint to execute: "+ url);
  http.get(url, () => {
    console.log("Called: " + url)
  }).on('error', (e) =>{
    console.log("Got error: " + e)
  })
  return 'Opening Jira Page';
});

app.intent('OpenJiraTicketIntent', 'OpenJiraTicket', (slots, attrs, data, done) => {
  if (!slots.item) {
    return done(app.t('Please provide a Jira ticket number'));
  }
  var url = JIRA_ENDPOINT+'/'+slots.item;
  console.log("Endpoint to execute: "+ url);
  http.get(url, () => {
    console.log("Called: " + url)
  }).on('error', (e) =>{
    console.log("Got error: " + e)
  })
  return 'Opening Jira Ticket '+slots.item;
});

app.intent('ConfluenceIntent', 'OpenConfluence', (slots, attrs, data, done) => {
  if (!slots.item) {
    return done(app.t('Please provide a text to search for'));
  }
  var url = CONFLUENCE_ENDPOINT +'/' + slots.item;
  console.log("Endpoint to execute: "+ url);
  http.get(url, () => {
    console.log("Called: " + url)
  }).on('error', (e) =>{
    console.log("Got error: " + e)
  })
  return 'Opening Confluence Page';
});

app.intent('YouTubeIntent', 'OpenYouTubePage', () => {
  var url = YOUTUBE_ENDPOINT;
  console.log("Endpoint to execute: "+ url);
  http.get(url, () => {
    console.log("Called: " + url)
  }).on('error', (e) =>{
    console.log("Got error: " + e)
  })
  return 'Opening YouTube Page';
});

app.intent('BackIntent', 'BackAction', () => {
  var url = BACK_COMMAND;
  console.log("Endpoint to execute: "+ url);
  http.get(url, () => {
    console.log("Called: " + url)
  }).on('error', (e) =>{
    console.log("Got error: " + e)
  })
  return 'Going Back';
});

app.intent('ForwardIntent', 'ForwardAction', () => {
  var url = FORWARD_COMMAND;
  console.log("Endpoint to execute: "+ url);
  http.get(url, () => {
    console.log("Called: " + url)
  }).on('error', (e) =>{
    console.log("Got error: " + e)
  })
  return 'Going Forward';
});

app.intent('RefreshIntent', 'RefreshPage', () => {
  var url = REFRESH_COMMAND;
  console.log("Endpoint to execute: "+ url);
  http.get(url, () => {
    console.log("Called: " + url)
  }).on('error', (e) =>{
    console.log("Got error: " + e)
  })
  return 'Refreshing Page';
});

app.intent('ScrollUpIntent', 'ScrollUpAction', () => {
  var url = SCROLLUP_COMMAND;
  console.log("Endpoint to execute: "+ url);
  http.get(url, () => {
    console.log("Called: " + url)
  }).on('error', (e) =>{
    console.log("Got error: " + e)
  })
  return 'Scrolling Up';
});

app.intent('ScrollDownIntent', 'ScrollDownAction', () => {
  var url = SCROLLDOWN_COMMAND;
  console.log("Endpoint to execute: "+ url);
  http.get(url, () => {
    console.log("Called: " + url)
  }).on('error', (e) =>{
    console.log("Got error: " + e)
  })
  return 'Scrolling Down';
});

/*** TEST SERVER  ***/

// Create http server and start it
const options = {
  path: '/', // defaults to: '/'
  port: 8888 // defaults to: process.env.PORT or 8888
};

app.createServer(options).start(() => {
    // Once started, save speechAssets into directory
    console.log(app.speechAssets().toString()); // stringified version
    app.saveSpeechAssets();
    console.log('Server started at localhost:8888');
});
