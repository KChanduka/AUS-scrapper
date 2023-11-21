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
        const pageOneLinks = links;


        let pageCount = 2;
        for(const elm of numOfPagesCal){
            const page2 = await browser.newPage();
            await page2.goto(elm.pageLink);
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
        // intializing and array to store scraped data
        let scrapedData = [];
        let finTenders = 1;// counter for scraped tenders
        for(const elm of pageOneLinks){
            const page3 = await browser.newPage();
            await page3.goto(elm);

            //extracting title
            let title = "";
            try{
                title = await page3.evaluate(()=>{
    
                    let titleElement = document.querySelector('.row > div:nth-child(1) > div:nth-child(1) > p').innerText;
                    titleElement ? titleElement = titleElement.replace(/\n+/g,"\n"): titleElement = "";
                    return titleElement;
    
                })
            }catch(error){
                console.log(error);
            }

            //extracting agency
            let agency = "";
            try{
                agency = await page3.evaluate(()=>{
                    let agencyElement = document.querySelector('.row > div:nth-child(2) > div > div:nth-child(2) > div').innerText;
                    return agencyElement;
                })
            }catch(error){
                    console.log(error);
            }

            //extracting atmID
            let atmId = "";
            try{
                atmId = await page3.evaluate(()=>{
                    let atmIdElement = document.querySelector('.row > div:nth-child(2) > div > div:nth-child(1) > div').innerText;
                    return atmIdElement;
                })
            }catch(error){
                    console.log(error);
            }

            //extracting category
            let category = "";
            try{
                category = await page3.evaluate(()=>{
                
                    let categoryElment = document.querySelector('.row > div:nth-child(2) > div > div:nth-child(3) > div').innerText;
                    if(categoryElment){
                        categoryElment = categoryElment.replace(/\n+/g,"\n");
                        categoryElment = categoryElment.split("-");
                        categoryElment = categoryElment[1];
                    }
                    else{
                        categoryElment = "";
                    }
                    // categoryElment ? categoryElment = categoryElment.replace(/\n+/g,"\n"): categoryElment = ""
                    return categoryElment;
                })
            }catch(error){
                console.log(error);
            } 

            //extracting location
            let location = ["AUS"];
            try{
                const tempLocation = await page3.evaluate(()=>{
                    let locationElement = document.querySelector('.row > div:nth-child(2) > div > div:nth-child(6) > div ').innerText;
                    locationElement ? locationElement = locationElement.split(",") : locationElement =  [""];
                    return locationElement
                })
                location = location.concat(tempLocation);
            }catch(error){
                console.log(error);
            }

            //extracting region
            const region = ['not specified']

            //extracting idNumber
            let idNumber = "";
            try{
                idNumber = await page3.evaluate(()=>{
                    let idNumberElement = document.querySelector('.row > div:nth-child(2) > div > div:nth-child(1) > div').innerText;
                    return idNumberElement;
                })
            }catch(error){
                console.log(error);
            }

                 //function for making the date format

                const formatDate = (inputDateString)=>{
                    if (inputDateString) {
                // Split the input date string into parts
                const dateParts = inputDateString.split(' ');
                
                // Extract the date part and remove the dashes
                const dateOnly = dateParts[0].replace(/-/g, '');
                
                // Convert the formatted date to a Date object
                const dateObject = new Date(dateOnly);
                
                // Format the date to "DD-Mon-YYYY"
                const formattedDate = dateObject.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                
                return formattedDate;
                    } else {
                    return "No date found"
                    }
                }   


            //extracting publishedDate
            let publishedDate = "No date found";
            try{
                publishedDate = await page3.evaluate(()=>{
                    const publishedDateElement = document.querySelector('.row > div:nth-child(2) > div > div:nth-child(5) > div').innerText;
                    return publishedDateElement;  
                });
                publishedDate = formatDate(publishedDate).replace(/,/g,"");
            }catch(error){
                console.log(error);
            }


            //extracting closingDate
            let closingDate = "No date found";
            try{
                closingDate = await page3.evaluate(()=>{
                    const closingDateElement = document.querySelector('.row > div:nth-child(2) > div > div:nth-child(4) > div').innerText;
                    return closingDateElement;  
                });
                closingDate = formatDate(closingDate).replace(/,/g,"");
            }catch(error){
                console.log(error);
            }

            //extracting description
            let description = "";
            try{
                description = await page3.evaluate(()=>{
                    let descriptionElement = document.querySelector('.row > div:nth-child(2) > div > div:nth-child(13) > div').innerText;
                    descriptionElement ? descriptionElement = descriptionElement.replace(/\n+/g,"\n").replace(/\n+/g,""): descriptionElement="";
                    descriptionElement = (descriptionElement === "No" || descriptionElement === "Yes") ? "" : descriptionElement;
                    return descriptionElement;
                })
            }catch(error){
                // console.log(error);
            }

            //extracting link
            const link = elm;

            //extracting updatedDateTime
            const updatedDateTime = "No date found"


            //pushing the scraped data
            scrapedData.push({
                title,
                agency,
                atmId,
                category,
                location,
                region,
                idNumber,
                publishedDate,
                closingDate,
                description,
                link,
                updatedDateTime,
            });
            page3.close();

            console.log(`scraping tenders ${finTenders}`);
            finTenders++;
            


        }


        console.log(scrapedData);

    browser.close();
}

AUS();