from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys
from selenium import webdriver
from time import sleep
import subprocess
import argparse
import requests
import psutil
import time
import sys
import os

PAGE_WAIT_TIME = 60

def kill(proc_id):
    process = psutil.Process(proc_id)
    for proc in process.children(recursive=True):
        proc.kill()
    process.kill()

def exit(browser):
    browser.close()
    sys.exit(1)

def goToProjectPage(chromeBrowser, baseURL, project, projectName):
    chromeBrowser.get(f"{baseURL}/{project}")

    try:
        WebDriverWait(chromeBrowser, PAGE_WAIT_TIME).until(
            EC.presence_of_element_located((By.XPATH, f"//*[contains(text(), '{projectName}')]"))
        )
    except TimeoutException:
        print(f"Failed to load the project about page for {projectName}.\n")
        exit(chromeBrowser)

    time.sleep(1)

def clickBtn(chromeBrowser, dataTestId):
    try:
        btn = chromeBrowser.find_element(By.XPATH, f"//*[@data-testid='{dataTestId}']")
    except:
        print(f"Unable to find the button with data-testid: {dataTestId}.\n")
        exit(chromeBrowser)

    btn.click()
    time.sleep(1)

    return btn

def findProject(chromeBrowser, project):
    try:
        project = chromeBrowser.find_element(By.XPATH, f"//*[@data-testid='cryptoProject-{project}']")
    except:
        print(f"Unable to find {project}.\n")
        exit(chromeBrowser)

    return project

def assertProjectNotPresent(chromeBrowser, project, errorMessage):
    projectLength = len(chromeBrowser.find_elements(By.XPATH, f"//*[@data-testid='cryptoProject-{project}']"))
    if projectLength:
        print(errorMessage)
        exit(chromeBrowser)   

def testSearch(chromeBrowser):
    # Searches for Ethereum
    try:
        searchInput = chromeBrowser.find_element(By.XPATH, "//*[@data-testid='project-search']/input")
    except:
        print("Unable to find search input field.")
        exit(chromeBrowser)

    searchInput.send_keys("Ethereum")
    
    time.sleep(1)

    # Since Ethereum was searched for, Bitcoin shouldn't be found and Ethereum should be found
    assertProjectNotPresent(chromeBrowser, "Bitcoin", "Bitcoin wasn't filtered from the search when it should have been.")

    findProject(chromeBrowser, "Ethereum")

    # Clear the search
    searchInput.send_keys(Keys.CONTROL + "a")
    searchInput.send_keys(Keys.DELETE)

    time.sleep(1)

def testTagFilter(chromeBrowser):
    # Open the tag filters and filter by Layer 1
    try:
        tagFilterBtn = chromeBrowser.find_element(By.XPATH, "//*[@data-testid='tagFilterBtn']")
    except:
        print("Unable to find the tag filter button.\n")
        exit(chromeBrowser)

    tagFilterBtn.click()

    time.sleep(1)

    try:
        layer1TagFilter = chromeBrowser.find_element(By.XPATH, "//*[@data-testid='tagOption- Layer 1']")
    except:
        print("Unable to find the layer 1 tag filter.\n")
        exit(chromeBrowser)

    layer1TagFilter.click()

    time.sleep(1)

    # Exit the tag filter menu
    ActionChains(chromeBrowser).send_keys(Keys.ESCAPE).perform()

    time.sleep(1)

    # Bitcoin is a Layer 1 and Ethereum isn't, so make sure Bitcoin can be found and Ethereum cannot be
    findProject(chromeBrowser, "Bitcoin")
    assertProjectNotPresent(chromeBrowser, "Ethereum", "Ethereum isn't a layer 1 but was found after filtering for layer 1s.")

    # Unfilter by layer 1
    try:
        tagFilterBtn = chromeBrowser.find_element(By.XPATH, "//*[@data-testid='tagFilterBtn']")
    except:
        print("Unable to find the tag filter button.\n")
        exit(chromeBrowser)

    tagFilterBtn.click()

    time.sleep(1)

    try:
        layer1TagFilter = chromeBrowser.find_element(By.XPATH, "//*[@data-testid='tagOption- Layer 1']")
    except:
        print("Unable to find the layer 1 tag filter.\n")
        exit(chromeBrowser)

    layer1TagFilter.click()

    time.sleep(1)

    # Exit the tag filter menu
    ActionChains(chromeBrowser).send_keys(Keys.ESCAPE).perform()

    time.sleep(1)

    # Both Bitcoin and Ethereum should be present now
    findProject(chromeBrowser, "Bitcoin")
    findProject(chromeBrowser, "Ethereum")

def testChainFilter(chromeBrowser):
    # Open the chain filters and filter by Ethereum
    try:
        chainFilterBtn = chromeBrowser.find_element(By.XPATH, "//*[@data-testid='chainFilterBtn']")
    except:
        print("Unable to find the chain filter button.\n")
        exit(chromeBrowser)

    chainFilterBtn.click()

    time.sleep(1)

    try:
        ethereumChainFilter = chromeBrowser.find_element(By.XPATH, "//*[@data-testid='chainOption-Ethereum']")
    except:
        print("Unable to find the Ethereum chain filter.\n")
        exit(chromeBrowser)

    ethereumChainFilter.click()

    time.sleep(1)

    # Exit the chain filter menu
    ActionChains(chromeBrowser).send_keys(Keys.ESCAPE).perform()

    time.sleep(1)

    # Make sure Ethereum can be found and Bitcoin cannot be found
    findProject(chromeBrowser, "Ethereum")
    assertProjectNotPresent(chromeBrowser, "Bitcoin", "Bitcoin isn't on Ethereum but was found after the Ethereum chain filter was put into effect.")

    # Unfilter by Ethereum
    try:
        chainFilterBtn = chromeBrowser.find_element(By.XPATH, "//*[@data-testid='chainFilterBtn']")
    except:
        print("Unable to find the chain filter button.\n")
        exit(chromeBrowser)

    chainFilterBtn.click()

    time.sleep(1)

    try:
        ethereumChainFilter = chromeBrowser.find_element(By.XPATH, "//*[@data-testid='chainOption-Ethereum']")
    except:
        print("Unable to find the Ethereum chain filter.\n")
        exit(chromeBrowser)

    ethereumChainFilter.click()

    time.sleep(1)

    # Exit the chain filter menu
    ActionChains(chromeBrowser).send_keys(Keys.ESCAPE).perform()

    time.sleep(1)    

    # Both Bitcoin and Ethereum should be present now
    findProject(chromeBrowser, "Bitcoin")
    findProject(chromeBrowser, "Ethereum")

def testSortFunctionalityHelper(chromeBrowser, sortOption, presentProject, notPresentProject):
    # Open the sort menu and selects the specified sort from the parameter to this helper function
    try:
        sortByBtn = chromeBrowser.find_element(By.XPATH, "//*[@data-testid='sortByBtn']")
    except:
        print("Unable to find the sort by button.\n")
        exit(chromeBrowser)

    sortByBtn.click()

    time.sleep(1)

    try:
        sortByOption = chromeBrowser.find_element(By.XPATH, f"//*[@data-testid='sortOption-{sortOption}']")
    except:
        print(f"Unable to find the sort by option {sortOption}.\n")
        exit(chromeBrowser)

    sortByOption.click()

    time.sleep(1)

    # Exit the sort menu
    ActionChains(chromeBrowser).send_keys(Keys.ESCAPE).perform()

    time.sleep(1)

    # Make sure the project that should be present is and the project that shouldn't be present isn't
    findProject(chromeBrowser, presentProject)
    assertProjectNotPresent(chromeBrowser, notPresentProject, f"{notPresentProject} should not have been present on the first page after selecting the sort option {sortOption}")

def testSortFunctionality(chromeBrowser):
    testSortFunctionalityHelper(chromeBrowser, "Alphabetical - Z to A", "Zilliqa", "Bitcoin")
    testSortFunctionalityHelper(chromeBrowser, "Alphabetical - A to Z", "Aave", "Zilliqa")
    testSortFunctionalityHelper(chromeBrowser, "Market Cap - $ to $$$", "Anyswap", "Ethereum")
    testSortFunctionalityHelper(chromeBrowser, "Market Cap - $$$ to $", "Bitcoin", "Anyswap")

def compareMarketData(chromeBrowser, projectName, coinGeckoValue, siteDataTestId, allowedPercentDiff):
    try:
        siteValueText = chromeBrowser.find_element(By.XPATH, f"//*[@data-testid='{siteDataTestId}']").text
    except:
        print(f"Unable to find element with data-testid: {siteDataTestId}.\n")
        exit(chromeBrowser)

    siteValue = float(siteValueText.replace("$", "").replace(",", "").replace("%", "").replace("-", ""))

    if coinGeckoValue < 0:
        coinGeckoValue *= -1

    percentDifference = abs((coinGeckoValue / siteValue) - 1)
    if percentDifference > allowedPercentDiff:
        print(f"Bad market data for {projectName} for {siteDataTestId} - Coin Gecko is {coinGeckoValue} while site is {siteValue} ({'{:.2f}'.format(percentDifference * 100)}% difference) and the maximum percent difference allowed is {allowedPercentDiff * 100}%.")
        exit(chromeBrowser)
    else:
        print(f"Good market data for {projectName} for {siteDataTestId} - Coin Gecko is {coinGeckoValue} while site is {siteValue} ({'{:.2f}'.format(percentDifference * 100)}% difference) and the maximum percent difference allowed is {allowedPercentDiff * 100}%.")

def testProjectAboutPage(chromeBrowser, projectName, projectSymbol, coinGeckoProjectId):
    # Get the Coin Gecko market data for the project using the Coin Gecko API
    coinGeckoResponse = requests.get(f"https://api.coingecko.com/api/v3/coins/{coinGeckoProjectId}")
    projectMarketData = coinGeckoResponse.json()

    # Click the project row in the table to go to the about page for the project
    project = findProject(chromeBrowser, projectName)
    project.click()
    time.sleep(1)

    # Waits for the project about page to load
    try:
        WebDriverWait(chromeBrowser, PAGE_WAIT_TIME).until(
            EC.presence_of_element_located((By.XPATH, f"//*[contains(text(), '{projectName} ({projectSymbol})')]"))
        )
    except TimeoutException:
        print(f"Failed to load the project about page for {projectName} ({projectSymbol}).\n")
        exit(chromeBrowser)

    time.sleep(1)

    # Token price of what's on the site vs what's fetched from CG should be within 5%.
    coinGeckoTokenPrice = float(projectMarketData["market_data"]["current_price"]["usd"])
    compareMarketData(chromeBrowser, projectName, coinGeckoTokenPrice, "tokenPrice", 0.05)

    # 24 hour price change - site vs CG
    coinGecko24HrPriceChange = float(projectMarketData["market_data"]["price_change_percentage_24h"])
    compareMarketData(chromeBrowser, projectName, coinGecko24HrPriceChange, "24HrPriceChange", 5)

    # Market cap - site vs CG
    coinGeckoMarketCap = float(projectMarketData["market_data"]["market_cap"]["usd"])
    compareMarketData(chromeBrowser, projectName, coinGeckoMarketCap, "marketCap", 0.05)

    # 24 hour trading volume - site vs CG
    coinGecko24HrTradingVolume = float(projectMarketData["market_data"]["total_volume"]["usd"])
    compareMarketData(chromeBrowser, projectName, coinGecko24HrTradingVolume, "24HrTradingVolume", 0.1)

    # Fully diluted market cap - site vs CG
    coinGeckoFullyDiluted = float(projectMarketData["market_data"]["fully_diluted_valuation"]["usd"])
    compareMarketData(chromeBrowser, projectName, coinGeckoFullyDiluted, "fullyDilutedMarketCap", 0.1)

    # Circulating supply - site vs CG
    coinGeckoCirculatingSupply = float(projectMarketData["market_data"]["circulating_supply"])
    compareMarketData(chromeBrowser, projectName, coinGeckoCirculatingSupply, "circulatingSupply", 0.05)

    # Total supply - site vs CG
    coinGeckoTotalSupply = float(projectMarketData["market_data"]["total_supply"])
    compareMarketData(chromeBrowser, projectName, coinGeckoTotalSupply, "totalSupply", 0.01)

    time.sleep(5)

    # Makes sure the CG chart exists
    try:
        coinGeckoChartElement = chromeBrowser.find_element(By.XPATH, "//*[contains(@class, 'highcharts-background')]")
    except:
        print(f"Unable to find the Coin Gecko price chart for {projectName}.\n")
        exit(chromeBrowser)    

    # Clicks the button to switch over to the TradingView chart
    try:
        candleChartBtn = chromeBrowser.find_element(By.XPATH, "//*[@data-testid='candleChartBtn']")
    except:
        print("Unable to find the candle chart button.\n")
        exit(chromeBrowser)

    # Scroll down to the charts
    chromeBrowser.execute_script("arguments[0].scrollIntoView();", candleChartBtn)

    time.sleep(1)

    candleChartBtn.click() 

    time.sleep(1)   

    # Makes sure the TradingView chart exists
    try:
        chromeBrowser.find_element(By.XPATH, "//*[contains(@class, 'tradingview-widget-container')]")
    except:
        print(f"Unable to find the Trading View candle chart for {projectName}.\n")
        exit(chromeBrowser)   
    
    # Clicks the button to switch over to the CG chart
    try:
        priceChartBtn = chromeBrowser.find_element(By.XPATH, "//*[@data-testid='priceChartBtn']")
    except:
        print("Unable to find the price chart button.\n")
        exit(chromeBrowser)

    priceChartBtn.click() 

    time.sleep(3)

    # Makes sure the CG chart exists
    try:
        chromeBrowser.find_element(By.XPATH, "//*[contains(@class, 'highcharts-background')]")
    except:
        print(f"Unable to find the Coin Gecko price chart for {projectName}.\n")
        exit(chromeBrowser)

def testProjectFeeds(chromeBrowser, hasTwitter, hasDiscord, hasYouTube, hasTelegram, hasMedium):
    # Selects the all filter for the social feeds
    allBtn = clickBtn(chromeBrowser, "socialFilter-all")

    # Scroll a bunch to load a lot of the feed
    initialFeedCount = len(chromeBrowser.find_elements(By.XPATH, "//*[contains(@data-testid, 'feeditem')]"))
    for i in range(3):
        chromeBrowser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(5)
    finalFeedCount = len(chromeBrowser.find_elements(By.XPATH, "//*[contains(@data-testid, 'feeditem')]"))

    if finalFeedCount <= initialFeedCount:
        print("More feed items were not loaded after scrolling down in the aggregated feed.")
        exit(chromeBrowser)

    # Scroll back up to the social filter buttons
    chromeBrowser.execute_script("arguments[0].scrollIntoView();", allBtn)
    time.sleep(1)

    # If the project has a Twitter, check the Twitter feed
    clickBtn(chromeBrowser, "socialFilter-twitter")
    time.sleep(2)    
    if hasTwitter:
        twitterFeedAmount = len(chromeBrowser.find_elements(By.XPATH, "//*[contains(@data-testid, 'feeditem-twitter')]"))

        if twitterFeedAmount == 0:
            print("Expected Twitter feed to be present but it wasn't.")
            exit(chromeBrowser)

        youtubeFeedAmount = len(chromeBrowser.find_elements(By.XPATH, "//*[contains(@data-testid, 'feeditem-youtube')]"))

        if youtubeFeedAmount > 0:
            print("Expected no YouTube feed items but found one or more.")
            exit(chromeBrowser)

    # If the project has a YouTube, check the YouTube feed
    clickBtn(chromeBrowser, "socialFilter-youtube")
    time.sleep(2)    
    if hasYouTube:
        youtubeFeedAmount = len(chromeBrowser.find_elements(By.XPATH, "//*[contains(@data-testid, 'feeditem-youtube')]"))

        if youtubeFeedAmount == 0:
            print("Expected YouTube feed to be present but it wasn't.")
            exit(chromeBrowser)

        twitterFeedAmount = len(chromeBrowser.find_elements(By.XPATH, "//*[contains(@data-testid, 'feeditem-twitter')]"))

        if twitterFeedAmount > 0:
            print("Expected no Twitter feed items but found one or more.")
            exit(chromeBrowser)

    # If the project has a Discord, check the Discord feed
    clickBtn(chromeBrowser, "socialFilter-discord")
    time.sleep(2)
    if hasDiscord:
        discordFeedAmount = len(chromeBrowser.find_elements(By.XPATH, "//*[contains(@data-testid, 'feeditem-discord')]"))

        if discordFeedAmount == 0:
            print("Expected Discord feed to be present but it wasn't.")
            exit(chromeBrowser)

        twitterFeedAmount = len(chromeBrowser.find_elements(By.XPATH, "//*[contains(@data-testid, 'feeditem-twitter')]"))

        if twitterFeedAmount > 0:
            print("Expected no Twitter feed items but found one or more.")
            exit(chromeBrowser)

    # If the project has a Telegram, check the Telegram feed
    clickBtn(chromeBrowser, "socialFilter-telegram")
    time.sleep(2)    
    if hasTelegram:
        telegramFeedAmount = len(chromeBrowser.find_elements(By.XPATH, "//*[contains(@data-testid, 'feeditem-telegram')]"))

        if telegramFeedAmount == 0:
            print("Expected Telegram feed to be present but it wasn't.")
            exit(chromeBrowser)

        twitterFeedAmount = len(chromeBrowser.find_elements(By.XPATH, "//*[contains(@data-testid, 'feeditem-twitter')]"))

        if twitterFeedAmount > 0:
            print("Expected no Twitter feed items but found one or more.")
            exit(chromeBrowser)

    # If the project has a Medium page, check the Medium feed
    clickBtn(chromeBrowser, "socialFilter-medium")
    time.sleep(2)    
    if hasMedium:
        mediumFeedAmount = len(chromeBrowser.find_elements(By.XPATH, "//*[contains(@data-testid, 'feeditem-medium')]"))

        if mediumFeedAmount == 0:
            print("Expected Medium feed to be present but it wasn't.")
            exit(chromeBrowser)

        twitterFeedAmount = len(chromeBrowser.find_elements(By.XPATH, "//*[contains(@data-testid, 'feeditem-twitter')]"))

        if twitterFeedAmount > 0:
            print("Expected no Twitter feed items but found one or more.")
            exit(chromeBrowser)

    time.sleep(1)

def main():
    testDir = os.path.dirname(os.path.realpath(__file__))

    # Possible arguments:
    #   1. --setup - Determines if the testing script should start the website locally.
    #       Defaults to True
    #   2. --url - Determines the url for Selenium to use to connect to the web application.
    #       Defaults to http://localhost:3000

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("-s", "--setup", help="Determines if the testing script needs to start the website locally.", default="True", type=str)
    parser.add_argument("-u", "--url", help="Determines the url for Selenium to use to connect to the web application.", default="http://localhost:3000", type=str)
    args = parser.parse_args()

    # Start the website locally with npm run dev if the setup flag is True
    if args.setup == "True":
        frontEndDir = testDir.split("\\tests")[0]
        os.chdir(frontEndDir)

        frontEndApp = subprocess.Popen(["npm", "run", "dev"], shell=True)

        os.chdir(testDir)
        time.sleep(60)

    # Instantiate the Chrome Browser by supplying the path to the Chrome Web Driver
    chromeBrowser = webdriver.Chrome(r"chromedriver.exe")

    # Maximizes the browser window for manual analysis of testing
    chromeBrowser.maximize_window()

    # Goes to the home page of the listing platform (the home page of coincardinal as a whole)
    chromeBrowser.get(args.url)

    # Waits for the home page to load
    try:
        WebDriverWait(chromeBrowser, PAGE_WAIT_TIME).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Coin Cardinal Crypto Insights')]"))
        )
    except TimeoutException:
        print("Failed to load the home page of the listing platform.\n")
        exit(chromeBrowser)

    time.sleep(1)

    # Asserts the table contains a row for Bitcoin
    findProject(chromeBrowser, "Bitcoin")

    # Tests to ensure the search functionality works
    testSearch(chromeBrowser)

    # Tests to ensure the tag filter functionality works
    testTagFilter(chromeBrowser)

    # Tests to ensure the chain filter functionality works
    testChainFilter(chromeBrowser)

    # Tests to ensure the sorting functionaltiy works
    testSortFunctionality(chromeBrowser)

    # Tests the project about page for Ethereum
    testProjectAboutPage(chromeBrowser, "Ethereum", "ETH", "ethereum")

    goToProjectPage(chromeBrowser, args.url, "ethereum", "Ethereum")

    # Tests the feeds for Ethereum - assumes we are already on the page for Ethereum
    testProjectFeeds(chromeBrowser, hasTwitter=True, hasDiscord=True, hasYouTube=True, hasTelegram=False, hasMedium=False)

    chromeBrowser.close()
    if args.setup == "True":
        kill(frontEndApp.pid)

    print("\n\nAll tests ran successfully except any errors that might be listed above.\n\n")

if __name__ == "__main__":
    main()