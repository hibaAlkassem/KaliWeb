$(document).ready(function () {
    var idCtr = 19;

    while (idCtr != 93) {
        $('#deviceId').append($("<option />").val(idCtr).text(idCtr));

        if (idCtr == 27)
            idCtr = 89;
        idCtr++;
    }
    getLastSync();

    $('#deviceId').change(function () {

        getLastSync();

    });


    $('.btn-sensors').live('click', function () {



        var sensorData = '<div class="row sensor-data">' +
            '' +
            '                                <div class="col-lg-1 event-txt">Time</div>' +
            '                                <input class="col-lg-1 event-input" type="text" />' +
            '                                <div class="col-lg-1 event-txt">Pressure</div>' +
            '                                <input class="col-lg-1 event-input" type="text" />' +
            '                                <div class="col-lg-1 event-txt">Orientation</div>' +
            '                                <input class="col-lg-1 event-input" type="text" />' +
            '                                <div class="col-lg-1 event-txt">Capacitance</div>' +
            '                                <input class="col-lg-1 event-input" type="text" />' +
            '' +
            '' +
            '                            </div>';

        $(this).before(sensorData);

    });

    $('.btn-add-event').live('click', function () {


        var event = '<div class="event-div">' +
            '                            <h4>Event</h4>' +
            '' +
            '' +
            '' +
            '                            <div class="row event">' +
            '' +
            '                                <div class="col-lg-1 event-txt">StartTime</div>' +
            '                                <input class="col-lg-1 event-input" type="text" />' +
            '                                <div class="col-lg-1 event-txt">Temperature</div>' +
            '                                <input class="col-lg-1 event-input" type="text" />' +
            '                                <div class="col-lg-1 event-txt">Humidity</div>' +
            '                                <input class="col-lg-1 event-input" type="text" />' +
            '                                <div class="col-lg-1 event-txt">Battery</div>' +
            '                                <input class="col-lg-1 event-input" type="text" />' +
            '' +
            '' +
            '                            </div>' +
            '' +
            '                            <h4>Sensors</h4>' +
            '' +
            '                            <button class="btn btn-default btn-sensors" type="button"><i class="fa fa-plus"></i> Add Sensor</button>' +
            '' +
            '                            <br> <br>' +
            '' +
            '                            <hr>' +
            '                        </div>';

        $(this).before(event);


    });


});
//end of documnet.ready



function getLastSync() {
    var deviceId = $('#deviceId').val();

    //TODO: set ouauth authoriztion for the request with userid as well 

    $.ajax({
        url: config_apiserver + 'api/device/' + deviceId + '/getLastSync',
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            console.log(response);
            var currentDate = new Date();
            var date = new Date(response + "Z");

            var d = currentDate - date;

            $('#syncTime').html(Math.floor(d / 1000) + " secs ago");
            syncTime = Math.floor(d / 1000);
            $('#deviceId').next().hide();

        },
        error: function (response) {
            console.error('could not get last sync time');
        }
    });

}