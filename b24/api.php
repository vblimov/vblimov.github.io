<?php
$apiUrl = 'https://b24-4a8be9.bitrix24.ru';
$userId = '1';
$webhookCode = '7j93im6fhm2yvs76';
$apiType = 'crm.lead.add.json';
$queryUrl = "$apiUrl/rest/$userId/$webhookCode/$apiType";

echo 'ver 0.01';

// ФИНЧЕНКО КСЕНИЯ АЛЕКСАНДРОВНА 79264692678 ksenia.kafar@yandex.ru
$input = array(
    'TITLE' => 'Лид',
    'NAME' => 'Новый2',
    'SECOND_NAME' => 'Человек2',
    'LAST_NAME' => 'Отчество2',
    'PHONE' => '79264692679',
    'EMAIL' => 'ksenia.kafar@yandezzz.ru',
    'TENDER_LINK' => 'https://vk.com/vblimov2',
    'MESSAGE' => 'Тестовый комментарий к лиду'
);
// ucfirst(strtolower() - Применить к фамилиям

// формируем параметры для создания лида в переменной $queryData
$queryData = http_build_query(array(
    'fields' => array(
        'TITLE' => $input['TITLE']." ".$input['NAME']." ".$input['SECOND_NAME']." ".$input['LAST_NAME'],
        'NAME' => $input['NAME'],
        'SECOND_NAME' => $input['SECOND_NAME'],
        'LAST_NAME' => $input['LAST_NAME'],

        'PHONE' => Array(
            "n0" => Array(
                "VALUE" => str_replace(" ","",$input["PHONE"]),
                "VALUE_TYPE" => "WORK",
            )),
        'EMAIL' => Array(
            "n0" => Array(
                "VALUE" => str_replace(" ","",$input["EMAIL"]),
                "VALUE_TYPE" => "WORK",
            )
        ),

        'OPENED' => 'Y',
        'STATUS_ID' => 'NEW',

        'SOURCE_ID' => "WEB", //Источник вебсайт
        'SOURCE_DESCRIPTION' => str_replace(" ","",$input["TENDER_LINK"]), // доп. описание источника

        'COMMENTS' => $input["MESSAGE"] // Комментарий клиента
    ),
    'params' => array("REGISTER_SONET_EVENT" => "Y")
));

// обращаемся к Битрикс24 при помощи функции curl_exec
$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_SSL_VERIFYPEER => 0,
    CURLOPT_POST => 1,
    CURLOPT_HEADER => 0,
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => $queryUrl,
    CURLOPT_POSTFIELDS => $queryData,
));
$result = curl_exec($curl);
curl_close($curl);
$result = json_decode($result, 1);
if (array_key_exists('error', $result)) echo "Ошибка при сохранении лида: ".$result['error_description']."<br/>";
else {
    echo "<br/>";
    echo $result;
}