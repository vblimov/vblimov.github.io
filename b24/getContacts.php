<?php

const requestLogin = '2543123023';          //логин
const requestPassword = '159753209';        //пароль
const requestAutopoiskID = '123456';        //id автопоиска
const requestReportID = '33934';            //id отчёта, по которому необходимо получить информацию
const requestYear = '2020';                 //год, за который необходимо получить тендеры
$isForcePrev = -1;

function readMyFiles($path){
    $myFile = fopen($path, "r") or die ("Unable to open file!");
    $data = fgets($myFile);
    fclose($myFile);
    return $data;
}
function writeToFile($path, $data) {
    $myFile = fopen($path, "w+") or die ("Unable to open file!");
    fwrite($myFile, $data);
    fclose($myFile);
}
function getRequestID() {
    $isForcePrev = readMyFiles('./isForcePrev.txt');
    if($isForcePrev !== '0')
    {
        $isForcePrev = '1';
        writeToFile('./isForcePrev.txt', '0');
    }
    $getRequestID_URL = 'https://www.tenderland.ru/pages/main' .   //url для получения request_id
        '?autopoisk=' . requestAutopoiskID .
        '&api=1&force_prev='. $isForcePrev .
        '&report=' . requestReportID .
        '&login=' . requestLogin .
        '&password=' . requestPassword .
        '&year=' . requestYear .
        '';
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
            CURLOPT_URL => $getRequestID_URL,
            CURLOPT_TIMEOUT => 60
        ));
        $request = curl_exec($curl);

        if ($request === false) {
            throw new Exception(curl_error($curl), curl_errno($curl));
        }

        curl_close($curl);
        echo json_decode($request, true)['request_id'].
        "<br><br><br>";
//        getFileLinks(json_decode($request, true)['request_id']);
    } catch(Exception $e) {

        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);

    }
}

function getFileLinks($requestID) {
    try {

        $fileLinks = (array)null;
        $curl = curl_init();
        if ($curl === false) {
            throw new Exception('failed to initialize');
        }

        $getFileLinkFromRequestID_URL = 'https://www.tenderland.ru/pages/main' .
            '?api=1&login=' . requestLogin .
            '&password=' . requestPassword .
            '&request_id=' . $requestID . //requestID
            '';
        curl_setopt_array($curl, array(
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_POST => 1,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $getFileLinkFromRequestID_URL,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_CONNECTTIMEOUT => 60
        ));
        $request = array(
            "status" => "",
            "data" => array(
            ),
        );

        while($request['data'] == array())
        {
            sleep(4);
            $request = json_decode(curl_exec($curl), true);
        }
        echo json_encode($request).
            "<br><br><br>";
        for($i = 0; $i < array_count_values($request['data']); $i++)
        {
            array_push($fileLinks, json_decode($request['data'][$i], true)['file']);
        }
        curl_close($curl);
        echo json_encode($fileLinks);

    } catch(Exception $e) {

        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);

    }
}
getRequestID();
//getFileLinks('55c108f0c693c5f139e1422c05131916');