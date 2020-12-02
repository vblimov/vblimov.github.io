<?php

/**
 * Переводит первый символ строки в заглавную букву, работает с UTF-8
 * @param $text <p>
 * Входная строка
 * </p>
 * @return string <p>
 * Строка с заглавным первым символом
 * </p>
 */
function mb_ucfirst($text) {
    return mb_strtoupper(mb_substr($text, 0, 1)) . mb_substr($text, 1);
}

/**
 * Разбивает входящую строку на массив с отсортированными значениями.
 * Дублирует все входящие "поля" в поле ADDITIONAL выходного массива.
 * @param string $str <p>
 * Cтрока типа "[Фамлиимя] [Имя] [Отчество] [Телефон 10-11 символов в длинну, без "+" в начале] [Email]", где
 * [поле] - необязательное поле
 * </p>
 * <p>
 * Приводит надйенные поля к общему типу (+7 для номеров, регистр для остальных)
 * Ненайденные поля имеют значение "Нет данных"
 * </p>
 * @return array(string) со следующими ключами:
 * <b>NAME</b> - Найденное имя
 * <b>SECOND_NAME</b> - Найденная фамилия
 * <b>LAST_NAME</b> - Найденное отчество
 * <b>PHONE</b> - Номер телефона
 * <b>EMAIL</b> - Email-адрес
 * <b>ADDITIONAL</b> - Продублированная входящая строка, приведенная к общему типу
 */
function regexString($str) {
    // Убираем \n, специсимволы + пробелы на краях
    $str = trim(str_replace(Array("\n", "+", "\n\t", "\r\n", chr(13), chr(10), "\r"), " ", $str));
    // Убираем мультипробелы
    $str = preg_replace('/\s+/', ' ', $str );
    // Перевод в заглавные
    $str = mb_strtoupper($str);
    // Убираем часто-заносимые некорретные данные
    $str = str_replace(Array("НЕТ", "ДАННЫХ"), "", $str);

    // Разделение по пробелу
    $piece_array = explode(" " , $str);

    // Приведение всех номеров к форму +79...
    foreach ($piece_array as &$piece_array_string) {
        if (preg_match('/[0-9]{11}/', $piece_array_string, $match)) {
            $piece_array_string = str_replace($match[0], "+7" . substr($match[0], 1), $piece_array_string);
        }
        elseif (preg_match('/[0-9]{10}/', $piece_array_string, $match)) {
            $piece_array_string = "+7" . $piece_array_string;
        }
    }

    // Удаление повторяющихся элементов
    $unique_array = array_unique($piece_array);

    $not_found = "Нет данных";
    $formatted = array(
        "NAME"        => $not_found,
        "SECOND_NAME" => $not_found,
        "LAST_NAME"   => $not_found,
        "PHONE"       => $not_found,
        "EMAIL"       => $not_found,
        "ADDITIONAL" => ""
    );

    foreach ($unique_array as $lnum => &$uuniq_part) {
        // Строка из символов "-"
        if(preg_match('/[-]/', $uuniq_part)) {
            unset($unique_array[$lnum]); // remove
            continue;
        }
        // Телефон
        elseif (is_numeric($uuniq_part)) {
            if ($formatted['PHONE'] == $not_found) {
                $formatted['PHONE'] = $uuniq_part;
            }
        }
        // Email
        $emailRegex = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/';
        if (preg_match($emailRegex, strtolower($uuniq_part))) {
            $uuniq_part = mb_strtolower(strtolower($uuniq_part));
            if ($formatted['EMAIL'] == $not_found) {
                $formatted['EMAIL'] = $uuniq_part;
            }
        }
        // Ф/И/О
        elseif (!preg_match('/[^А-Я]+/', $uuniq_part)) {
            $uuniq_part = mb_ucfirst(mb_strtolower($uuniq_part));
            if ($formatted['SECOND_NAME'] == $not_found) {
                $formatted['SECOND_NAME'] = $uuniq_part;
            }
            elseif ($formatted['NAME'] == $not_found) {
                $formatted['NAME'] = $uuniq_part;
            }
            elseif ($formatted['LAST_NAME'] == $not_found) {
                $formatted['LAST_NAME'] = $uuniq_part;
            }
        }
        // Suppress else { }
        // Дублируем все поля в пол поле
        $formatted['ADDITIONAL'] .= $uuniq_part . " ";
    }

    // Обрезаем пробелы в начале и в конце в поле ADDITIONAL
    $formatted['ADDITIONAL'] = trim($formatted['ADDITIONAL']);
    return $formatted;
}
