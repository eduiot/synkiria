var serverIp = "http://app.synkiria.com/secure.php";
$(document).ready(function(){
    $('#users_table').DataTable();
    $.post(serverIp, {c: 28},
        function (data) {
            data = jQuery.parseJSON(data);
            console.log(data);
            for(var i =0;i<data.length;i++){
                $('#users_table tr:last').after('<tr>'+
                    "<td>"+data[i]["name_watch_user"]+"</td>"+
                    "<td>"+data[i]["name_relative"]+"</td>"+
                    "<td>"+data[i]["email"]+"</td>"+
                    "<td>"+data[i]["phone_no"]+"</td>"+
                +'</tr');
            }
        }
    );
});