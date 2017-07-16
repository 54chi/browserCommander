#!flask/bin/python
import os
import urllib
from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, make_response
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By

load_dotenv(find_dotenv())

app = Flask(__name__)

driver = webdriver.Firefox()
# this may not work in all OS
driver.maximize_window()

wait = WebDriverWait(driver, 10, 1.0)
timeout = 10000

def cond(driver):
    return driver.execute_script("""
    var option = document.querySelector("#password");
    if (option==null) return false;
    return option.value !== "0";
    """)

def JiraLogin(driver):
    currentUrl=driver.current_url
    if currentUrl.find("login") > -1:
        driver.find_element(By.ID, "username").send_keys(os.environ['JIRA_USERNAME'])
        driver.find_element(By.ID, "login-submit").click()
        wait.until(cond)
        driver.find_element(By.ID, "password").send_keys(os.environ['JIRA_PASSWORD'])
        driver.find_element(By.ID, "login-submit").click()

@app.errorhandler(400)
def not_found(error):
    return make_response(jsonify( { 'error': 'Bad request' } ), 400)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify( { 'error': 'Not found' } ), 404)

# // Start Custom Browser Commands //
@app.route('/apps/homepage', methods=['GET'])
def app_homepage():
    url = os.environ['HOMEPAGE_URL']
    action = 'apps/homepage'
    driver.get(url)
    return jsonify([{'action': action , 'url': url }])

@app.route('/apps/jira', methods=['GET'])
def app_jira():
    url = os.environ['JIRA_URL']
    action = 'apps/jira'
    driver.get(url)
    JiraLogin(driver)
    return jsonify([{'action': action , 'url': url }])

@app.route('/apps/jira/<jira_id>', methods=['GET'])
def app_jira_id(jira_id):
    url = os.environ['JIRA_URL_TICKETBASE'] + jira_id
    action = 'apps/jira/<jira_id>'
    driver.get(url)
    JiraLogin(driver);
    return jsonify([{'action': action , 'url': url }])

@app.route('/apps/confluence/<search_text>', methods=['GET'])
def app_confluence_search(search_text):
    url = os.environ['CONFLUENCE_URL'] + urllib.parse.quote_plus(search_text) + "%22+and+space+in+("+os.environ['CONFLUENCE_SPACES']+")"
    action = 'apps/confluence/<searchText>'
    driver.get(url)
    JiraLogin(driver);
    return jsonify([{'action': action , 'url': url }])

@app.route('/apps/youtube', methods=['GET'])
def app_youtube():
    url = os.environ['PLAYLIST_URL']
    action = 'apps/youtube'
    driver.get(url)
    element = driver.find_element(By.CLASS_NAME, 'ytp-fullscreen-button')
    element.click()
    return jsonify([{'action': action , 'url': url }])
# // End Custom Browser Commands //

# // Start General Browser Commands //
@app.route('/command/back',methods=['GET'])
def cmd_back():
    driver.back()
    action = '/command/back'
    return jsonify([{'action': action }])

@app.route('/command/forward',methods=['GET'])
def cmd_forward():
    driver.forward()
    action = '/command/forward'
    return jsonify([{'action': action }])

@app.route('/command/refresh',methods=['GET'])
def cmd_refresh():
    driver.execute_script("document.location.reload()");
    # driver.execute_script("document.getElementsByClassName('comment-user')[0].click()")
    action = '/command/RefreshPage'
    return jsonify([{'action': action }])

@app.route('/command/scrollX/<pixels>',methods=['GET'])
def cmd_scrollX(pixels):
    driver.execute_script("window.scrollBy("+pixels+", 0);")
    action = '/command/scrollUp'
    return jsonify([{'action': action }])

@app.route('/command/scrollY/<pixels>',methods=['GET'])
def cmd_scrollY(pixels):
    # I couldn't make this to work on python's version of selenium
    # driver.execute_script("function scrollToTop(scrollDuration) {var scrollStep = -window.scrollY / (scrollDuration / 15),scrollInterval = setInterval(function(){if ( window.scrollY != 0 ) { window.scrollBy( 0, scrollStep ); } else clearInterval(scrollInterval); },15); }; scrollToTop(1000);")
    # nor this code:
    # tActions = webdriver.TouchActions(driver)
    # tActions.scroll(0,1000)
    # tActions.perform()
    # this works:
    # driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    driver.execute_script("window.scrollBy(0, "+ pixels +");")
    action = '/command/scrollY'
    return jsonify([{'action': action }])
# // End General Browser commands //

if __name__ == '__main__':
    app.run(host='0.0.0.0')
