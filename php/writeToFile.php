<?php
    $log = "\n------------------------\n";
    $log .= print_r($_POST['json'], 1);
    $log .= "\n------------------------\n";
    file_put_contents(getcwd() . '/contact.log', $log, FILE_APPEND);
    return true;
