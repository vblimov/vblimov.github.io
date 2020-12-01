const TenderLandButton = document.querySelector('.TenderLand');

const defaultDelay = 6000;                     //задежка, с которой отправляется запрос на получение ссылки на файл с отчётом (1000 = 1s)
const proxy_URL = 'https://cors-anywhere.herokuapp.com/';
let fileLinks = [];
let contactsForNewLeadsCreation = [];
let contactsOfWinners = [];


TenderLandButton.addEventListener('click', event => {
    event.preventDefault();
     // getRequestID().then((data)=>{
        getFileLinks('1068ef32cf0d521f68b1206bcb1ffb38').then(() => { //TODO делать через пхп
            getAndFilterFiles();
            }) //1068ef32cf0d521f68b1206bcb1ffb38
     // }).catch(err=> {
     //     console.log(err)
     // })

    // getAndFilterFiles();
})

const getRequestID = () =>{
    return new Promise((resolve, reject) => { //создаём обещание
        
        $.ajax({
            url: 'php/getRequestID.php',
            type: 'POST',
            dataType: "json",
            success: data => {
                console.log(data)
                if(data.status === "error"){
                    reject(data.code)
                }
                resolve(data["request_id"])
                },
            error: err => {
                reject(err);}
        });
    })
}
const getFileLinks = (requestID) =>{
    return new Promise((resolve, reject) => {
        let timerGetResponseFile = setInterval(() => { //таймер на повторение попытки скачать
            $.ajax({
                url: 'php/getFileLinks.php',
                type: 'POST',
                dataType: "json",
                data: {requestID: requestID},
                success: response => {
                    console.log(response)
                    if (response.data.length !== 0) { //если в json не пустой массив (пустой, если отчёт ещё не сформировался)
                        clearInterval(timerGetResponseFile); //то выключаем таймер повтора запроса
                        for (let i = 0; i < response.data.length; i++) { //и для всех массивов с фалами
                            fileLinks.push(response.data[i].file); //записываем их
                        }
                        resolve(); //отправляем, что обещание выполнено и можно приступать в .then функции
                    }
                },
                error: err => {
                    console.log(err)
                },
                beforeSend: xhr => {
                    xhr.setRequestHeader('X-Test-Header', 'test-value');
                }
            });
        }, defaultDelay) //задержка интервалов
    })
}
const getAndFilterFiles = () => {
    let responseXML = [];
    const request = new XMLHttpRequest();
    for(let i = 0; i < fileLinks.length; i++){
        console.log('start ' + fileLinks[i])
        request.open('GET', proxy_URL + fileLinks[i]);
        request.responseType = 'document';
        request.onload = () => {
          
            responseXML.push(request.responseXML);
            
            if(responseXML.length === fileLinks.length)
            {
                console.log(responseXML[0]);
                filterFiles(responseXML);
            }
        };
        request.send();
    }
}
const filterFiles = (responseXML) => {
    const xmlDoc = [];
    for (let i = 0; i < responseXML.length; i++){
        xmlDoc.push(responseXML[i].documentElement.getElementsByTagName('tender'))
    }
    console.log(xmlDoc)
    
    let indexOfTenderStatus = 0;
    let indexOfProtocolContactWinner = 0;
    let indexOfDatetimeHolding = 0;
    let indexOfTenderURL = 0;
    for (let i = 0; i < xmlDoc[0][0].childNodes.length; i++) {
        if(xmlDoc[0][0].childNodes[i].nodeName === 'tender_status'){
            indexOfTenderStatus = i;
        } else if (xmlDoc[0][0].childNodes[i].nodeName === 'protocol_contact_winner') {
            indexOfProtocolContactWinner = i;
        } else if (xmlDoc[0][0].childNodes[i].nodeName === 'datetime_holding') {
            indexOfDatetimeHolding = i;
        } else if (xmlDoc[0][0].childNodes[i].nodeName === 'tender_url') {
            indexOfTenderURL = i;
        }
    }
    xmlDoc.forEach(array => {
        console.log(array)
        for (let i = 0; i < array.length; i++) {
            if(array[i].childNodes[indexOfTenderStatus].textContent === 'Закупка завершена'){
                if(!isContactNull(array[i].childNodes[indexOfProtocolContactWinner].textContent))
                {
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
    console.log(contactsOfWinners);
    console.log(contactsOfWinners[contactsOfWinners.length-1]);
    console.log(contactsOfWinners[contactsOfWinners.length-1].date);
    // contactsOfWinners[contactsOfWinners.length].json().then(json => {
    //     getLastUpdateDate(json.date);
    // })
}

const isContactNull = (contact) => {
    if(contact === "")
        return true;
    return false;
}
const getLastUpdateDate = (date) => {
    $.ajax({
        url: 'php/isLessThanDate.php',
        type: 'POST',
        dataType: "json",
        data: {date: date},
        success: data => {
            alert(data);
        },
        error: err => {
            console.log(err)
        }
    });
}

//https://b24-0cqi8z.bitrix24.ru/rest/1/se7dqno8wl2da734/crm.lead.add.json
//{"status":"ok","request_id":"0561b22f51fdbef3824a911787d21441"}
//0561b22f51fdbef3824a911787d21441
//{
// "status":"ok",
// "data":[{
//  "file":"http:\/\/www.tenderland.ru\/content\/99b8660aafccae8ef7cf03dd3e0236be.part1.xml",
//  "created":"2020-11-29 11:12:21",
//  "items_count":"1292",
//  "description":"\u0412\u044b\u0433\u0440\u0443\u0436\u0435\u043d\u043e 1292 \u0441\u0442\u0440\u043e\u043a (\u0432\u0441\u0435\u0433\u043e 1292)",
//  "is_last":"1"}]}
//<protocol_contact_winner>ФИНЧЕНКО КСЕНИЯ АЛЕКСАНДРОВНА 79264692678 ksenia.kafar@yandex.ru</protocol_contact_winner>


