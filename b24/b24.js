let TenderLandButton = document.querySelector('.TenderLand');

let defaultDelay = 120000; //delay between requests (1000 == 1s)
let proxy_URL = 'https://cors-anywhere.herokuapp.com/'; //if hosting will work => change it to ""
let fileLinks = [];
let contactsOfWinners = [];


TenderLandButton.addEventListener('click', event => {
    
//     $.ajax({
//                 url: 'b24/getContacts.php',
//                 type: 'POST',
//                 dataType: "json",
//                 success: data => {
//                     console.log(data)
//                 },
//                 error: err => {
//                     console.log(err)
// }
//             })
// })

    return new Promise((resolve, reject) => {
        console.log('here')
        $.ajax({
            url: 'b24/getRequestID.php',
            type: 'POST',
            dataType: "json",
            success: data => {
                console.log(data)
                // resolve(data["request_id"])
            },
            error: err => {
                reject();}
        });
        // resolve('9aedf1067bf18e3a50d76c89ca7e5f9e');
    }).then( (requestID) => {
        return new Promise((resolve, reject) => {
            // let timerGetResponseFile = setInterval(() => { //timer between trying to get response with reportLink
                $.ajax({
                    url: 'b24/getFileLinks.php',
                    type: 'POST',
                    dataType: "json",
                    data: {requestID: requestID}, //send request_id to php
                    success: response => { //get json response
                        console.log(response)
                        if (response.data.length !== 0) { //if json had !empty array => report ready
                            // clearInterval(timerGetResponseFile); //stop interval timer
                            for (let i = 0; i < response.data.length; i++) {
                                fileLinks.push(response.data[i].file); //write all links into array
                            }
                            console.log(fileLinks)
                            return;
                            resolve();
                        }
                    },
                    error: err => {
                        console.log(err)
                    }
                });
            // }, defaultDelay) //delay between calls
        }).then(()=> {
            let responseXML = [];
            let request = new XMLHttpRequest();
            //for each link in array of links send XHR
            for(let i = 0; i < fileLinks.length; i++){
                request.open('GET', proxy_URL + fileLinks[i]);
                request.responseType = 'document';

                request.onload = () => {
                    //get xml file and push it into array
                    responseXML.push(request.responseXML);
                    if(responseXML.length === fileLinks.length)
                    {
                        let xmlDoc = [];
                        //find all elements in xml, which contains tender information
                        for (let i = 0; i < responseXML.length; i++){
                            xmlDoc.push(responseXML[i].documentElement.getElementsByTagName('tender'))
                        }

                        // empty array handler
                        if(xmlDoc[0].length === 0){
                            return;
                        }
                        //indexes of require tags in xml
                        let indexOfTenderStatus = 0;
                        let indexOfProtocolContactWinner = 0;
                        let indexOfDatetimeHolding = 0;
                        let indexOfTenderURL = 0;
                        let temp;
                        for (let i = 0; i < xmlDoc[0][0].childNodes.length; i++) {
                            temp = xmlDoc[0][0].childNodes[i].nodeName;
                            if(temp === 'tender_status'){
                                indexOfTenderStatus = i;
                            } else if (temp === 'protocol_contact_winner') {
                                indexOfProtocolContactWinner = i;
                            } else if (temp === 'datetime_holding') {
                                indexOfDatetimeHolding = i;
                            } else if (temp === 'tender_url') {
                                indexOfTenderURL = i;
                            }
                        }
                        //run throw all array to find all tenders, which tender_status is 'Закупка завершена' and which has winners
                        xmlDoc.forEach(array => {
                            console.log(array)
                            for (let i = 0; i < array.length; i++) {
                                if(array[i].childNodes[indexOfTenderStatus].textContent === 'Закупка завершена'){
                                    if(array[i].childNodes[indexOfProtocolContactWinner].textContent !== "")
                                    {
                                        //push tender fields into array, which will added into b24
                                        contactsOfWinners.push({
                                            tenderNumber : array[i].getAttribute("number"),
                                            contact : array[i].childNodes[indexOfProtocolContactWinner].textContent,
                                            date: array[i].childNodes[indexOfDatetimeHolding].textContent,
                                            url: array[i].childNodes[indexOfTenderURL].textContent
                                        })
                                    }
                                }
                            }
                        })
                        console.log(contactsOfWinners)
                    }
                };
                request.send();
            }
        }).catch(()=>{})
    }).catch(()=>{})

})
