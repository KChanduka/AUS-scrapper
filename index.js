const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(pluginStealth());

// const proxyIp = '10.50.225.222'; // Replace with your proxy server's IP address
// const proxyPort = '3128'; // Replace with your proxy server's port number

async function AUS(){
    // const browser = await puppeteer.launch({
    //     headless: false,
    //     args:[`--proxy--server = https://${proxyIp}:${proxyPort}`],
    //     igonreHTTPErrors: true
        
    // });
    const browser = await puppeteer.launch({headless:false});
    const page1 = await browser.newPage();

    await page1.goto('https://www.tenders.gov.au/atm?page');
    await page1.screenshot({path:'home.png', fullPage:true});

    //getting the num of pages: to collect all current tender links
    const TempNumOfPagesCal = await page1.evaluate(()=>Array.from(document.querySelectorAll(".pagination > li "),(e)=>({pageNo:e.querySelector('a').innerText , pageLink: e.querySelector('a').href})));
    const numOfPagesCal = TempNumOfPagesCal.slice(1,-5);
    console.log('num of pages excluding page 1:', numOfPagesCal.length);
    console.log(numOfPagesCal);

    //traversing into each page and collecting all tender links

        //collecting the links in the page1
        let links = await page1.evaluate(()=>Array.from(document.querySelectorAll('.boxEQH > div > div:nth-child(2) > div > div > div > a'),(e)=>(e.href)));
        console.log('num of links in page 1 :',links.length);
        // console.log('all links in page 1 :',links);



        let pageCount = 2;
        for(const each of numOfPagesCal){
            const page2 = await browser.newPage();
            await page2.goto(each.pageLink);
            const temp = await page2.evaluate(()=>Array.from(document.querySelectorAll('.boxEQH > div > div:nth-child(2) > div > div > div > a'),(e)=>(e.href)));
            //printing the num of links in each page
            console.log(`num of links in page ${pageCount} :`,temp.length);
            pageCount++;
            links = links.concat(temp);
            page2.close();
        }
        //printing total num of links
        console.log('total num of links :',links.length);

        console.log(links);



    //navigating into each tender link and scraping 





    browser.close();
}

AUS();