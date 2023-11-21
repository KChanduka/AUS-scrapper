const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');


puppeteer.use(pluginStealth());



async function test(){
    const browser = await puppeteer.launch({headless: false});
    const page3 = await browser.newPage();
    await page3.goto('https://www.tenders.gov.au/Atm/Show/fb56d3e2-58b5-40ee-878d-482db69dcea9');


        let scrapedData =[];

        await page3.waitForSelector('.row');

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

        console.log(`tite : ${title}`);


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

        console.log(`atm ID : ${agency}`);


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

        console.log(`atm ID : ${atmId}`);


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

        console.log(`category : ${category}`);

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

        console.log(`location : ${location}`, 'location dataType :',);
        

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

        console.log(`idNumber : ${idNumber}`);


        // //function for making the date format

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

        console.log(`published date :`, publishedDate);

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

        console.log(`closing date :`, closingDate);
        //extracting description
        let description = "";
        try{
            description = await page3.evaluate(()=>{
                let descriptionElement = document.querySelector('.row > div:nth-child(2) > div > div:nth-child(13) > div').innerText;
                descriptionElement ? descriptionElement = descriptionElement.replace(/\n+/g,"\n"): descriptionElement="";
                return descriptionElement;
            })
        }catch(error){
            console.log(error);
        }

        console.log(`description : ${description}`);
        //extracting link
        const link = await page3.url();
        console.log(`link : ${link}`);

        //extracting updatedDateTime
        const updatedDateTime = "No date found"
        console.log(updatedDateTime);


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

          console.log(scrapedData);

        browser.close();

}

test();