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
var geofenceCircle;
var radius_slider_shown = false;
var currentLocation=null;


document.addEventListener("deviceready", OnDeviceReady, false);

function OnDeviceReady() {
    deviceId = md5(String(device.uuid));
    $("#u").val(deviceId);
    $.post(serverIp, {u: deviceId, c: 11},
            function (data) {
                console.log(data);
                var obj = jQuery.parseJSON(data);
                //console.log(obj.result);
                if (obj.result === true) {
                    $("#gps-information").load("https://app.synkiria.com/secure.php?u=" + deviceId + "&c=0");
                    $('.clockpicker').clockpicker();
                    isEnabled = true;
                    $.post(serverIp, {u: deviceId, c: 13},
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
}


$(document).ready(function (){
    $("#u").val(deviceId);
});

//$(document).ready(function (e) {
//    $.post(serverIp, {u: deviceId, c: 11},
//            function (data) {
//                console.log(data);
//                var obj = jQuery.parseJSON(data);
//                //console.log(obj.result);
//                if (obj.result === true) {
//                    $("#gps-information").load("http://app.synkiria.com/secure.php?u=" + deviceId + "&c=0");
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
        fillOpacity: .9,
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
    
    $("#registerModal").modal();
    forceLocation(true);
    
}


function lastAlerts() {
    if (isEnabled) {
        $.post(serverIp, {u: deviceId, c: 14},
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
        $.post(serverIp, {u: deviceId, c: 4},
                function (data) {
                    //console.log(data);
                    var obj = jQuery.parseJSON(data);
                    if (obj.result === true) {
                        setTimeout(function () {
                            $.post(serverIp, {u: deviceId, c: 5},
                                    function (data) {
                                        $("#wait_label").text("");
                                        var obj = jQuery.parseJSON(data);
                                        console.log(obj)
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
function toggle_range_slider(){
    if(radius_slider_shown){
        if($("#config_name").val()=="" ||($("#config_name").val().replace(/\s/g,''))==""){
            alert("config name cannot be empty");
        }else{
            $('#radius_slider').hide();
            $("#radius_label").hide();
            $("#config_name_label").hide();
            $("#config_name").hide();
            radius_slider_shown = false;
    
            $.post(serverIp, {c: 26,radius:$("#radius_slider").val(),
                            name:$("#config_name").val(),latitude:currentLocation["latitude"],
                            longitude:currentLocation["longitude"],
                            latitude_marking:currentLocation["latitude_marking"],
                            longitude_longitude:currentLocation["longitude_longitude"]},
                function(data){
                    data = jQuery.parseJSON(data);
                    if (data.saved===true){
                        alert("Saved successfully");
                    }else{
                        alert("unable to save geofence perimeter");
                    }
            });
            $("#radius_edit_button").text("Tap to Edit");
        } 
       
    }else{
        $('#radius_slider').show();
        $('#radius_label').show();
        $('#config_name_label').show();
        $('#config_name').show();
        radius_slider_shown = true;
        $("#radius_edit_button").text("Tap to Save");
    }
    $("#radius_label").text("Radius: "+$("#radius_slider").val()+"m");
}
function editRadius(value){
    geofenceCircle.setRadius(Number(value));
    $("#radius_label").text("Radius: "+$("#radius_slider").val()+"m");
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
   
    isEnabled = true;
    if (isEnabled) {
        if (!firstTime){
            $("#wait_label").text("Esperando respuesta del reloj...");
        }
        $.post(serverIp, {u: deviceId, c: 2},
                function (data) {
                    //console.log(data);
                    var obj = jQuery.parseJSON(data);
                    deleteMarkersHistoric();
                    deleteActualMarker();
                    if (obj.result === true) {

                        //setTimeout(function () {console.log("retraso")}, 30000);
                        setTimeout(function () {
                            $.post(serverIp, {u: deviceId, c: 3},
                                    function (data) {
                                        //console.log(data);
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

                                            var marker = new google.maps.Marker({
                                                position: myLatLng,

                                                map: map,
                                                icon: actualIconMarker,

                                            });
                                            
                                            
                                            //google.maps.event.addListener(marker, 'click', function () {

                                            //var uu = "https://www.google.com/maps/place/";
                                            //var dd = marker.position;
                                            // window.location.href = uu + dd;
                                            // });
                                            actualMarker = marker;
                                            map.setCenter(myLatLng);
                                            geofenceCircle = new google.maps.Circle({
                                                strokeColor: '#00FF00',
                                                strokeOpacity: 0.8,
                                                strokeWeight: 2,
                                                fillColor: '#00FF00',
                                                fillOpacity: 0.1,
                                                map: map,
                                                center: myLatLng,
                                                radius: 100
                                              });
                                              geofenceCircle.bindTo("center",marker,"position");
                                              currentLocation = {"latitude":obj.info[0].latitude,"longitude":obj.info[0].longitude,"latitude_marking":obj.info[0].latitude_marking,"longitude_longitude":obj.info[0].longitude_longitude};
                                              
                                              $.post(serverIp, {c: 27,
                                                                latitude:currentLocation["latitude"],
                                                                longitude:currentLocation["longitude"],
                                                                latitude_marking:currentLocation["latitude_marking"],
                                                                longitude_longitude:currentLocation["longitude_longitude"]},
                                                    function(data){
                                                        data = jQuery.parseJSON(data);
                                                        console.log("current data:"+data);
                                                });
                                              var control = document.createElement('div'); 
                                              control.innerHTML("Hello world");
                                              google.maps.event.addDomListener(control, 'tap to edit', function() {
                                                 console.log("Edit clicked");
                                              }); 
                                              control.index = 1;   
                                              map.controls[google.maps.ControlPosition.TOP_RIGHT].push(control); 
                                              console.log("Pushed 1");
                                        } else {
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
                                            var marker = new google.maps.Marker({
                                                position: myLatLng,

                                                map: map,
                                                icon: actualIconMarker,

                                            });

                                           

                                            
                                            geofenceCircle = new google.maps.Circle({
                                                strokeColor: '#00FF00',
                                                strokeOpacity: 0.8,
                                                strokeWeight: 2,
                                                fillColor: '#00FF00',
                                                fillOpacity: 0.1,
                                                map: map,
                                                center: myLatLng,
                                                radius: 100
                                              });
                                            geofenceCircle.bindTo("center",marker,"position");
                                            currentLocation = {"latitude":obj.info[0].latitude,"longitude":obj.info[0].longitude,"latitude_marking":obj.info[0].latitude_marking,"longitude_longitude":obj.info[0].longitude_longitude};
                                             
                                            $.post(serverIp, {c: 27,
                                                            latitude:currentLocation["latitude"],
                                                            longitude:currentLocation["longitude"],
                                                            latitude_marking:currentLocation["latitude_marking"],
                                                            longitude_longitude:currentLocation["longitude_longitude"]},
                                                function(data){
                                                    data = jQuery.parseJSON(data)[0];
                                                    $("#config_name").val(data.name);
                                                    $("#radius_slider").val(data.radius);

                                            });
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
        $("#historyModal").modal();
    } else {
        
        $("#registerModal").modal();
    }

}

function traceH() {
    if (actualMarkerAlert != null) {
        actualMarkerAlert.setMap(null);
    }
    if (isEnabled) {
        var start = $("#hStart").val();
        var end = $("#hEnd").val();
        var starttime = $("#hEndtime").val();
        var endtime = $("#hStarttime").val();
        $.post(serverIp, {u: deviceId, c: 9, start: start, end: end, starttime: starttime, endtime: endtime},
                function (data) {
                    //console.log(data);
                    var obj = jQuery.parseJSON(data);
                    if (obj.result === true) {
                        var path = line.getPath();
                        var lat;
                        var lng;
                        deleteMarkersHistoric();
                        var watchPath = []
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
                            var myLatLng = {lat, lng};
                            watchPath.push(myLatLng);
                            var marker = new google.maps.Marker({
                                position: myLatLng,
                                map: map,
                                icon: iconMarker
                            });
                            hMarkers.push(marker);
                        }
                        var idx = obj.info.length - 1;
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
                        hMarkers.push(marker);
                        var watchPathLine = new google.maps.Polyline({
                            path: watchPath,
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                          });
                        watchPathLine.setMap(map);
                    } else {
                        $("#InfoModalText").text('No se encontro Informacion');
                    }

                });
    } else {
        
        $("#registerModal").modal();
    }
}

function deleteMarkersHistoric() {
    for (var i = 0; i < hMarkers.length; i++) {
        hMarkers[i].setMap(null);
    }
    hMarkers = [];
}

function deleteActualMarker() {
    if (actualMarker != null) {
        actualMarker.setMap(null);
        actualMarker = null;
    }

}

function getGeneralInformation() { 
    if (isEnabled) {
        $.post(serverIp, {u: deviceId, c: 1},
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
        var a1 = $("#chk1").is(':checked');
        var a2 = $("#chk2").is(':checked');
        var a3 = $("#chk3").is(':checked');
        var to = $("#takeOff").is(':checked');
        var v1 = $("#alarm1").val();
        var v2 = $("#alarm2").val();
        var v3 = $("#alarm3").val();
        $.post(serverIp, {u: deviceId, c: 8, a1: a1, a2: a2, a3: a3, to: to, v1: v1, v2: v2, v3: v3},
                function (data) {
                    var obj = jQuery.parseJSON(data);
                    console.log(data)


                });
    } else {
        
        $("#registerModal").modal();
    }

}

function setAlarm() {
    if (isEnabled) {
        $.post(serverIp, {u: deviceId, c: 7},
                function (data) {
                    var obj = jQuery.parseJSON(data);
                    //console.log(data)
                    if (obj.result === true) {
                        $("#alarm1").attr("value", obj.info[0].alarm1);
                        $("#alarm2").attr("value", obj.info[0].alarm2);
                        $("#alarm3").attr("value", obj.info[0].alarm3);
                        if (obj.info[0].enabled1 === "true") {
                            $("#chk1").bootstrapToggle('on');
                        } else {
                            $('#chk1').bootstrapToggle('off');
                        }
                        if (obj.info[0].enabled2 === "true") {
                            $("#chk2").bootstrapToggle('on');
                        } else {
                            $('#chk2').bootstrapToggle('off');
                        }
                        if (obj.info[0].enabled3 === "true") {
                            $("#chk3").bootstrapToggle('on');
                        } else {
                            $('#chk3').bootstrapToggle('off');
                        }
                        if (obj.info[0].take_off === "true") {
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

function register() {
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

function registerProcess() {
    var token = $("#token").val();
    $.post(serverIp, {u: deviceId, c: 12, token: token},
            function (data) {
                console.log(data)
                var obj = jQuery.parseJSON(data);

                if (obj.result === true) {
                    alert('Llave Aceptada');
                    isEnabled = true;
                    $("#gps-information").load("https://app.synkiria.com/secure.php?u=" + deviceId + "&c=0");
                    
                    
                    
                    $.ajax({
                        url: 'https://app.synkiria.com/secure.php', 
                        type: "POST",             
                        data: {'t': token,'u':deviceId,'c':15},
                        dataType: 'json',
                        cache: false,
                        success: function(data)
                        {
                            data =  JSON.parse(data);
                            var lat = parseFloat(data.latitude);
                            var lng = parseFloat(data.longitude);
                            var myLatLng = {lat, lng};
                            // map.setCenter(myLatLng);
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


