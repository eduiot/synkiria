<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, *");
require_once 'localDB.php';
$db = new localDB();
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

 //echo session_id();
/**
 * If User is logged in
 */

if(
    /** if session is available and valid*/
    ((isset($_SESSION["email"])&&isset($_SESSION["password"]) &&validUser($_SESSION["email"], $_SESSION["password"]))
    /** if user id is available and valid */
    ||(isset($_POST["uuid"]) && isValidUserId($_POST["uuid"]))) && 
    
    isset($_POST['c'])){
    $email = null;
    $uuid = null;
    $password = null;
    if(isset($_SESSION["email"]) && isset($_SESSION["password"])){
        $email = $_SESSION["email"];
        $password = $_SESSION["password"];
    }else{
        $email = getEmailFromUUID($_POST["uuid"]);
        $uuid = $_POST["uuid"];
    }
    $command = $_POST['c'];
    $email =$_SESSION["email"];
    switch ($command) {
        case 1:
            getGeneralInformation($email);
            break;
        case 2:
            forceLocation($email);
            break;
        case 3:
            getForcedLocation($email);
            break;
        case 4:
            callMonitor($email);
            break;
        case 5:
            getMonitorResult($email);
            break;
        case 6:
            getMonitorResult($email);
            break;
        case 7:
            getAlarm($email);
            break;
        case 8:
            $a1 = $_POST['a1'];
            $a2 = $_POST['a2'];
            $a3 = $_POST['a3'];
            $to = $_POST['to'];
            $v1 = $_POST['v1'];
            $v2 = $_POST['v2'];
            $v3 = $_POST['v3'];
            setAlarm($email, $a1, $a2, $a3, $to, $v1, $v2, $v3);
            break;
        case 9:
            $start = $_POST['start'];
            $end = $_POST['end'];
			$starttime = $_POST['starttime'];
			$endtime = $_POST['endtime'];
            getPoints($start, $end, $starttime, $endtime, $email);
            break;
        case 10:
            loginUser($email, $password);
            break;
        case 11:
            if (validUser($email,$password)) {
                echo json_encode(array("result" => true));
            }else if (isValidUserId($uuid)){
                echo json_encode(array("result" => true,"uuid"=>$uuid));

            }  else {
                echo json_encode(array("result" => false));
            }
            break;
        case 12:
            if (validUser($email,$password)) {
                echo json_encode(array("result" => true));
                $_SESSION["email"] = $email;
                $_SESSION["password"] = $password;
            }else if (isValidUserId($uuid)){
                echo json_encode(array("result" => true,"uuid"=>$uuid));

            }  else {
                echo json_encode(array("result" => false));
            }
            break;
        case 13:
            $id = getGpsId($email);
            if ($id != null) {
                $rs = $GLOBALS["db"]->queryDB("select * from gps_position_report where gps_id='$id' order by timestamp limit 1");
                echo json_encode(array("result" => true, "info" => $rs,"uuid"=>$uuid));                
                
            } else {
                echo json_encode(array("result" => false,"uuid"=>$uuid));
            }
            break;
        case 14:
            $id = getGpsId($email);
            if ($id != null) {
                $rs = $GLOBALS["db"]->queryDB("select * from gps_position_report where gps_id='$id' and cmd_source='AL' order by timestamp limit 10");
                echo json_encode(array("result" => true, "info" => $rs,"uuid"=>$uuid));                
                
            } else {
                echo json_encode(array("result" => false,"uuid"=>$uuid));
            }
            break;
        case 15:
            getLastPositionMtk($email);
            break;
        case 16:
            getSOSNumbers($email);
            break;
        case 17:
            if (isset($_POST['sos1']) && isset($_POST['sos2'])&& isset($_POST['sos3'])){
                $sos1 = $_POST["sos1"];
                $sos2 = $_POST["sos2"];
                $sos3 = $_POST["sos3"];
                setSOSNumbers($email,$sos1,$sos2,$sos3);
            }
            break;
        case 23:
            session_destroy();
            $_SESSION["email"] = "";
            $_SESSION["password"] = "";
            echo json_encode(array("loggedout"=>true));
            break;
        /**
         * Check if user is logged in
         */
        case 24:
            if ( validUser($email,$password)) {
                echo json_encode(array("result" => true));
            }else if (isValidUserId($uuid)){
                echo json_encode(array("result" => true,"uuid"=>$uuid));

            }  else {
                echo json_encode(array("result" => false));
            }
            break;
        case 25:
            getWatchPhoneNumber($email);
            break;
        case 26:
            if (isset($_POST["radius"]) && isset($_POST["name"])){
                $radius = $_POST["radius"];
                $name = $_POST["name"];
                $latitude = null;
                $longitude = null;
                $latitude_marking = null;
                $longitude_longitude = null;
                if (isset($_POST["latitude"])){
                    $latitude = $_POST["latitude"];
                }
                if (isset($_POST["longitude"])){
                    $longitude = $_POST["longitude"];
                }
                if (isset($_POST["latitude_marking"])){
                    $latitude_marking = $_POST["latitude_marking"];
                }
                if (isset($_POST["longitude_longitude"])){
                    $longitude_longitude = $_POST["longitude_longitude"];
                }

                saveGeofencePerimeter($email,$radius,$name,$latitude,$longitude,$latitude_marking,$longitude_longitude);
            }else{
                echo json_encode(array("saved"=>false));
            }
            break;
        case 27:
            if (isset($_POST["latitude"]) && isset($_POST["longitude"])&& isset($_POST["latitude_marking"])&& isset($_POST["longitude_longitude"])){
                
                $latitude = $_POST["latitude"];
                $longitude = $_POST["longitude"];
                $latitude_marking = $_POST["latitude_marking"];
                $longitude_longitude = $_POST["longitude_longitude"];
                getGeofencePerimeter($email,$latitude,$longitude,$latitude_marking,$longitude_longitude);
            }
            break;
        case 28:
            searchUser();
            break;
        case 29:
            turnOffWatch($email);
            break;
        case 30:
            $gps_id = getGpsId($email);
            $auto_answer = getSetting($gps_id,"auto_answer");
            echo($auto_answer);
            break;
        case 31:
            if(isset($_POST["enabled"])){
                enableDisableAutoAnswer($email,$_POST["enabled"]);
                echo(true);
            }else{
                echo(false);
            }
            break;
        case 32:
            listUsers();
            break;
        case 33:
            if(isset($_POST["email"])){
                showUserInfo($_POST["email"]);
            }
            break;
        case 34:
            if(isset($_POST["email"])){
                $email = $_POST["email"];
                $name_watch_user = $_POST["name_watch_user"];
                $name_relative = $_POST["name_relative"];
                $address = $_POST["address"];
                $watch_phone_number = $_POST["watch_phone_number"];
                $userEnabled = $_POST["userEnabled"];
                $alarmEnabled = $_POST["alarmEnabled"];
                saveUserInfo($email,$name_watch_user,$name_relative,$address,$watch_phone_number,$userEnabled,$alarmEnabled);
            }
            break;
        default:
            break;
    }

}
/**
 * If user is not loggedin or if it is logout request
 * 
 */
else if(isset($_POST['c'])){
    $command = $_POST['c'];
    // $token_id = $_POST['arp'];
	//$token_id = '12345678';
    switch($command){

        case 12:
            if(isset( $_POST["email"])&&isset($_POST["password"])){
                $email = $_POST["email"];
                $password = $_POST["password"];
                if (validUser($email,$password)) {
                    echo json_encode(array("result" => true));
                    $_SESSION["email"] = $email;
                    $_SESSION["password"] = $password;
                }
                else {
                    echo json_encode(array("result" => false,"email"=>$email,"password"=>$password));
                }
            }else if(isset($_POST["uuid"])){
                if (isValidUserId($_POST["uuid"])){
                    echo json_encode(array("result" => true,"uuid"=>$_POST["uuid"]));
                }  else {
                    echo json_encode(array("result" => false));
                }
            }else{
                echo json_encode(array("result" => false));
            }
            
            break;
         /**
         * Logout user
         */
        case 23:
            session_destroy();
            $_SESSION["email"] = "";
            $_SESSION["password"] = "";
            echo json_encode(array("loggedout"=>true));
            break;
        /**
         * Check if user is logged in
         */
        case 24:
            if(isset($_POST["email"])&&isset($_POST["password"])){
                if (validUser($_POST["email"],$_POST["password"])) {
                    $uuid = getUUIDFromEmail($_POST["email"]);
                    echo json_encode(array("result" => true,"uuid"=>$uuid));
                }
                else {
                    echo json_encode(array("result" => false));
                }
            }else if(isset($_POST["uuid"])){
                if (isValidUserId($_POST["uuid"])){
                    echo json_encode(array("result" => true,"uuid"=>$_POST["uuid"]));
                }  else {
                    echo json_encode(array("result" => false));
                }
            }else{
                echo json_encode(array("result" => false));
            }
        
        break;
        default:
            break;
    }
}

if(isset($_POST['c'])){
    $command = $_POST['c'];
    switch ($command) {
        /**
         * Register user
         */
        case 18:
            if(isset($_POST['name_watch_user'])&&
                    $_POST['name_relative']&&
                    $_POST['address']&&
                    $_POST['phone_no']&&
                    $_POST['watch_phone_no']&&
                    $_POST['user_nif']&&
                    $_POST['imei_no']&&
                    $_POST['icc_no']&&
                    $_POST['bank_account']&&
                    $_POST['email']&&
                    $_POST['password']
                ){
                $uuid = uniqid('', true);
                $name_watch_user = $_POST["name_watch_user"];
                $name_relative = $_POST['name_relative'];
                $address = $_POST['address'];
                $phone_no =$_POST['phone_no'];
				
                $watch_phone_no = $_POST['watch_phone_no'];
                $user_nif = $_POST['user_nif'];
                $watch_id = substr($_POST['imei_no'],-11,10);
                $imei_no = $_POST['imei_no'];
                $bank_account = $_POST['bank_account'];
                $email = $_POST['email'];
                $password = $_POST['password'];
				$icc_no = $_POST['icc_no'];
                $gps_id = $watch_id;
                $password_encrypt = md5($password);
				
				
                $GLOBALS["db"]->updateDB("INSERT INTO gps_user (name_watch_user, name_relative,address, phone_no,user_nif,bank_account,email,password,uuid) VALUES('$name_watch_user', '$name_relative','$address', '$phone_no','$user_nif','$bank_account','$email','$password_encrypt','$uuid');");
                $GLOBALS["db"]->updateDB("INSERT INTO gps_devices (gps_id, watch_phone_no, imei_no, icc_no) VALUES('$gps_id','$watch_phone_no','$imei_no','$icc_no');");
				$GLOBALS["db"]->updateDB("UPDATE gps_devices SET user_email= '$email' WHERE gps_id = '$gps_id';");
				
                $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','position' ,'-','NEW');");
                $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','enableTakeOff' ,'-','NEW');");
                $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','call' ,'-','NEW');");
                $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','disableTakeOff' ,'-','NEW');");
                $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','setAlarm' ,'-','NEW');");
                $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','monitor' ,'-','NEW');");
                $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','voice' ,'-','DONE');");
                $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','voiceTest' ,'-','DONE');");
               
                $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','setDataUplInt' ,'3600','NEW');");
                $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','enableTakeOff' ,'true','NEW');");
                $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','setHeartRateUploadTime' ,'900','NEW');");
                
                
                setSOSNumbers($email,$phone_no,"-","-");
                setMonitorNumber($email,$phone_no);
                setCenterNumber($email,$phone_no);
                setLanguageTimezone($email, "4","1");
                $response_params = array(
                    "message" => "Sucessfully+Registered!",
                    "print" => true,
                    "name_watch_user" => $name_watch_user,
                    "name_relative" => $name_relative,
                    "address" => $address,
                    "phone_no" => $phone_no,
                    "user_nif" => $user_nif,
                    "imei_no" => $imei_no,
                    "icc_no" => $icc_no,
                    "bank_account" => $bank_account,
                    "email" => $email,
                    "password" => $password);
                $base_url = "https://app.synkiria.com/register.html";
                
                header("Location:".$base_url."?". http_build_query($response_params,null,"&",PHP_QUERY_RFC3986));
            }
            else{
                header("Location: https://app.synkiria.com/register.html?error=Error+While+Registering!");
            }
            break;
        case 19:
            /**
             * Check if registration email already exists
             */
            if(isset( $_POST["r_email"])){
                $r_email = $_POST["r_email"];
                $exists = emailExists($r_email);
                $arr = array ('result'=>$exists);                
                echo json_encode($arr);
            }
           
            break;
        case 20:
            /**
             * Check if registration phone number already exists
             */
            if(isset( $_POST["phone_no"])){
                $phone_no = $_POST["phone_no"];
                $exists = phoneNoExists($phone_no);
                $arr = array ('result'=>$exists);                
                echo json_encode($arr);
            }
        
            break;
        case 21:
            /**
             * Check if registration watch phone number already exists
             */
            if(isset( $_POST["watch_phone_no"])){
                $watch_phone_no = $_POST["watch_phone_no"];
                $exists = watchPhoneNoExists($watch_phone_no);
                $arr = array ('result'=>$exists);                
                echo json_encode($arr);
            }
        
            break;
        case 22:
            /**
             * Check if registration watch id already exists
             */
            if(isset( $_POST["watch_id"])){
                $watch_id = $_POST["watch_id"];
                $exists = watchIdExists($watch_id);
                $arr = array ('result'=>$exists);                
                echo json_encode($arr);
            }
        
            break;
        
        default:
            break;

    }
    
}
function listUsers(){
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_user;");
    $output = array();
    foreach ($rs as $row) {
        $current_row = array();
        $current_row["email"] = $row["email"];
        $current_row["phone_no"] = $row["phone_no"];
        $current_row["user_nif"] = $row["user_nif"];
        $current_row["bank_account"] = $row["bank_account"];
        $current_row["name_watch_user"] = $row["name_watch_user"];
        $current_row["name_relative"] = $row["name_relative"];
        $current_row["address"] = $row["address"];
        $current_row["uuid"] = $row["uuid"];
        array_push($output,$current_row);
    }
    echo json_encode($output);
}

function showUserInfo($email){
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_user where email = '$email';");
    $output = array();
    foreach ($rs as $row) {
        $current_row = array();
        $current_row["email"] = $row["email"];
        $current_row["phone_no"] = $row["phone_no"];
        $current_row["user_nif"] = $row["user_nif"];
        $current_row["bank_account"] = $row["bank_account"];
        $current_row["name_watch_user"] = $row["name_watch_user"];
        $current_row["name_relative"] = $row["name_relative"];
        $current_row["address"] = $row["address"];
        $current_row["uuid"] = $row["uuid"];
        $current_row["userEnabled"] = $row["enabled"];
        $gps_device_info = getGPSDeviceInfo($email);
        $current_row["watch_phone_number"] = $gps_device_info["watch_phone_no"];
        $current_row["alarmEnabled"] = $gps_device_info["alarm_service"];
        
        array_push($output,$current_row);
    }
    echo json_encode($output);
}

function saveUserInfo($email,$name_watch_user,$name_relative,$address,$watch_phone_number,$userEnabled,$alarmEnabled){
    $gps_id = getGpsId($email);
    $query1 = "Update gps_user set enabled=$userEnabled,name_watch_user='$name_watch_user', name_relative='$name_relative',address='$address' where email = '$email';";
    $query2 = "Update gps_devices set alarm_service=$alarmEnabled,watch_phone_no='$watch_phone_number' where gps_id = '$gps_id';";
    $rs1 = $GLOBALS["db"]->updateDB($query1);
    $rs2 = $GLOBALS["db"]->updateDB($query2);

    return;
}

function getGPSDeviceInfo($email){
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_devices  where user_email='$email'");
    $info = null;
    foreach ($rs as $row) {
       $info = $row;
       break;
    }
    return $info;
    
}

function turnOffWatch($email){
    $gps_id = getGpsId($email);
    
  
    $rs1 = $GLOBALS["db"]->queryDB("select *  from gps_api where gps_id='$gps_id' and command= 'powerOff';");
    if(count($rs1)==0){
        
        $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','powerOff' ,'null','NEW');");
    }else{
        $GLOBALS["db"]->updateDB("update gps_api set status = 'NEW' where gps_id='$gps_id' and command='powerOff';");
    }
    echo(true);
}
function getSetting($gps_id,$setting) {
    $rs = $GLOBALS["db"]->queryDB("select $setting from gps_settings where gps_id='$gps_id'");
    $output = null;
    foreach ($rs as $row) {
        $output = $row[$setting];
        break;
    }
    return $output;
}

function enableDisableAutoAnswer($email,$enabled){
    $gps_id = getGpsId($email);
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_settings where gps_id='$gps_id'");
    
    if(count($rs)==0){
        $GLOBALS["db"]->updateDB("INSERT INTO gps_settings (gps_id, auto_answer) VALUES('$gps_id', $enabled);");
        
    }else{
        $GLOBALS["db"]->updateDB("update gps_settings set auto_answer=$enabled where gps_id='$gps_id';");
        
    }
    $rs1 = $GLOBALS["db"]->queryDB("select *  from gps_api where gps_id='$gps_id' and command= 'autoAnswer';");
    if(count($rs1)==0){
        
        $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','autoAnswer' ,$enabled,'NEW');");
    }else{
        $GLOBALS["db"]->updateDB("update gps_api set data=$enabled,status = 'NEW' where gps_id='$gps_id' and command='autoAnswer';");
    }
}

function searchUser(){
    $rs = $GLOBALS["db"]->queryDB("select name_watch_user,name_relative,email,phone_no from gps_user");
    echo json_encode($rs);
    // echo json_encode(array("a"=>1,"b"=>2));
}

function saveGeofencePerimeter($email,$radius,$name,$latitude,$longitude,$latitude_marking,$longitude_longitude){
    $uuid = getUUIDFromEmail($email);
    $gps_id = getGpsId($email);
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_geofence where gps_id='$gps_id' and name='$name'");
    
    if(count($rs)==0){
        $GLOBALS["db"]->updateDB("INSERT INTO gps_geofence (gps_id,`timestamp`,radius,name,latitude,longitude,latitude_marking,longitude_longitude) VALUES('$gps_id',now(), '$radius','$name','$latitude','$longitude','$latitude_marking','$longitude_longitude');");
        
    }else{
        $GLOBALS["db"]->updateDB("update gps_geofence set radius='$radius' where gps_id='$gps_id' and name='$name';");
    }
    echo json_encode(array("saved"=>true,"uuid"=>$uuid));
}
function getGeofencePerimeter($email,$latitude,$longitude,$latitude_marking,$longitude_longitude){
    $gps_id = getGpsId($email);
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_geofence where gps_id='$gps_id' and latitude='$latitude' and longitude='$longitude' and latitude_marking='$latitude_marking' and longitude_longitude='$longitude_longitude'");
    echo json_encode($rs);
}

function getWatchPhoneNumber($email) {
    $rs = $GLOBALS["db"]->queryDB("select watch_phone_no from gps_devices where user_email='$email'");
    $watch_phone_no = null;
    foreach ($rs as $row) {
        $watch_phone_no = $row['watch_phone_no'];
    }
    echo json_encode(array("watch_phone_no"=>$watch_phone_no));
    // return $watch_phone_no;
}
function emailExists($email){
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_user  where email='$email'");
    $exists = false;
    foreach ($rs as $row) {
        $exists = true;
    }
    return $exists;
    
}
function phoneNoExists($phone_no){
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_user  where phone_no='$phone_no'");
    $exists = false;
    foreach ($rs as $row) {
        $exists = true;
    }
    return $exists;
    
}
function watchPhoneNoExists($watch_phone_no){
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_devices  where watch_phone_no='$watch_phone_no'");
    $exists = false;
    foreach ($rs as $row) {
        $exists = true;
    }
    return $exists;
    
}

function watchIdExists($watch_id){
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_devices  where gps_id='$watch_id'");
    $exists = false;
    foreach ($rs as $row) {
        $exists = true;
    }
    return $exists;
    
}
function setMonitorNumber($email,$monitor_no){
    $gps_id = getGpsId($email);
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_settings where gps_id='$gps_id'");
    
    if(count($rs)==0){
        $GLOBALS["db"]->updateDB("INSERT INTO gps_settings (gps_id, monitor_no) VALUES('$gps_id', '$monitor_no');");
        
    }else{
        $GLOBALS["db"]->updateDB("update gps_settings set monitor_no='$monitor_no' where gps_id='$gps_id';");
        
    }
    $rs1 = $GLOBALS["db"]->queryDB("select *  from gps_api where gps_id='$gps_id' and command= 'setMonitorNumber';");
    if(count($rs1)==0){
        
        $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','setMonitorNumber' ,'$monitor_no','NEW');");
    }else{
        $GLOBALS["db"]->updateDB("update gps_api set data='$monitor_no',status = 'NEW' where gps_id='$gps_id' and command='setMonitorNumber';");
    }
}
function setCenterNumber($email,$center_no){
    $gps_id = getGpsId($email);
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_settings where gps_id='$gps_id'");
    
    if(count($rs)==0){
        $GLOBALS["db"]->updateDB("INSERT INTO gps_settings (gps_id, center_no) VALUES('$gps_id', '$center_no');");
        
    }else{
        $GLOBALS["db"]->updateDB("update gps_settings set center_no='$center_no' where gps_id='$gps_id';");
        
    }
    $rs1 = $GLOBALS["db"]->queryDB("select *  from gps_api where gps_id='$gps_id' and command= 'setCenterNumber';");
    if(count($rs1)==0){
        
        $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','setCenterNumber' ,'$center_no','NEW');");
    }else{
        $GLOBALS["db"]->updateDB("update gps_api set data='$center_no',status = 'NEW' where gps_id='$gps_id' and command='setCenterNumber';");
    }
}
function setLanguageTimezone($email, $language,$zone){
    $gps_id = getGpsId($email);
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_settings where gps_id='$gps_id'");
    
    if(count($rs)==0){
        $GLOBALS["db"]->updateDB("INSERT INTO gps_settings (gps_id,`language`,`zone`) VALUES('$gps_id', '$language','$zone');");
        
    }else{
        $GLOBALS["db"]->updateDB("update gps_settings set language='$language',zone='$zone' where gps_id='$gps_id';");
        
    }
    $rs1 = $GLOBALS["db"]->queryDB("select *  from gps_api where gps_id='$gps_id' and command= 'setLangTimeZone';");
    if(count($rs1)==0){
        
        $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','setLangTimeZone' ,'$language,$zone','NEW');");
    }else{
        $GLOBALS["db"]->updateDB("update gps_api set data='$language,$zone',status = 'NEW' where gps_id='$gps_id' and command='setLangTimeZone';");
    }
}


function setSos1($email,$sos1){
    $gps_id = getGpsId($email);
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_settings where gps_id='$gps_id'");
    
    if(count($rs)==0){
        $GLOBALS["db"]->updateDB("INSERT INTO gps_settings (gps_id, sos1) VALUES('$gps_id', '$sos1');");
        
    }else{
        $GLOBALS["db"]->updateDB("update gps_settings set sos1='$sos1' where gps_id='$gps_id';");
        
    }
    $rs1 = $GLOBALS["db"]->queryDB("select *  from gps_api where gps_id='$gps_id' and command= 'setSOS1Number';");
    if(count($rs1)==0){
        
        $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','setSOS1Number' ,'$sos1','NEW');");
    }else{
        $GLOBALS["db"]->updateDB("update gps_api set data='$sos1',status = 'NEW' where gps_id='$gps_id' and command='setSOS1Number';");
    }
}
function setSos2($email,$sos2){
    $gps_id = getGpsId($email);
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_settings where gps_id='$gps_id'");
    
    if(count($rs)==0){
        $GLOBALS["db"]->updateDB("INSERT INTO gps_settings (gps_id, sos2) VALUES('$gps_id', '$sos2');");
        
    }else{
        $GLOBALS["db"]->updateDB("update gps_settings set sos2='$sos2' where gps_id='$gps_id';");
        
    }
    $rs2 = $GLOBALS["db"]->queryDB("select *  from gps_api where gps_id='$gps_id' and command= 'setSOS2Number';");
    if(count($rs2)==0){
        
        $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','setSOS2Number' ,'$sos2','NEW');");
    }else{
        $GLOBALS["db"]->updateDB("update gps_api set data='$sos2',status = 'NEW' where gps_id='$gps_id' and command='setSOS2Number';");
    }
}
function setSos3($email,$sos3){
    $gps_id = getGpsId($email);
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_settings where gps_id='$gps_id'");
    
    if(count($rs)==0){
        $GLOBALS["db"]->updateDB("INSERT INTO gps_settings (gps_id, sos3) VALUES('$gps_id', '$sos3');");
        
    }else{
        $GLOBALS["db"]->updateDB("update gps_settings set sos3='$sos3' where gps_id='$gps_id';");
        
    }
    $rs3 = $GLOBALS["db"]->queryDB("select *  from gps_api where gps_id='$gps_id' and command= 'setSOS3Number';");
    if(count($rs3)==0){
        
        $GLOBALS["db"]->updateDB("INSERT INTO gps_api (gps_id,command, data,status) VALUES('$gps_id','setSOS3Number' ,'$sos3','NEW');");
    }else{
        $GLOBALS["db"]->updateDB("update gps_api set data='$sos3',status = 'NEW' where gps_id='$gps_id' and command='setSOS3Number';");
    }
}



function setSOSNumbers($email,$sos1,$sos2,$sos3){
    $gps_id = getGpsId($email);
    setSos1($email,$sos1);
    setSos2($email,$sos2);
    setSos3($email,$sos3);
    
}
function getSOSNumbers($email){
    $gps_id = getGpsId($email);
    $rs = $GLOBALS["db"]->queryDB("select *  from gps_settings where gps_id='$gps_id'");
    echo json_encode($rs);
    
}
function loginUser($email, $password) {
    $rs = $GLOBALS["db"]->queryDB("select count(*) as n from gps_user where email='$email'");
    if (null != $rs) {
        foreach ($rs as $row) {
            $GLOBALS["db"]->updateDB("update gps_user set enabled=true where  email='$email'");
			
            return true;
        }
        return false;
    } else {

        return false;
    }
}

function getPoints($start, $end, $starttime, $endtime, $email) {
    $uuid = getUUIDFromEmail($email);
    $id = getGpsId($email);
	
	$fstart = $start.' '.$starttime;
	$fend = $end.' '.$endtime;
    $rs = $GLOBALS["db"]->queryDB("select * from gps_position_report where `timestamp` >= '$fstart' and  `timestamp` <  '$fend' and gps_id='$id' and cmd_source='UD' order by timestamp ASC");
    $output = array();
    if(count($rs)>0){
        $step = count($rs) / 100 +1;
        for($i=0;$i<count($rs);$i+=$step){
            array_push($output,$rs[floor($i)]);
        }
    }
    echo json_encode(array("result" => true, "info" => $output,"uuid"=>$uuid));
    
    
}

function setAlarm($email, $a1, $a2, $a3, $to, $v1, $v2, $v3) {
    $uuid = getUUIDFromEmail($email);
    $id = getGpsId($email);
    if ($GLOBALS["db"]->updateDB("update gps_alarm set enabled1='$a1', enabled2='$a2', enabled3='$a3', take_off='$to', alarm1='$v1', alarm2='$v2', alarm3='$v3' where gps_id='$id'")) {
        $sv1;
        $sv2;
        $sv3;
        if ($a1 === "true") {
            $sv1 = "$v1-1-1";
        } else {
            $sv1 = "$v1-1-0";
        }
        if ($a2 === "true") {
            $sv2 = "$v2-1-1";
        } else {
            $sv2 = "$v2-1-0";
        }
        if ($a3 === "true") {
            $sv3 = "$v3-1-1";
        } else {
            $sv3 = "$v3-1-0";
        }
        $GLOBALS["db"]->updateDB("update gps_api set data='$sv1,$sv2,$sv3', status='NEW' where gps_id='$id' and command='setAlarm'");
        if ($to === "true") {
            $GLOBALS["db"]->updateDB("update gps_api set status='NEW' where gps_id='$id' and command='enableTakeOff'");
        } else {
            $GLOBALS["db"]->updateDB("update gps_api set status='NEW' where gps_id='$id' and command='disableTakeOff'");
        }
        echo json_encode(array("result" => true,"uuid"=>$uuid));
    } else {
        echo json_encode(array("result" => false,"uuid"=>$uuid));
    }
}

if ((isset($_SESSION['email']) && isset($_SESSION['password'])) & (isset($_GET['c']))) {
    $email = $_SESSION['email'];
    $password = $_SESSION['password'];
    $command = $_GET['c'];
    if (validUser($email,$password)) {
        switch ($command) {
            case 0:
                getGpsInformation($email);
                break;
            case 23:
                session_destroy();
                $_SESSION["email"] = "";
                $_SESSION["password"] = "";
                echo json_encode(array("loggedout"=>true));
                break;
            default :
                break;
        }
    }
}

function validUser($email,$password) {
    //echo $sql;
    $password_encrypt = md5($password);
    $rs = $GLOBALS["db"]->queryDB("select count(*) as n from gps_user where email='$email' ");
    //print_r($rs);
    if (null != $rs) {
        foreach ($rs as $row) {
            if ($row['n'] == 1) {
                return true;
            }
        }
        return false;
    } else {
        return false;
    }
}

function getEmailFromUUID($uuid) {
    $rs = $GLOBALS["db"]->queryDB("select email from gps_user where uuid='$uuid'");
    $id = null;
    foreach ($rs as $row) {
        $id = $row['email'];
    }
    return $id;
}

function getUUIDFromEmail($email) {
    $rs = $GLOBALS["db"]->queryDB("select uuid from gps_user where email='$email'");
    $id = null;
    foreach ($rs as $row) {
        $id = $row['uuid'];
    }
    return $id;
}


function isValidUserId($uuid) {
    //echo $sql;
    $rs = $GLOBALS["db"]->queryDB("select count(*) as n from gps_user where uuid='$uuid' and enabled='true'");
    //print_r($rs);
    if (null != $rs) {
        foreach ($rs as $row) {
            if ($row['n'] == 1) {
                return true;
            }
        }
        return false;
    } else {
        return false;
    }
}


function getGpsInformation($email) {
    
    $rs = $GLOBALS["db"]->queryDB("select gps_id from gps_devices where user_email='$email'");
    $gpsId = null;
    foreach ($rs as $row) {
        $gpsId = $row['gps_id'];
    }
    $rs = $GLOBALS["db"]->queryDB("select * from gps_devices where gps_id='$gpsId'");
    foreach ($rs as $row) {
        $bat = $row['battery'];
        $date = $row['last_link'];
        //Ultima Actualizacion: 2017-03-08 00:01:00  <br/><i class="fa fa-battery-full fa-1x"></i> 90%
        if ($bat < 25) {
            echo "Ultima Actualizacion: $date  <br/><i style=\"color:red\" class=\"fa fa-battery-0 fa-1x\"></i> $bat%";
        }
        if (($bat >= 25) & ($bat < 40)) {
            echo "Ultima Actualizacion: $date  <br/><i class=\"fa fa-battery-1 fa-1x\"></i> $bat%";
        }
        if (($bat >= 40) & ($bat < 60)) {
            echo "Ultima Actualizacion: $date  <br/><i class=\"fa fa-battery-2 fa-1x\"></i> $bat%";
        }
        if (($bat >= 60) & ($bat < 90)) {
            echo "Ultima Actualizacion: $date  <br/><i class=\"fa fa-battery-3 fa-1x\"></i> $bat%";
        }
        if ($bat >= 90) {
            echo "Ultima Actualizacion: $date  <br/><i class=\"fa fa-battery fa-1x\"></i> $bat%";
        }
    }
}

function getLastPosition($email) {
    $uuid = getUUIDFromEmail($email);
    $rs = $GLOBALS["db"]->queryDB("select gps_id from gps_user where email='$email'");
    $gpsId = null;
    foreach ($rs as $row) {
        $gpsId = $row['gps_id'];
    }
    $rs = $GLOBALS["db"]->queryDB("select * from gps_position_report where gps_id='$gpsId'  and valid='A' order by timestamp limit 1");
    foreach ($rs as $row) {
        $lat = convert($row['latitude'], $row['latitude_marking']);
        $lot = convert($row['longitude'], $row['longitude_longitude']);
        $arr = array('latitude' => $lat, "longitude" => $lot,"uuid"=>$uuid);
        echo json_encode($arr);
    }
}
function getLastPositionMtk($email) {
    $uuid = getUUIDFromEmail($email);
    $rs = $GLOBALS["db"]->queryDB("select gps_id from gps_user where email='$email'");
    $gpsId = null;
    foreach ($rs as $row) {
        $gpsId = $row['gps_id'];
    }
    $rs = $GLOBALS["db"]->queryDB("select * from gps_position_report where gps_id='$gpsId'  and valid='A' order by timestamp limit 1");
    
    $json_array = array ('latitude' => 41.225345, 'longitude'=> 1.5325267);  
    foreach ($rs as $row) {
        $lat = convert($row['latitude'], $row['latitude_marking']);
        $lot = convert($row['longitude'], $row['longitude_longitude']);
        $arr = array("latitude" => $lat, "longitude" => $lot,"uuid"=>$uuid);
        $json_array = json_encode($arr);
    }
    // echo $json_array
    // return $json_array              
    echo json_encode($json_array);

}

function getLastPosition10($email) {
    $rs = $GLOBALS["db"]->queryDB("select gps_id from gps_user where email='$email' ");
    $gpsId = null;
    foreach ($rs as $row) {
        $gpsId = $row['gps_id'];
    }
    $rs = $GLOBALS["db"]->queryDB("select * from gps_position_report where gps_id='$gpsId'  and valid='A' order by timestamp limit 10");
    echo json_encode($rs);
}

function getGeneralInformation($email) {
    $id = getGpsId($email);
    $uuid = getUUIDFromEmail($email);
    if ($id != null) {
        $rs = $GLOBALS["db"]->queryDB("select * from gps_devices where gps_id='$id'");
        echo json_encode(array("result" => true, "info" => $rs,"uuid"=>$uuid));
    } else {
        echo json_encode(array("result" => false,"uuid"=>$uuid));
    }
}

function forceLocation($email) {
    $id = getGpsId($email);
    $uuid = getUUIDFromEmail($email);
    if ($id != null) {
        $rs = $GLOBALS["db"]->updateDB("update gps_api set status='NEW' where gps_id='$id' and command='position'");
        echo json_encode(array("result" => true,"uuid"=>$uuid));
    } else {
        echo json_encode(array("result" => false,"uuid"=>$uuid));
    }
}

function callMonitor($email) {
    $id = getGpsId($email);
    $uuid = getUUIDFromEmail($email);
    if ($id != null) {
        $rs = $GLOBALS["db"]->updateDB("update gps_api set status='NEW' where gps_id='$id' and command='monitor'");
        echo json_encode(array("result" => true,"uuid"=>$uuid));
    } else {
        echo json_encode(array("result" => false,"uuid"=>$uuid));
    }
}

function getLast20($email) {
    $id = getGpsId($email);
    $uuid = getUUIDFromEmail($email);
    if ($id != null) {
        $rs = $GLOBALS["db"]->queryDB("select * from gps_position_report where gps_id='$id' order by timestamp limit 20");
        echo json_encode(array("result" => true, "info" => $rs,"uuid"=>$uuid));
    } else {
        echo json_encode(array("result" => false,"uuid"=>$uuid));
    }
}

function getAlarm($email) {
    $id = getGpsId($email);
    $uuid = getUUIDFromEmail($email);
    if ($id != null) {
        $rs = $GLOBALS["db"]->queryDB("select * from gps_alarm where gps_id='$id'");
        if (sizeof($rs) !== 0) {
            echo json_encode(array("result" => true, "info" => $rs,"uuid"=>$uuid));
        } else {
            echo json_encode(array("result" => false,"uuid"=>$uuid));
        }
    } else {
        echo json_encode(array("result" => false,"uuid"=>$uuid));
    }
}

function getMonitorResult($email) {
    $id = getGpsId($email);
    $uuid = getUUIDFromEmail($email);
    if ($id != null) {
        $rs = $GLOBALS["db"]->queryDB("select status from gps_api where gps_id='$id' and command='monitor'");
        $done = null;
        foreach ($rs as $row) {
            $done = $row['status'];
        }
        if ($done == "DONE") {
            echo json_encode(array("result" => true, "info" => true,"uuid"=>$uuid));
        } else {
            echo json_encode(array("result" => false, "info" => $done,"uuid"=>$uuid));
        }
        //echo json_encode(array("result" => true, "info" => "update gps_api set status='NEW' where gps_id='$id' and command='position'"));
    } else {
        echo json_encode(array("result" => false,"uuid"=>$uuid));
    }
}

function getForcedLocation($email) {
    $uuid = getUUIDFromEmail($email);
    $id = getGpsId($email);
    if ($id != null) {
        $rs = $GLOBALS["db"]->queryDB("select status from gps_api where gps_id='$id' and command='position'");
        $done = null;
        foreach ($rs as $row) {
            $done = $row['status'];
        }
        if ($done == "DONE") {
            $rs = $GLOBALS["db"]->queryDB("select latitude,latitude_marking,longitude,longitude_longitude from gps_position_report where gps_id='$id' order by timestamp desc limit 1");
            echo json_encode(array("result" => true, "info" => $rs,"uuid"=>$uuid));
        } else {
            $rs = $GLOBALS["db"]->queryDB("select latitude,latitude_marking,longitude,longitude_longitude from gps_position_report where gps_id='$id' order by timestamp desc limit 1");
            echo json_encode(array("result" => false, "info" => $rs,"uuid"=>$uuid));
        }
        //echo json_encode(array("result" => true, "info" => "update gps_api set status='NEW' where gps_id='$id' and command='position'"));
    } else {
        echo json_encode(array("result" => false,"uuid"=>$uuid));
    }
}

function getGpsId($email) {
    $rs = $GLOBALS["db"]->queryDB("select gps_id from gps_devices where user_email='$email'");
    $id = null;
    foreach ($rs as $row) {
        $id = $row['gps_id'];
    }
    return $id;
}

function convert($input, $d) {
    return ($d == 'S' || $d == 'W' ? '-' : '') . $input;
}

// Create connection


// Check connection