<?php

const requestLogin = '2543123023';          //логин
const requestPassword = '159753209';        //пароль
const requestAutopoiskID = '123456';        //id автопоиска
const requestReportID = '33934';            //id отчёта, по которому необходимо получить информацию
const requestYear = '2020';                 //год, за который необходимо получить тендеры
const defaultDelay = 6;                     //задежка, с которой отправляется запрос на получение ссылки на файл с отчётом (1s)
$requestID = null;                          //id запроса на получение отчёта, записывается на основе ответа сервера на запрос сформировать отчёт
$getFileLinkFromRequestID_URL = null;
/*= 'https://www.tenderland.ru/pages/main' .
'?api=1&login=' . requestLogin .
'&password=' . requestPassword .
'&request_id=' . $requestID .
'';*/
const getRequestID_URL = 'https://www.tenderland.ru/pages/main' .   //url для получения request_id
    '?autopoisk=' . requestAutopoiskID .
    '&api=1&force_prev=1&report=' . requestReportID .
    '&login=' . requestLogin .
    '&password=' . requestPassword .
    '&year=' . requestYear .
    '';
const proxy_URL = 'https://cors-anywhere.herokuapp.com/';
function getFileLinks($requestID) {
    $fileLinks = (array)null;
    try {
        $curl = curl_init();
        if ($curl === false) {
            throw new Exception('failed to initialize');
        }

        $getFileLinkFromRequestID_URL = 'https://www.tenderland.ru/pages/main' .
            '?api=1&login=' . requestLogin .
            '&password=' . requestPassword .
            '&request_id=' . $requestID .
            '';
        curl_setopt($curl,CURLOPT_URL, proxy_URL . $getFileLinkFromRequestID_URL);
        curl_setopt($curl,CURLOPT_POST, true);
        curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl,CURLOPT_SSL_VERIFYPEER , false);
        curl_setopt($curl,CURLOPT_SSL_VERIFYHOST , false);
//        $request = json_encode(null);
//        while(count($request->data) === 0){
        $request = json_encode(curl_exec($curl));
//            sleep(defaultDelay);
//        }

        if ($request === false) {
            throw new Exception(curl_error($curl), curl_errno($curl));
        }
        curl_close($curl);

//        for($i = 0; $i < count($request->data ?? (array)null); $i++) { //и для всех массивов с фалами
//
//            array_push($fileLinks, $request->data[$i]->file ?? null); //записываем их
//        }
        echo json_encode($request);
    } catch(Exception $e) {

        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);

    }
}
function getRequestID() {
    try {
        $curl = curl_init();
        if ($curl === false) {
            throw new Exception('failed to initialize');
        }
        curl_setopt_array($curl, array(
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_POST => 1,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => getRequestID_URL,
            CURLOPT_TIMEOUT => 60
        ));
        $request = curl_exec($curl);

        if ($request === false) {
            throw new Exception(curl_error($curl), curl_errno($curl));
        }

        curl_close($curl);
        echo json_encode($request);
//        sleep(60);
//        getFileLinks($request->request_id ?? null);
    } catch(Exception $e) {

        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);

    }
}
getRequestID();