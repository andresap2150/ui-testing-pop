const puppeteer = require('puppeteer');
const baseUrl = require('../testData/url');
const homePage = require('../pageObjects/cnnHomePage.js');
const resultsPage = require('../pageObjects/searchResultPage.js');

let page;
let browser;

describe('Cnn Test',()=>{
    beforeAll(async ()=>{
    	browser = await puppeteer.launch({
            headless: false,
            slowMo: 80,
            args: [`--window-size=1920,1080`]
        });
        page = await browser.newPage();
        await page.setViewport({ width:1920, height:1080 });
    });

    afterAll(() => {
       browser.close();
	});

    it('search NFL ',async()=>{
    	await page.goto(baseUrl.cnnUrl);
        await page.waitForSelector(homePage.searchButton);
        await page.click(homePage.searchButton);
        await page.waitForSelector(homePage.searchInputField);
        await page.type(homePage.searchInputField, "NFL");
        await page.waitForSelector(homePage.submitSearch);
        await page.click(homePage.submitSearch);
        await expect(page.title()).resolves.toMatch('Search CNN - Videos, Pictures, and News - CNN.com');

        //let hasError = await page.waitForSelector(resultsPage.noResultsMSG,{timeout:10000}).toThrow();
        
        await expect(()=>{
            page.waitForSelector(resultsPage.noResultsMSG,{timeout:10000})
        }).toThrow();
    	//await expect(page.title()).resolves.toMatch('Google');
    },30000);

    it('search NFLFake ',async()=>{
        await page.goto(baseUrl.cnnUrl);
        await page.waitForSelector(homePage.searchButton);
        await page.click(homePage.searchButton);
        await page.waitForSelector(homePage.searchInputField);
        await page.type(homePage.searchInputField, "NFLFake");
        await page.waitForSelector(homePage.submitSearch);
        await page.click(homePage.submitSearch);
        await expect(page.title()).resolves.toMatch('Search CNN - Videos, Pictures, and News - CNN.com');

        let hasError = await page.waitForSelector(resultsPage.noResultsMSG,{timeout:10000});
        await expect(hasError).toBeTruthy();
        //await expect(page.title()).resolves.toMatch('Google');
    },30000);
});	