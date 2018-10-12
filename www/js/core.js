var deviceId = "3c0eedabda661edfd837883800d95fa5";
var serverIp = "https://app.synkiria.com/secure.php";
var forcedLocation;
var actualMarker = null;
actualMarkerAlert = null;
var actualPosition;
var iconMarker;
var routeLine = [];
var line;
var isEnabled = false;
var hMarkers = [];
var map;
var u;
var password;
var watchPolyLines = []
var infoWindows = []
var currentInfoWindow = 0;

var localStorage = window.localStorage; 
loaddata();




document.addEventListener("deviceready", OnDeviceReady, false);
cordova.plugins.autoStart.enable();

function OnDeviceReady() {

    deviceId = md5(String(device.uuid));
    console.log("UUUIIIDDD: " +device.uuid);
    



    $.post(serverIp, { c: 24},
            function (data) {
                var obj = jQuery.parseJSON(data);
                //console.log(obj.result);
                if (obj.result === true) {
                    $("#gps-information").load("https://app.synkiria.com/secure.php?c=0");
                    $('.clockpicker').clockpicker();
                    isEnabled = true;
                    $.post(serverIp, {c: 13},
                            function (data) {
                                var obj = jQuery.parseJSON(data);
                                deleteMarkersHistoric();
                                deleteActualMarker();
                                if (obj.result === true) {
                                    var l = obj.info[0].latitude;
                                    if (obj.info[0].latitude_marking === 'S') {
                                        l = l * -1;
                                    }
                                    var ln = obj.info[0].longitude;
                                    if (obj.info[0].longitude_longitude === 'W') {
                                        ln = ln * -1;
                                    }
                                    var lat = parseFloat(l);
                                    var lng = parseFloat(ln);
                                    var myLatLng = {lat, lng};

                                    var marker = new google.maps.Marker({
                                        position: myLatLng,
                                        map: map,
                                        icon: actualIconMarker

                                    });

                                    actualMarker = marker;

                                }



                            });

                } else {
                    
                    $("#registerModal").modal();

                }
            });


    loginProcess();
    $('#registerModal').modal('hide');
}



function removeAllPathLines(){
    watchPolyLines.forEach(function(element) {
        element.setMap(null);
    }, this);
    watchPolyLines =  [];
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

$(document).ready(function (){
    let message = getUrlParameter("message");
    console.log("message:"+message);
    if (typeof message!="undefined"){
        $("#sucess_message").text(message);
    }else{
        $("#sucess_message").text("");
    }
    let error = getUrlParameter("error");
    let print = getUrlParameter("print");
    if (typeof error!="undefined"){
        $("#error_message").text(error);
    }else{
        $("#error_message").text("");
    }
    if(typeof print != "undefined"){
        setAllInputFieldsDisabled();
        $("#print_button").show();
        $("#confirm_password_group").css("visibility","hidden");
        $("#password").attr('type', 'text'); 
    }
});
function printPage(){
    // var printContents = document.getElementById(form_id).innerHTML;
    //  var originalContents = document.body.innerHTML;

    //  document.body.innerHTML = printContents;

     window.print();

    //  document.body.innerHTML = originalContents;
}
function powerOffWatch(){
    $.post(serverIp, {c: 29},
        function (data) {
            if(data==true){
                alert("Turned off watch");
            }else{
                alert("Turned off watch");
            }
        });
}
function setAllInputFieldsDisabled(){
    name_watch_user = getUrlParameter("name_watch_user");
    name_relative = getUrlParameter("name_relative");
    address = getUrlParameter("address");
    phone_no = getUrlParameter("phone_no");
    phone_no = getUrlParameter("phone_no");
    watch_phone_no = getUrlParameter("watch_phone_no");
    imei_no = getUrlParameter("imei_no");
    icc_no = getUrlParameter("icc_no");
    bank_account = getUrlParameter("bank_account");
    email = getUrlParameter("email");
    password = getUrlParameter("password");
    $("#name_watch_user").val(name_watch_user).prop("disabled",true);
    $("#name_relative").val(name_relative).prop("disabled",true);
    $("#address").val(address).prop("disabled",true);
    $("#phone_no").val(phone_no).prop("disabled",true);
    $("#watch_phone_no").val(watch_phone_no).prop("disabled",true);
    $("#user_nif").val(user_nif).prop("disabled",true);
    $("#imei_no").val(imei_no).prop("disabled",true);
    $("#icc_no").val(icc_no).prop("disabled",true);
    $("#bank_account").val(bank_account).prop("disabled",true);
    $("#email").val(email).prop("disabled",true);
    $("#password").val(password).prop("disabled",true);
}
function checkPhoneNumber(phone_no){
    $.post(serverIp, {c: 20,phone_no:phone_no},
        function (data) {
            data = jQuery.parseJSON(data);
            if (data.result===true){
                $("#phone_no_help").text("Phone # already registered!");
                $("#phone_no_form_group").addClass("has-error");
            }else{
                $("#phone_no_form_group").removeClass("has-error");
                $("#phone_no_help").text("");
            }
        });
}
function checkWatchPhoneNumber(watch_phone_no){
    $.post(serverIp, {c: 21,watch_phone_no:watch_phone_no},
        function (data) {
            console.log("watch phone number")
            console.log(data);
            data = jQuery.parseJSON(data);
            if (data.result===true){
                $("#watch_phone_no_help").text("Phone # already registered!");
                $("#watch_phone_no_form_group").addClass("has-error");
            }else{
                $("#watch_phone_no_form_group").removeClass("has-error");
                $("#watch_phone_no_help").text("");
            }
        });
}
function checkWatchId(watch_id){
    $.post(serverIp, {c: 22,watch_id:watch_id},
        function (data) {
            console.log("data watch id");
            console.log(data);
            data = jQuery.parseJSON(data);
            console.log("WatchId exists");
            if (data.result===true){
                $("#watch_id_help").text("Watch ID already registered!");
                $("#watch_id_form_group").addClass("has-error");
                console.log("WatchId exists");
            }else{
                $("#watch_id_form_group").removeClass("has-error");
                $("#watch_id_help").text("");
                console.log("WatchId does not exists");
            }
        });
}
function checkEmail(email){
    $.post(serverIp, {c: 19,r_email:email},
        function (data) {
            data = jQuery.parseJSON(data);
            console.log("Email exists");
            if (data.result===true){
                $("#email_help").text("Email already registered!");
                $("#email_form_group").addClass("has-error");
                console.log("Email exists");
            }else{
                $("#email_form_group").removeClass("has-error");
                $("#email_help").text("");
                console.log("Email does not exists");
            }
        });
}


//$(document).ready(function (e) {
//    $.post(serverIp, {u: deviceId, c: 11},
//            function (data) {
//                console.log(data);
//                var obj = jQuery.parseJSON(data);
//                //console.log(obj.result);
//                if (obj.result === true) {
//                    $("#gps-information").load("https://app.synkiria.com/secure.php?u=" + deviceId + "&c=0");
//                    $('.clockpicker').clockpicker();
//                    isEnabled = true;
//                    $.post(serverIp, {u: deviceId, c: 13},
//                            function (data) {
//                                //console.log(data);
//                                var obj = jQuery.parseJSON(data);
//                                deleteMarkersHistoric();
//                                deleteActualMarker();
//                                if (obj.result === true) {
//                                    var l = obj.info[0].latitude;
//                                    if (obj.info[0].latitude_marking === 'S') {
//                                        l = l * -1;
//                                    }
//                                    var ln = obj.info[0].longitude;
//                                    if (obj.info[0].longitude_longitude === 'W') {
//                                        ln = ln * -1;
//                                    }
//                                    var lat = parseFloat(l);
//                                    var lng = parseFloat(ln);
//                                    var myLatLng = {lat, lng};
//
//                                    var marker = new google.maps.Marker({
//                                        position: myLatLng,
//                                        map: map,
//                                        icon: actualIconMarker
//                                    });
//                                    actualMarker = marker;
//
//                                }
//
//
//
//                            });
//                } else {
//                    
//                    $("#registerModal").modal();
//
//                }
//            });
//});



function initMap() {

    map = new google.maps.Map(document.getElementById('mapid'), {
        center: {lat: 41.225345, lng: 1.5325267},
        zoom: 17,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: false,
        streetViewControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        fullscreenControl: false
    });
//actualPosition = {lat: 41.225345, lng: 1.5325267};
    iconMarker = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'peru',
        fillOpacity: 1,
        scale: 9,
        strokeColor: 'white',
        strokeWeight: 3
    };
    actualIconMarker = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'blue',
        fillOpacity: .9,
        scale: 15,
        strokeColor: 'white',
        strokeWeight: 3
    };
    actualIconMarkerAlert = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: .9,
        scale: 15,
        strokeColor: 'white',
        strokeWeight: 3,

    };


    line = new google.maps.Polyline({
        geodesic: true,
        strokeColor: '#156a16',
        strokeOpacity: 0.5,
        strokeWeight: 9
    });
    line.setMap(map);
    $.post(serverIp, {c: 24},
        function (data) {
            var obj = jQuery.parseJSON(data);
            if (obj.result === true) {
                isEnabled = true;
                console.log("Session available");
                $("#gps-information").load("https://app.synkiria.com/secure.php?c=0");
                $.post(serverIp,{c:25},function(data){
                    console.log("phone data:"+data)
                    data = jQuery.parseJSON(data)
                    $("#watch_phone_number_link").attr("href","tel:"+data.watch_phone_no);
            
                });
                
                
            }else{
                console.log("Session not available");
                isEnabled = false;
                $("#registerModal").modal();
            }
        }
    );
    
   
    
}
function logoutUser(){
    $.post(serverIp,{c:23},function(data){
        data = jQuery.parseJSON(data);
        if(data.loggedout===true){
            $(location).attr('href', 'index.html')
        }
    });
}


function lastAlerts() {
    if (isEnabled) {
        $.post(serverIp, {c: 14},
                function (data) {
                    var obj = jQuery.parseJSON(data);
                    if (obj.result === true) {
                        var text = "";
                        for (var i = 0, len = obj.info.length; i < len; i++) {
                            var lat = obj.info[i].latitude;
                            if (obj.info[i].latitude_marking === 'S') {
                                lat = lat * -1;
                            }
                            var lng = obj.info[i].longitude;
                            if (obj.info[i].longitude_longitude === 'W') {
                                lng = lng * -1;
                            }
                            lat = parseFloat(lat);
                            lng = parseFloat(lng);
                            var lnk = "<a href=\"#\" onclick=\"alertMarkerD(" + lat + "," + lng + ")\">Lugar</a>";
                            text = text + "<b>Fecha: </b>" + obj.info[i].timestamp + " " + lnk + "<br/>";


                        }
                        //console.log(obj.info);
                        $("#alertModalText").text("");
                        
                        $("#alertModalText").append(text);
                    } else {
                        $("#alertModalText").text('No se encontro Informacion');
                    }

                });

        $("#alertModal").modal();
    } else {
        
        $("#registerModal").modal();
    }
}

function alertMarkerD(lat, lng) {
    if (actualMarkerAlert != null) {
        actualMarkerAlert.setMap(null);
    }

    var myLatLng = {lat, lng};
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: actualIconMarkerAlert
    });
    actualMarkerAlert = marker;
    map.setCenter(myLatLng);
    $("#alertModal").modal('toggle');
}

function callMonitor() {
    if (isEnabled) {
        $("#wait_label").text("Esperando respuesta del reloj...");
        deleteMarkersHistoric();
        removeAllPathLines();
        $.post(serverIp, {c: 4},
                function (data) {
                    //console.log(data);
                    var obj = jQuery.parseJSON(data);
                    if (obj.result === true) {
                        setTimeout(function () {
                            $.post(serverIp, {c: 5},
                                    function (data) {
                                        $("#wait_label").text("");
                                        var obj = jQuery.parseJSON(data);
                                        if (obj.result === true) {
                                            $("#monitorModalText").text('Completado, Escucha silenciosa en proceso');
                                            $("#monitorModal").modal();
                                        } else {
                                            $("#monitorModalText").text('No se pudo comunicar con el Dispositivo');
                                            $("#monitorModal").modal();
                                        }

                                    });
                        }, 3000);



                    } else {
                        $("#monitorModalText").text('No se pudo comunicar con el Dispositivo');
                        $("#monitorModal").modal();
                    }

                });
    } else {
        
        $("#registerModal").modal();
    }



}
function toggle_menu(){
    $(".navbar-toggle").trigger("click");
   
}

function forceLocation(firstTime) {
    if (!firstTime){       
        toggle_menu();
       
    }
  
    if (actualMarkerAlert != null) {
        actualMarkerAlert.setMap(null);
    }
   
    if (isEnabled) {
        if (!firstTime){
            $("#wait_label").text("Esperando respuesta del reloj...");
        }
        $.post(serverIp, {c: 2},
                function (data) {
                    var obj = jQuery.parseJSON(data);
                    deleteMarkersHistoric();
                    removeAllPathLines();
                    deleteActualMarker();
                    if (obj.result === true) {

                        //setTimeout(function () {console.log("retraso")}, 30000);
                        setTimeout(function () {
                            $.post(serverIp, {c: 3},
                                    function (data) {
                                        $("#wait_label").text("")
                                        var obj = jQuery.parseJSON(data);
                                        if (obj.result === true) {
                                            var l = obj.info[0].latitude;
                                            if (obj.info[0].latitude_marking === 'S') {
                                                l = l * -1;
                                            }
                                            var ln = obj.info[0].longitude;
                                            if (obj.info[0].longitude_longitude === 'W') {
                                                ln = ln * -1;
                                            }
                                            var lat = parseFloat(l);
                                            var lng = parseFloat(ln);
                                            var myLatLng = {lat, lng};

                                            let marker = new google.maps.Marker({
                                                position: myLatLng,

                                                map: map,
                                                icon: actualIconMarker,

                                            });
                                            var contentString = '<div id="content"  style="" class ="col-xs-3 rounded">' +
                                                    '<a href="https://www.google.com/maps/place/' + marker.position + '"><h4 id="firstHeading" class="firstHeading">Encontrar</h4></a>' +
                                                    '</div>';

                                            let infowindow = new google.maps.InfoWindow({
                                                content: contentString,
                                                closeBoxURL: "",
                                                
                                            });
                                            marker.addListener('click', function () {
                                                infowindow.open(map, marker);
                                            });

                                            infowindow.open(map, marker);
                                            
                                            //google.maps.event.addListener(marker, 'click', function () {

                                            //var uu = "https://www.google.com/maps/place/";
                                            //var dd = marker.position;
                                            // window.location.href = uu + dd;
                                            // });
                                            actualMarker = marker;
                                            map.setCenter(myLatLng);
                                           
                                        } else if(typeof obj.info[0]!="undefined") {
                                            $("#locationModalText").text('No se pudo comunicar con el Dispositivo');
                                            var l = obj.info[0].latitude;
                                            if (obj.info[0].latitude_marking === 'S') {
                                                l = l * -1;
                                            }
                                            var ln = obj.info[0].longitude;
                                            if (obj.info[0].longitude_longitude === 'W') {
                                                ln = ln * -1;
                                            }
                                            var lat = parseFloat(l);
                                            var lng = parseFloat(ln);
                                            var myLatLng = {lat, lng};
                                            let marker = new google.maps.Marker({
                                                position: myLatLng,

                                                map: map,
                                                icon: actualIconMarker,

                                            });

                                            let contentString = '<div id="content"   class ="col-xs-3 rounded">' +
                                                    '<a href="https://www.google.com/maps/place/' + marker.position + '">Encontrar</a>' +
                                                    '</div>';
                                            
                                            let infowindow = new google.maps.InfoWindow({
                                                content: contentString
                                            });

                                            marker.addListener('click', function () {
                                                infowindow.open(map, marker);
                                            });
                                            infowindow.open(map, marker);
                                            
                                           
                                            // var controlDiv = document.createElement('div');
                                              
                                            // //### Add a button on Google Maps ...
                                            // var controlMarkerUI = document.createElement('button');
                                            // controlMarkerUI.style.backgroundColor = 'green';
                                            // controlMarkerUI.style.marginLeft = '50%';
                                            // controlMarkerUI.style.marginTop = '50%';
                                            // controlMarkerUI.className +=" form-control ";
                                            // controlMarkerUI.innerText = 'Tap to edit';
                                            // controlDiv.appendChild(controlMarkerUI);
                                        
                                        
                                        
                                            // map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
                                            //   console.log("Pushed 2");
                                            //google.maps.event.addListener(marker, 'click', function () {
                                            //var uu = "https://www.google.com/maps/place/";
                                            //	var dd = marker.position;
                                            // window.location.href = uu + dd;
                                            // });
                                            actualMarker = marker;
                                            $("#locationModal").modal();
                                            map.setCenter(myLatLng);
                                        }
                                    });
                        }, 5000);


                    } else {
                        $("#locationModalText").text('No se pudo comunicar con el Dispositivo');
                        $("#locationModal").modal();
                    }

                });
                
    } else {
        
        $("#registerModal").modal();
    }



    


}

function getHistoric() {
    if (isEnabled) {
        deleteMarkersHistoric();
        removeAllPathLines();
        var now = new Date();
        
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        
        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
        
        $('#hStart').val(today);
        $('#hEnd').val(today);
        
        $("#historyModal").modal();
    } else {
        
        $("#registerModal").modal();
    }

}
function configureSOS() {
    deleteMarkersHistoric();
    removeAllPathLines();
    $.post(serverIp, {c: 16},
        function (data) {
            var obj = jQuery.parseJSON(data)[0];
            if (typeof obj!="undefined"){
                var sos1 = $("#sos1").val(obj.sos1);
                var sos2 = $("#sos2").val(obj.sos2);
                var sos3 = $("#sos3").val(obj.sos3);
            }
        }
    );
    if (isEnabled) {
        $("#telephoneConfigurarModal").modal();
    } else {
        
        $("#registerModal").modal();
    }

}

function saveSOSConfig(){
    var sos1 = $("#sos1").val();
    var sos2 = $("#sos2").val();
    var sos3 = $("#sos3").val();
    $.post(serverIp,{u:deviceId,c:17,sos1:sos1,sos2:sos2,sos3:sos3},
        function (data){
        }
    );
    
}

function traceH() {
    watchPolyLines = [];
    if (actualMarkerAlert != null) {
        actualMarkerAlert.setMap(null);
    }
    if (isEnabled) {
        var start = $("#hStart").val();
        var end = $("#hEnd").val();
        var starttime = $("#hEndtime").val();
        var endtime = $("#hStarttime").val();
        $("#historicPagination").show()
        $.post(serverIp, {c: 9, start: start, end: end, starttime: starttime, endtime: endtime},
                function (data) {
                    var obj = jQuery.parseJSON(data);
                    if (obj.result === true) {
                        var path = line.getPath();
                        var lat;
                        var lng;
                        deleteMarkersHistoric();
                        removeAllPathLines();
                        let watchPath = []
                        
                        markers = []
                        let markerPoints = [];
                        for (var i = 0, len = obj.info.length; i < len; i++) {
                            lat = obj.info[i].latitude;
                            if (obj.info[i].latitude_marking === 'S') {
                                lat = lat * -1;
                            }
                            lng = obj.info[i].longitude;
                            if (obj.info[i].longitude_longitude === 'W') {
                                lng = lng * -1;
                            }
                            lat = parseFloat(lat);
                            lng = parseFloat(lng);
                            let myLatLng = {lat, lng};
                            
                            markerPoints.push([lat,lng]);
                            let label_string = ""+i;
                            let label_color = "black";
                            if(i==0){
                                label_color = "green";
                                label_string = i+"(Inicio)";
                            }else if(i==len-1){
                                label_string = i+"(Fin)";    
                                label_color = "green";
                            }
                            let marker = new google.maps.Marker({
                                position: myLatLng,
                                map: map,
                                icon: iconMarker,
                                title: "marker-"+i,
                                label: { color: label_color, fontSize: '20px',backgroundColor:"white", text: label_string }
                            });
                            marker.setOptions({'opacity': 1})
                            
                            hMarkers.push(marker);
                            let time_stamp = new Date(obj.info[i].timestamp);
                            date_part = time_stamp.getDate().toString();
                            date =  date_part.length>1?date_part:"0"+date_part;
                            month_part = (time_stamp.getMonth()+1).toString();
                            month =  month_part.length>1?month_part:"0"+month_part;
                            full_year = time_stamp.getFullYear();
                            
                            var hours = time_stamp.getHours();
                            if (hours==0){
                                hours = 24;
                            }
                            var minutes = time_stamp.getMinutes();
                            
                            let dateFormat = date+'/'+month+'/'+full_year +' '+hours +":"+minutes;
                            let contentString = '<a href="https://www.google.com/maps/place/' + marker.position + '" >'+dateFormat+'</a>';
                            
                            let infowindow = new google.maps.InfoWindow({
                                content: contentString
                            });
                            infoWindows.push(infowindow);
                            infowindow.is_active = false;
                            marker.addListener('click', function () {
                                if(infowindow.is_active){
                                    infowindow.close();
                                    infowindow.is_active = false;
                                }else{
                                    infowindow.is_active = true;
                                    infowindow.open(map, marker);
                                }
                            });
                            // marker.infowindow = infowindow;
                            
                        }
                        
                        var idx = obj.info.length - 1;
                        if (typeof obj.info[idx] != 'undefined'){
                            lat = obj.info[idx].latitude;
                            if (obj.info[idx].latitude_marking === 'S') {
                                lat = lat * -1;
                            }
                            lng = obj.info[idx].longitude;
                            if (obj.info[idx].longitude_longitude === 'W') {
                                lng = lng * -1;
                            }
                            lat = parseFloat(lat);
                            lng = parseFloat(lng);
                            var myLatLng = {lat, lng};
                            var marker = new google.maps.Marker({
                                position: myLatLng,
                                map: map,
                                icon: actualIconMarker
                            });
                            
                            
                        }
                        hMarkers.push(marker);
                       
                        for(let i=0;i<markerPoints.length;i++){
                            let exists = false;
                            for(j=i+1;j<markerPoints.length;j++){
                                if(markerPoints[i][0] == markerPoints[j][0] &&markerPoints[i][1] == markerPoints[j][1]){
                                    exists = true;
                                }
                            }
                            if(!exists){
                                let lat = markerPoints[i][0];
                                let lng = markerPoints[i][1];
                                watchPath.push({lat,lng});
                            }
                        }
                        let watchPathLine = new google.maps.Polyline({
                            path: watchPath,
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                          });
                        watchPathLine.setMap(map);
                        watchPolyLines.push(watchPathLine);
                        
                    } else {
                        $("#InfoModalText").text('No se encontro Informacion');
                    }


                   

                 
                });
    } else {
        
        $("#registerModal").modal();
    }
}

function deleteMarkersHistoric() {
    if (typeof hMarkers!="undefined"){
        for (var i = 0; i < hMarkers.length; i++) {
            if(typeof hMarkers[i]!="undefined"){
                hMarkers[i].setMap(null);
                // infoWindows[i].close();
            }
        }
        hMarkers = [];
        infoWindows = [];
    }
    
    
}
function hidePaginationButtons(){
    $("#historicPagination").hide()
}
function deleteActualMarker() {
    if (actualMarker != null) {
        actualMarker.setMap(null);
        actualMarker = null;
    }

}

function getGeneralInformation() { 
    if (isEnabled) {
        deleteMarkersHistoric();
        removeAllPathLines();
        $.post(serverIp, { c: 1},
                function (data) {
                    var obj = jQuery.parseJSON(data);
                    if (obj.result === true) {
                        //console.log(obj.info);
                        var text = "<b>ACTUALIZADO: </b>" + obj.info[0].last_link + "<br/>";
                        text = text + "<b>BATERIA: </b>" + obj.info[0].battery + "%<br/>";
                        text = text + "<b>IMEI  : </b>" + obj.info[0].gps_id + "<br/>";
                        text = text + "<b>PASOS: </b>" + obj.info[0].steps + "<br/>";
                        text = text + "<b>MARCA: </b>" + obj.info[0].vendor + "<br/>";
                        $("#InfoModalText").text("");
                        $("#InfoModalText").append(text);
                    } else {
                        $("#InfoModalText").text('No se encontro Informacion');
                    }

                });

        $("#infoModal").modal();
    } else {
        
        $("#registerModal").modal();
    }


}

function configureAlarm() {
    if (isEnabled) {
        deleteMarkersHistoric();
        removeAllPathLines();
        var a1 = $("#chk1").is(':checked');
        var a2 = $("#chk2").is(':checked');
        var a3 = $("#chk3").is(':checked');
        var to = $("#takeOff").is(':checked');
        var v1 = $("#alarm1").val();
        var v2 = $("#alarm2").val();
        var v3 = $("#alarm3").val();
        $.post(serverIp, { c: 8, a1: a1, a2: a2, a3: a3, to: to, v1: v1, v2: v2, v3: v3},
                function (data) {
                    var obj = jQuery.parseJSON(data);
                    console.log("Obj:"+obj);

                });
    } else {
        
        $("#registerModal").modal();
    }

}

function setAlarm() {
    if (isEnabled) {
        deleteMarkersHistoric();
        removeAllPathLines();
        $.post(serverIp, {c: 7},
                function (data) {
                    var obj = jQuery.parseJSON(data);
                    //console.log(data)
                    if (obj.result === true) {
                        $("#alarm1").attr("value", obj.info[0].alarm1);
                        $("#alarm2").attr("value", obj.info[0].alarm2);
                        $("#alarm3").attr("value", obj.info[0].alarm3);
                        if (obj.info[0].enabled1 === true) {
                            $("#chk1").bootstrapToggle('on');
                        } else {
                            $('#chk1').bootstrapToggle('off');
                        }
                        if (obj.info[0].enabled2 === true) {
                            $("#chk2").bootstrapToggle('on');
                        } else {
                            $('#chk2').bootstrapToggle('off');
                        }
                        if (obj.info[0].enabled3 === true) {
                            $("#chk3").bootstrapToggle('on');
                        } else {
                            $('#chk3').bootstrapToggle('off');
                        }
                        if (obj.info[0].take_off === true) {
                            $("#takeOff").bootstrapToggle('on');
                        } else {
                            $('#takeOff').bootstrapToggle('off');
                        }
                    }

                });
        $("#alarmModal").modal();
    } else {
        
        $("#registerModal").modal();
    }

}

function enableDisableAutoAnswer() {
    if (isEnabled) {
        deleteMarkersHistoric();
        removeAllPathLines();
        $.post(serverIp, {c: 30},
                function (data) {
                    console.log("enabled:"+data);
                    if(data==true){
                        $('#autoAnswerEnabled').prop('checked', true);
                    }else{
                        $('#autoAnswerEnabled').prop('checked', false);
                    }

                });
        $("#autoAnswerModal").modal();
    } else {
        
        $("#registerModal").modal();
    }

}

function enableDisableAutoAnswerProcess() {
    if (isEnabled) {
        deleteMarkersHistoric();
        removeAllPathLines();
        var enabled = $("#autoAnswerEnabled").is(':checked');
        $.post(serverIp, { c: 31, enabled:enabled},
                function (data) {
                    if(data==true){
                        if(enabled){
                            alert("Successfully enabled Auto Answer")
                        }else{
                            alert("Successfully disabled Auto Answer")
                        }
                    }else{
                        console.log(data);
                        if(enabled){
                            alert("Unable to enable Auto Answer")
                        }else{
                            alert("Unable to disabled Auto Answer")
                        }
                    }

                });
    } else {
        
        $("#registerModal").modal();
    }

}


function register() {
    
    removeAllPathLines();
    $("#registerIdModalText").text("");
    $("#registerIdModalText").text(deviceId);
    $("#registerIdModal").modal();
}

function closeApp() {
    console.log("Saliendo");
    if (navigator.app) {
        navigator.app.exitApp();
    } else if (navigator.device) {
        navigator.device.exitApp();
    } else {
        window.close();
    }
}


function loginProcess() {
    rememberdata();
    var email = $("#email").val();
    var password = $("#password").val();
    $.post(serverIp, {c: 12, email: email,password:password},
            function (data) {
                console.log("result::::"+data);
                var obj = jQuery.parseJSON(data);
                if (obj.result === true) {
                    alert('Llave Aceptada');
                    isEnabled = true;
                    $("#gps-information").load("https://app.synkiria.com/secure.php?c=0");
                    
                    $.ajax({
                        url: 'https://app.synkiria.com/secure.php', 
                        type: "POST",             
                        data: {'c':15},
                        dataType: 'json',
                        cache: false,
                        success: function(data)
                        {
                            

                            if(typeof data !="undefined" && data!=""){
                                if(typeof data=="string"){
                                    data = jQuery.parseJSON(data);
                                }
                                console.log("data:latitude : "+data.latitude);
                                console.log("data:longitude: "+data.longitude);
                                var lat = parseFloat(data.latitude);
                                var lng = parseFloat(data.longitude);
                                var myLatLng = {lat, lng};
                                map.setCenter(myLatLng);
                            }
                            forceLocation(true);
                            
                        },
                        error: function (request, status, error) {
                            console.log(error);
                        }
                    });
                    
                    $('.clockpicker').clockpicker();
                } else {
                    alert('Llave no Aceptada');
                }

            });
}


function searchUsers() {
    // Declare variables 
    var input, filter, table, tr, td, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("usersTable");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      } 
    }
  }


function saveUserInfo(){
    email_input = $("#email_input").val();
    name_watch_user = $("#name_watch_user").val();
    name_relative = $("#name_relative").val();
    address = $("#address").val();
    watch_phone_number = $("#watch_phone_number").val();
    userEnabled =  $("#userEnabled").is(':checked')?"true":"false";
    alarmEnabled =  $("#alarmEnabled").is(':checked')?"true":"false";
    console.log("alarmEnabled:"+alarmEnabled);
    $.post(serverIp, { c: 34, email: email_input,name_watch_user:name_watch_user,name_relative:name_relative,address:address,watch_phone_number:watch_phone_number,userEnabled:userEnabled,alarmEnabled:alarmEnabled },
        function (data) {
            console.log("data"+data)
        }
    );
        
    
}
function showUserInfo(email) {
    $.post(serverIp, {c: 33,email:email},
            function (data) {
                console.log(data);
                var data = jQuery.parseJSON(data);
                data = data[0];
                $("#email_input").val(data.email);
                $("#name_watch_user").val(data.name_watch_user);
                $("#name_relative").val(data.name_relative);
                $("#address").val(data.address);
                $("#watch_phone_number").val(data.watch_phone_number);
                if(data.userEnabled=="true"){
                    $('#userEnabled').prop('checked', true);
                }else{
                    $('#userEnabled').prop('checked', false);
                }

                if(data.alarmEnabled=="true"){
                    $('#alarmEnabled').prop('checked', true);
                }else{
                    $('#alarmEnabled').prop('checked', false);
                }
            });
    $("#userInfoModal").modal();

}
function closeAllInfoWindows(){
    infoWindows.forEach(function(element) {
        element.close();
    }, this);
}
function onPaginationButtonClicked(number){
    if(currentInfoWindow<=2){
        currentInfoWindow = (number -1);
    }else{
        currentInfoWindow += (number -3)
    }
    if(currentInfoWindow<0){
        currentInfoWindow =0
    }
    if(currentInfoWindow>=infoWindows.length){
        currentInfoWindow = infoWindows.length -1;
    }
    setPaginationPageButtonsText();
}
function setPaginationPageButtonsText(){
    let num_info_window = infoWindows.length;
    $("#bbButton1").css('background-color','white');
    $("#bbButton2").css('background-color','white');
    $("#bbButton3").css('background-color','white');
    $("#bbButton4").css('background-color','white');
    $("#bbButton5").css('background-color','white');
    closeAllInfoWindows();
    if(currentInfoWindow<0){
        currentInfoWindow =0;
    }
    if(currentInfoWindow>=num_info_window){
        currentInfoWindow  = num_info_window -1;
    }
    if(currentInfoWindow<=2){
        $("#bbButton1").text("0");
        $("#bbButton2").text("1");
        $("#bbButton3").text("2");
        $("#bbButton4").text("3");
        $("#bbButton5").text("4");
        $("#bbButton"+(currentInfoWindow+1)).css('background-color','gray');
        infoWindows[currentInfoWindow].open(map,hMarkers[currentInfoWindow]);
    }else if(currentInfoWindow<num_info_window-2){
        let start = currentInfoWindow -2;
        $("#bbButton1").text(start.toString());
        $("#bbButton2").text((start+1).toString());
        $("#bbButton3").text((start+2).toString());
        $("#bbButton4").text((start+3).toString());
        $("#bbButton5").text((start+4).toString());
        $("#bbButton3").css('background-color','gray');
        infoWindows[currentInfoWindow].open(map,hMarkers[currentInfoWindow]);
    }else{
        let diff =  num_info_window - currentInfoWindow;
        let start = currentInfoWindow -(4-diff);
        $("#bbButton1").text(start.toString());
        $("#bbButton2").text((start+1).toString());
        $("#bbButton3").text((start+2).toString());
        $("#bbButton4").text((start+3).toString());
        $("#bbButton5").text((start+4).toString());
        $("#bbButton"+(3+(2-diff))).css('background-color','gray');
        infoWindows[currentInfoWindow].open(map,hMarkers[currentInfoWindow]);
    }
}

function onNextClicked(){
    currentInfoWindow += 1;
    num_info_window = infoWindows.length;
    if(currentInfoWindow>0){
        $("#previousButton").prop('disabled', false).css('background-color','#4CAF50');
    }
    if(currentInfoWindow >= num_info_window -2){
        $("#nextButton").prop('disabled', true).css('background-color','gray');
    }
    setPaginationPageButtonsText();
}
function onPreviousClicked(){
    currentInfoWindow += -1;
    num_info_window = infoWindows.length;
    setPaginationPageButtonsText();
    if(currentInfoWindow<=0){
        $("#previousButton").prop('disabled', true).css('background-color','gray');
    }
    if(currentInfoWindow < num_info_window -2){
        $("#nextButton").prop('disabled', false).css('background-color','#4CAF50');;
    }
}


function showActionButtons(email){
    // $.post(serverIp, {c: 33,email:email},
    //     function (data) {
    //         console.log(data);
    //         var data = jQuery.parseJSON(data);
    //         data = data[0];
    //         $("#email_input").val(data.email);
    //         $("#name_watch_user").val(data.name_watch_user);
    //         $("#name_relative").val(data.name_relative);
    //         $("#address").val(data.address);
    //         $("#watch_phone_number").val(data.watch_phone_number);
    //         if(data.userEnabled=="true"){
    //             $('#userEnabled').prop('checked', true);
    //         }else{
    //             $('#userEnabled').prop('checked', false);
    //         }

    //         if(data.alarmEnabled=="true"){
    //             $('#alarmEnabled').prop('checked', true);
    //         }else{
    //             $('#alarmEnabled').prop('checked', false);
    //         }
    //     });
    $("#actionButtonsModal").modal();
}



function loaddata(){
 //  localStorage.setItem("email", "davurpic@gmail.com"); 
 //  localStorage.setItem("password",  "Admin1234"); 

if (localStorage.getItem("email") === null) 
    ;
else{
   document.getElementById("email").value  = localStorage.getItem("email");
   
}
if (localStorage.getItem("password") === null)  
    ;
else
   document.getElementById("password").value= localStorage.getItem("password");

}


function savedata(){
var email = document.getElementById("email").value;
var password = document.getElementById("password").value;
   localStorage.setItem("email",email); 
   localStorage.setItem("password", password); 
}

function emptydata(){
   localStorage.setItem("email",""); 
   localStorage.setItem("password", ""); 
}

function rememberdata() {
    var checkBox = document.getElementById("remember");
 
    if (checkBox.checked == true){
        savedata();
    } else {
        emptydata();
    }
}

/*

document.getElementById("email").value = "davurpic@gmail.com";
document.getElementById("password").value = "Admin1234";

function savedata(){
var email = $("#email").val();
var password = $("#password").val();
   localStorage.setItem("email",email); 
   localStorage.setItem("password", password); 
}

function loaddata(){
if (localStorage.getItem("email") === null) 
    ;
else
   $("#email").val(); = localStorage.getItem("email");
if (localStorage.getItem("password") === null)  
    ;
else
    $("#password").val(); = localStorage.getItem("password");

}



function myFunction() {
    var checkBox = document.getElementById("myCheck");
    var text = document.getElementById("text");
    if (checkBox.checked == true){
        text.style.display = "block";
    } else {
       text.style.display = "none";
    }
}
*/