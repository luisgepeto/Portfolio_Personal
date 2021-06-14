---
title: "Serverless web scraping: Selenium + Azure Functions"
date: "2021-06-13"
draft: false
path: "/blog/serverless-web-scraping-selenium-azure-function"
tags: [".NET", "Azure Functions", "Selenium", "Automation", "Docker"]
---

![Selenium and Azure Functions Logo](/../images/serverless-web-scraping-selenium-azure-function.png)

A serverless approach to web scraping offers advantages such as scalability and reduced cost. However, the need for external dependencies such as the browser introduces additional configuration complexity. In this post, we will dive into how we can use a Docker image to overcome this challenge. We will be using [Selenium](https://selenium.dev) (a popular browser automation tool) inside an Azure Function to retrieve weather information from a publicly available website.

### A word of advice
[Web scraping is a controversial subject](https://parsers.me/us-court-fully-legalized-website-scraping-and-technically-prohibited-it/). Before moving forward with any project that uses this technique please be aware of your local regulations, as well as copyright or Intellectual Property implications for the scraped data. Also, implement an ethical web scraping with practices such as:
> * Respect the site's `robots.txt`
> * Respect the provider's Terms of Service
> * Do not DoS websites with multiple requests
> * Identify your scraper with an appropriate `User-Agent` request header

# Selenium
![Selenium Logo](/../images/selenium-logo.png)

Simply put, Selenium is a tool that allows to code user interactions with a browser. By using Selenium, it is possible to simulate simple actions such as page reloads or clicks. However, more powerful functionality is also available such as inspecting the DOM or simulating keyboard events.

Selenium is mainly used in automated web testing to ensure multi-browser compatibility. However it can also complement Test Driven Development (TDD) practices, and can [improve your Continous Integration (CI) workflow](./docker-supercharge-continous-integration) by integrating a Selenium based test suite on your CI pipeline.

## *WebDriver* & browser
To use Selenium in your project you need to download the *WebDriver* for the browser of your choice. The *WebDriver* is an executable which needs to be added to your system's PATH whose purpose is to emulate the user's interaction with the browser. There are multiple *WebDrivers* available for most browsers (Chrome, Firefox, etc). You can find all the [supported *WebDrivers* in the Selenium documentation](https://www.selenium.dev/documentation/en/webdriver/driver_requirements/#quick-reference).

Since the *WebDriver* runs against the browser, we also need to have one installed on the target machine. These last two requirements are specially difficult to achieve in a serverless architecture, since these platforms do not offer a high degree of environment configurability. 

## Building a customized Selenium + Azure Functions enabled Docker image
We need to guarantee that the Selenium dependencies are side loaded whenever our code executes. Because we will be using an Azure Function, we can create a Dockerfile based on the latest Azure functions Docker image and then install the Selenium dependencies on top.

```Dockerfile
# Using the latest .NET Azure Functions Docker image as our base
FROM mcr.microsoft.com/azure-functions/dotnet:3.0 AS selenium-install

# Install Selenium according to: https://github.com/rebremer/azure-function-selenium/blob/master/Dockerfile
RUN apt-get update \
    && apt-get install -y \
        build-essential \
        cmake \
        git \
        wget \
        unzip \
    && rm -rf /var/lib/apt/lists/*

# Installing Chrome
ARG CHROME_VERSION="google-chrome-stable"
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update -qqy \
  && apt-get -qqy install \
    ${CHROME_VERSION:-google-chrome-stable} \
  && rm /etc/apt/sources.list.d/google-chrome.list \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Getting the latest Chrome version and installing the appropriate WebDriver
RUN LATEST=$(wget -q -O - http://chromedriver.storage.googleapis.com/LATEST_RELEASE) && \
    wget http://chromedriver.storage.googleapis.com/$LATEST/chromedriver_linux64.zip && \
    unzip chromedriver_linux64.zip && ln -s $PWD/chromedriver /usr/local/bin/chromedriver

# Adding the Chrome WebDriver to out system's PATH
ENV PATH="/usr/local/bin/chromedriver:${PATH}"
```

# Azure Functions
![Azure Function Logo](/../images/azure-functions.png)

Azure Functions are Microsoft's serverless solution. They offer multiple advantages such as less infrastructure overhead, reduced costs (since they are billed per execution) and auto-scaling. Azure Functions allow developers to focus on what matters most - the business logic - and empower them to deliver value faster to the application users.

## Using Selenium
In order to use Selenium we need to install its matching libraries. This is as easy as running `dotnet add package Selenium.WebDriver`. Once this is done, it is possible to use our libraries to create an instance of the *ChromeDriver* class which will use the downloaded Chrome *WebDriver* and interact with our browser.

```csharp
public ChromeDriver GetChromeDriver()
{
    var chromeOptions = new ChromeOptions();
    // If you wish to see your browser window, you can remove the --headless flag
    chromeOptions.AddArgument("--headless"); 
    // Add this flag if Chrome crashes when opening large pages https://developers.google.com/web/tools/puppeteer/troubleshooting#tips
    chromeOptions.AddArgument("--disable-dev-shm-usage");
    return new ChromeDriver(_driverLocation, chromeOptions);
}
```

Now that we have our *ChromeDriver* available, we can use it to navigate to our local weather webpage and retrieve the historical weather:

```csharp
public List<WeatherInformation> GetDailyWeatherHistory(WeatherStation station, DateTime localDate)
{
    using (var driver = GetChromeDriver())
    {
        // We wait for the browser to open before navigating to our page
        var pageLoadWait = new WebDriverWait(driver, TimeSpan.FromSeconds(100));
        // Our June weather data lives in http://example.com/history/monthly/MYSTATION/date/2021-6
        driver.Navigate().GoToUrl($@"{_uri}/history/monthly/{station.DatasourceUrl}/date/{localDate.ToString("yyyy-M")}");
        // We wait for our page to load
        _ = pageLoadWait.Until(e => e.FindElement(By.ClassName("observation-table")));
        // We can search the DOM for our button to switch to metric units
        var metricButton = pageLoadWait.Until(e => e.FindElement(By.CssSelector("#settings a[title='Switch to Metric']")));
        metricButton.Click();
        // We wait until the DOM element for weather data loads
        var observationTable = pageLoadWait.Until(e => e.FindElement(By.ClassName("observation-table")));
        var measurementTables = observationTable.FindElements(By.CssSelector("table.days table"));        
        // We can continue traversing the DOM to build our WeatherInformation objects 
        return GetWeatherFromTable(measurementTables);
    }
}
```

## Publishing our Azure Function to a Docker image
Once we have our code it is time to publish it to Azure so that it can run every night and query weather data. We need to ensure that every time the Azure Function runs it can instantiate a browser and find its appropriate *WebDriver* on the system PATH.

We need to use our Selenium + Azure Functions enabled Docker image and publish our compiled code to the `/home/site/wwwroot` directory. This can be accomplished with a different Dockerfile in a [Docker multi-stage build](https://docs.docker.com/develop/develop-images/multistage-build/#use-multi-stage-builds).

```Dockerfile
# This will be our target image on which code will run
FROM azure_functions_plus_selenium:latest as selenium_install

# Publishing our application code 
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
COPY . /src/dotnet-function-app
RUN cd /src/dotnet-function-app && \
    mkdir -p /home/site/wwwroot && \
    dotnet publish *.csproj --output /home/site/wwwroot

# Copying our published code into the target image
FROM selenium_install
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true
COPY --from=build-env ["/home/site/wwwroot", "/home/site/wwwroot"]
```

# Next steps & thoughts
Now that our Azure Function code and dependencies live inside a custom Docker image, the last remaining step is to create a new resource in Azure and deploy our code. The quickest way can be to [set the Container settings](https://docs.microsoft.com/en-us/azure/devops/pipelines/targets/function-app-container?view=azure-devops&tabs=yaml#configure-registry-credentials-in-function-app) in the portal. 

Although this specific implementation uses Selenium and its purpose is to build a web scraper, this approach can be reused to bundle any other dependencies that your project might need while keeping all the advantages and flexibility that a serverless approach offers.