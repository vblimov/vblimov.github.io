<?php
const requestLogin = '2543123023';          //логин
const requestPassword = '159753209';        //пароль
$requestID = $_POST['requestID'];
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
            '&request_id=' . '55c108f0c693c5f139e1422c05131916' .
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
            sleep(10);
            $request = json_decode(curl_exec($curl), true);
        }
//        for($i = 0; $i < array_count_values($request['data']))
        curl_close($curl);
        echo json_encode($request);
    } catch(Exception $e) {

        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);

    }
}
function console_log( $smth ){
    echo '<script>';
    echo 'console.log('. json_encode( $smth ) .')';
    echo '</script>';
}
/*$requestID = $_POST['requestID'];
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
        curl_setopt($curl,CURLOPT_URL, $getFileLinkFromRequestID_URL);
        curl_setopt($curl,CURLOPT_POST, true);
        curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl,CURLOPT_SSL_VERIFYPEER , false);
        curl_setopt($curl,CURLOPT_SSL_VERIFYHOST , false);

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
}*/
getFileLinks($requestID);
