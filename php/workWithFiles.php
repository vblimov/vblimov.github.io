<?php
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
