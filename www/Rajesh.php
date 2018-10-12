<?php

//use Twilio\Rest\Client;
defined('BASEPATH') OR exit('No direct script access allowed');

class Rajesh extends CI_Controller {
	 
	
	//public $userpasswordemail;
	//for loding  helper 
	
	function __construct()
    {
        // Call the Model constructor
		
		
        parent::__construct();
		//header('Content-Type: text/html; charset=UTF-8');
		$this->load->database();
		$this->load->library('session');
		$this->load->model('piyush', 'm');
		
		$this->load->helper('cookie');
		$this->load->helper('url');
		$this->load->helper('file');
		$this->load->library('parser');
		$this->load->library("pagination");
		//Load captcha
		$this->load->library('image_lib'); 
		$this->load->helper(array('captcha'));
		$this->load->helper(array('form'));
		 $this->load->library('form_validation');
		 $this->load->library('upload');
		 
		// include APPPATH . 'third_party/twilio-php-master/Services/Twilio.php';
		 
		 //$this->load->library('uri');
		 
		 
    }

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	
	public function index()
	   {
		
		//echo  base_url();
		
		
		
		$data=$this->m->deviceList();
		
		echo json_encode($data);
		
		
		
	}
	// cheak fo prtner login
	 

	 
public function addToken(){
	$key=$this->input->post('res1');
	 $result=array('devicekey'=>$key);
	
	$data=$this->m->addRceordTbl('app',$result);
	
	echo json_encode($data);
	
}



public  function sendMessage($data,$target){
//FCM api URL
$url = 'https://fcm.googleapis.com/fcm/send';
//api_key available in Firebase Console -> Project Settings -> CLOUD MESSAGING -> Server key
$server_key = 'AAAAo4yYHE8:APA91bGujiw4ib0CArSqFhDlE8e48jlf9cOpzRkwNyPVNqJqdLshxjbSo4ipf3VmEjMkh6dqeHDliQ6ZIjj6V2RAjgdn9EGE0P-bWIEQxawIEz0zU9YwhhGZGZJkK-CbbP9plAVpKwWz';
			
$fields = array();
$fields['data'] = $data;
if(is_array($target)){
	$fields['registration_ids'] = $target;
}else{
	$fields['to'] = $target;
}
//header with content_type api key
$headers = array(
	'Content-Type:application/json',
  'Authorization:key='.$server_key
);
			
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
$result = curl_exec($ch);
if ($result === FALSE) {
	die('FCM Send Error: ' . curl_error($ch));
}
curl_close($ch);
return $result;
}
public function send_android_notification($registration_ids,$message) {
$fields = array(
'registration_ids' =>$registration_ids,
'data'=>$message
);
$headers = array(
'Authorization: key=AAAAo4yYHE8:APA91bGujiw4ib0CArSqFhDlE8e48jlf9cOpzRkwNyPVNqJqdLshxjbSo4ipf3VmEjMkh6dqeHDliQ6ZIjj6V2RAjgdn9EGE0P-bWIEQxawIEz0zU9YwhhGZGZJkK-CbbP9plAVpKwWz', // FIREBASE_API_KEY_FOR_ANDROID_NOTIFICATION
'Content-Type: application/json'
);
// Open connection
$ch = curl_init();
// Set the url, number of POST vars, POST data
curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
curl_setopt( $ch,CURLOPT_POST, true );
curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
// Disabling SSL Certificate support temporarly
curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
// Execute post
$result = curl_exec($ch );
if($result === false){
	
	
die('Curl failed:' .curl_errno($ch));
}
// Close connection
curl_close( $ch );

return $result;
}


	
	
	
public function pushRaj($msg_txt,$value,$msg_type){
//send a notifiation
$android_device_token=array();

$android_device_token[] = 'fHTa1dzleMI:APA91bF-eqhdL7uKdwiyrKfUdowweagI4WSSn86KsvEeif8BVX51VxqiJGDbpiaxxxbvWoPoWAiLJvVpsRnyu4qyxQb6PVmlRCYC2Gw9LeMJ2kKz3Q1HpJ1ISBdpIf6q59dvZY5fN7jF';


$message = array
(
    'message'   => $msg_txt." ".$value,
    'title'     =>  $msg_txt." value is ".$value,
	'body'=>'thisn jdhnb',
    'subtitle'  => 'Synkiria',
    'tickerText'    => 'hi',
    'vibrate'   => 1,
    'sound'     => 1,
	
    'largeIcon' => 'large_icon',
    'smallIcon' => 'small_icon'
);
$result = $this->send_android_notification($android_device_token,$message);
//dump result
//var_dump($result);

	 
	 
}

public function gpsidFromDevice($id){
	
	//$this->m->gpsid();
	$data=$this->m->gpsid($id);
	
	foreach($data as $data1){
		
		
		
		$this->pushRaj($data1->msg_txt,$data1->value,$data1->msg_type);
		exit;
		
	}
		
		//echo json_encode($data);
		
	
}

}
