<?php
echo 1111111;

$queryUrl = 'https://b24-4a8be9.bitrix24.ru/rest/1/7j93im6fhm2yvs76/crm.lead.add.json';

// формируем параметры для создания лида в переменной $queryData
$queryData = http_build_query(array(
    'fields' => array(
        'TITLE' => 'Название лида',
        'NAME' => 'Sex',
        'SECOND_NAME' => 'Second sex',
        'WEB' => 'https://vk.com/vblimov'
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

?>

<?php
//echo 1111111;
//
//$queryUrl = 'https://b24-4a8be9.bitrix24.ru/rest/1/7j93im6fhm2yvs76/crm.lead.add.json';
//
//// формируем параметры для создания лида в переменной $queryData
//$queryData = http_build_query(array(
//    'fields' => array(
//        'TITLE' => 'Название лида',
//        'NAME' => 'Sex',
//        'SECOND_NAME' => 'Second sex',
//        'WEB' => 'https://vk.com/vblimov'
//    ),
//    'params' => array("REGISTER_SONET_EVENT" => "Y")
//));
//
//// обращаемся к Битрикс24 при помощи функции curl_exec
//$curl = curl_init();
//curl_setopt_array($curl, array(
//    CURLOPT_SSL_VERIFYPEER => 0,
//    CURLOPT_POST => 1,
//    CURLOPT_HEADER => 0,
//    CURLOPT_RETURNTRANSFER => 1,
//    CURLOPT_URL => $queryUrl,
//    CURLOPT_POSTFIELDS => $queryData,
//));
//$result = curl_exec($curl);
//curl_close($curl);
//$result = json_decode($result, 1);
//if (array_key_exists('error', $result)) echo "Ошибка при сохранении лида: ".$result['error_description']."<br/>";
//
//?>
