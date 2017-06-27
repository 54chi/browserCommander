# Browser Commander

Remote control your browser via web-services.

### Background
This is a basic hack that combines NodeJS/Express with Selenium-webdriver to execute some browser operations via a REST API.

Sample Usage: to control that big screen TV at the end of your conference room :)

### Supported operations
This were made for my own needs. The code itself is not very complex, so feel free to adapt it to your needs. Out of the box, the following endpoints are available:

* `GET /apps/homepage`, to open the company homepage
* `GET /apps/jira`, to open the main company JIRA dashboard
* `GET /apps/jira/:id`, opens a specific JIRA ticket
* `GET /apps/confluence/:searchText`, searches in confluence
* `GET /apps/youtube`, plays a yotube URL/playlist in full screen

Also, Browser Commander supports the following commands:

* `GET /command/back`
* `GET /command/forward`
* `GET /command/refresh`
* `GET /command/scrollX/:pixels`
* `GET /command/scrollY/:pixels`


### Configuration
Create a `.env` file to hold your configuration variables. HOMEPAGE_URL, JIRA_USERNAME, JIRA_PASSWORD, JIRA_URL, JIRA_URL_TICKETBASE, CONFLUENCE_URL, CONFLUENCE_SPACES, PLAYLIST_URL.

E.g.

```
  HOMEPAGE_URL=http://mywebsite.com
  JIRA_URL=https://myJira.atlassian.net/secure/RapidBoard.jspa?rapidView=55
  JIRA_URL_TICKETBASE=https://myJira.atlassian.net/browse/
  JIRA_USERNAME=jiraUser@myemail.com
  JIRA_PASSWORD=password123
  CONFLUENCE_URL=https://myJira.atlassian.net/wiki/dosearchsite.action?cql=siteSearch+~+%22
  CONFLUENCE_SPACES=%22MYSPACE1%22%2C%22MYSPACE2%22
  PLAYLIST_URL=https://www.youtube.com/watch?v=someplaylist
```

### Reference

* Official docs for [selenium-webdriver for NodeJS](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/)
