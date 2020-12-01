<?php

const requestLogin = '2543123023';          //логин
const requestPassword = '159753209';        //пароль
const requestAutopoiskID = '123456';        //id автопоиска
const requestReportID = '33934';            //id отчёта, по которому необходимо получить информацию
const requestYear = '2020';                 //год, за который необходимо получить тендеры
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
        echo $request;
    } catch(Exception $e) {

        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);

    }
}
getRequestID();