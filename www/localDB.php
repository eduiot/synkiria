
<?php

class FoobaseConnectException extends Exception {
    
}

class BarSQLException extends Exception {
    
}

class NetworkException extends Exception {
    
}

$DBServer = 'localhost';
$DBUser = 'gps';
$DBPass = 'Gp$13579@';
$DBName = 'gps';
error_reporting(E_ALL);
ini_set('display_errors', True);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

class localDB {

    public function queryDB($sql) {
        $result_set = array();
        $con = null;
        try {
            $conn = new mysqli($GLOBALS['DBServer'], $GLOBALS['DBUser'], $GLOBALS['DBPass'], $GLOBALS['DBName']);
            $rs = $conn->query($sql);
            $result_set = $rs->fetch_all(MYSQLI_ASSOC);
            $rs->free();
            $conn->close();
        } catch (mysqli_sql_exception $ex) {
            echo $ex;
        }
        return $result_set;
    }

    public function updateDB($sql) {
        $result = false;
        try {
            $conn = new mysqli($GLOBALS['DBServer'], $GLOBALS['DBUser'], $GLOBALS['DBPass'], $GLOBALS['DBName']);
            $conn->query($sql);
            $conn->close();
            $result = true;
            //echo 'OK';
        } catch (mysqli_sql_exception $ex) {
            echo $ex;
        }
        return $result;
    }

}
