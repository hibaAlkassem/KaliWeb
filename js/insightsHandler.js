var queryMid = queryString["mid"];
var queryUid = queryString["uid"];
var queryLastId = queryString["lastid"];
console.log(queryMid);
console.log(queryUid)
   //console.log(queryMid);
var leastid;
var source;
var firstCall = true;
var myInsightsArray = [];
var lastid = 0;
var listcount = 25;
$(document).ready(function() {
   $("div.insight_toolbar").html('<a visible="true" id="ButtonExport1" class="btn btn-white download_margin datatable_buttons">Download <i class="fa fa-cloud-download icon-margin"></i></a>' + '<a class="btn btn-white tip datatable_buttons play" data-toggle="tooltip" title="" data-original-title="Click to resume real time stream" id="play" name="Play"  href="#"> Play <i class="fa fa-play icon-margin"></i></a>');
   $(".select2-wrapper").select2({
      minimumResultsForSearch: -1
   });
   loadPatients();
   var userid = myval;
   var url = config_apiserver + 'api/users/' + userid + '/newinsights?listcount=25';
   var monid = $('#selectUser').val();
   if (typeof queryUid !== 'undefined')
      if (queryUid > 0) {
         if (typeof queryLastId !== 'undefined') url = config_apiserver + "/api/users/" + queryUid + "/newinsights?listcount=" + listcount + "&lastid=" + queryLastId;
         else url = config_apiserver + "/api/users/" + queryUid + "/newinsights?listcount=" + listcount;
      }
   if (typeof queryMid !== 'undefined')
      if (queryMid > 0) {
         if (typeof queryLastId !== 'undefined') url = config_apiserver + "/api/users/" + myval + "/newinsights?listcount=" + listcount + "&mid=" + queryMid + "&lastid=" + queryLastId;
         else url = config_apiserver + "/api/users/" + myval + "/newinsights?listcount=" + listcount + "&mid=" + queryMid;
      }
   $.ajax({
      url: url,
      type: "GET",
      contentType: "application/json;charset=utf-8",
      async: false,
      success: function(data) {
         //console.log(data);
         displayNewData(data);
      },
      error: function() {
         alert(url);
         $('#insightsData').append('<br/><div class="well-lg" id="noData" style="background-color:#F0F0F0;">No data available in table<br/></div>');
      }
   });
   //init all listeners
   initListeners();
       $("#insightsData .row").live('click', function() {
           var clicked = ($(this).find("i").attr("class")).toString();
           if (clicked == "fa fa-plus-circle") {
               $(this).find(".bolden").css("font-weight", "Bold");
               $(this).find("i").removeClass('fa fa-plus-circle');
               $(this).find("i").addClass('fa fa-minus-circle');
               $(this).removeClass('listed');
               $(this).addClass('activeDiv');
               $(this).find(".moreInfo").fadeIn("slow");
           } else if (clicked == "fa fa-minus-circle") {
               $(this).removeClass('activeDiv');
               $(this).addClass('listed');
               $(this).find("i").removeClass('fa fa-minus-circle');
               $(this).find("i").addClass('fa fa-plus-circle');
               $(this).find(".moreInfo").fadeOut(200);
               $(this).find(".bolden").css("font-weight", "");
           }
       });
   $('#ButtonExport1').click(function() {
      processInsightsFile();
   });
   $('#play').click(function() {
      // console.log("click Play");
      var myClasses = this.classList;
      if (myClasses[4] == 'play') {
         paused = 0;
         $(this).html('Pause <i class="fa fa-pause icon-margin"></i>');
         $(this).removeClass("play");
         $(this).addClass('pause');
         $(this).attr('data-original-title', 'Click to hold real time stream')
         addArrayItems();
         $("[data-toggle='tooltip']").tooltip();
      } else {
         paused = 1;
         $(this).html('Play <i class="fa fa-play icon-margin"></i>');
         $(this).removeClass("pause");
         $(this).addClass('play');
         $(this).attr('data-original-title', 'Click to resume real time stream');
         //clearInterval(timerId);
         $("[data-toggle='tooltip']").tooltip();
      }
   });
   startListening();
});

function initListeners() {
   $('#selectUser').change(function() {
      changeData($('#selectUser').val());
   });
   $('#btnLoadMore').click(function() {
      getMoreData();
   });
}

function loadPatients() {
   //http://localhost:1119/api/users/1/patients
   var userid = $('#inputUserId').val();
   $.ajax({
      url: config_apiserver + 'api/users/' + userid + '/patients',
      contentType: "application/json;charset=utf-8",
      async: false,
      success: function(data) {
            displayPatients(data);
         }
         //failure:console.log('failed')
   });
}

function displayPatients(data) {
   $('#selectUser').empty();
   $('#selectUser').append($("<option></option>").attr("value", -1).text("All Users"));
   for (var i = 0; i < data.length; i++) {
      var patient = data[i];
      var name = patient.PatientName + " - " + patient.Medicine;
      $('#selectUser').append($("<option></option>").attr("value", patient.RxMonitorId).text(name));
   }
   if (queryMid != null) $('#selectUser').select2("val", queryMid);
}

function changeData(mid) {
   startListening();
   // console.log(mid);
   var userid = $('#inputUserId').val();
   //console.log(userid);
   var dataChangeUrl = config_apiserver + 'api/users/' + userid + '/newinsights?listcount=25';
   if (mid > 0) dataChangeUrl = config_apiserver + 'api/users/' + userid + '/newinsights?listcount=25' + '&mid=' + mid;
   $.ajax({
      url: dataChangeUrl,
      contentType: "application/json;charset=utf-8",
      async: false,
      success: function(data) {
         //console.log(data);
         $('#insightsData').empty();
         firstCall = true;
         displayNewData(data);
      }
   });
}

function getMoreData() {
   //console.log(myval);
   //  console.log(leastid);
   var userid = $('#inputUserId').val();
   var monid = $('#selectUser').val();
   var url = config_apiserver + 'api/users/' + myval + '/newinsights?listcount=25' + '&lastid=' + leastid;
   if (monid > 0) url = config_apiserver + 'api/users/' + myval + '/newinsights?listcount=25' + '&lastid=' + leastid + '&mid=' + monid;
   $.ajax({
      url: url,
      contentType: "application/json;charset=utf-8",
      async: false,
      success: function(data) {
         displayNewData(data);
      }
   });
}

function displayNewData(data) {
   console.log(data.length);
   if (data.length > 0) {
      var obj = data;
      for (var i = 0; i < obj.length; i++) {
         var activity = obj[i];
         var propability = (obj[i].Confidence * 100) + ' %';
         var name = obj[i].DeviceUserName;
         if (name == "Anonymous") name = name + " - ID: " + obj[i].AccountID;
         var dat = new Date(obj[i].TimeStamp);
         $("#insightsData").append('<div class="row listed " id="' + obj[i].InsightId + '" o " ></div>');
         $("#" + obj[i].InsightId).append('<div class="col-xs-1"><i class="fa fa-plus-circle"></i></div>');        
         $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden timeago tip" datatoggle="tooltip" data-original-title="sada"><abbr data-original-title="' + getDate(obj[i].TimeStamp) + '"  class="timeago tip" data-toggle="tooltip" title="">' + jQuery.timeago(obj[i].TimeStamp) + '</abbr></div>');
         $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden">' + name + '</div>');
         $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden">' + obj[i].Summary + '</div>');
         $("#" + obj[i].InsightId).append('');
         $("#" + obj[i].InsightId).append('<div class="moreInfo" id="' + i + obj[i].InsightId + '" style="display: none;"></div>');
         $("#" + i + obj[i].InsightId).append('<br><br><div class="col-xs-1"></div><div class="col-xs-1 "><b>Insight Rule</b></div>');
         $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + getFullMonth(dat.getMonth()) + ' ' + dat.getDate() + ', ' + dat.getFullYear() + "</div>" + '<div class="col-xs-1">' + getTimeString(dat) + '</div> ');
         $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + obj[i].Summary + " " + obj[i].RuleName + '</div> ');
         if (i == obj.length - 1) leastid = obj[i].InsightId;
         if (lastid < obj[i].InsightId) lastid = obj[i].InsightId;
      }
      $('#btnLoadMore').show();
      firstCall = false;
      if (data.length < 25) $('#btnLoadMore').hide();
   } else if (firstCall) {
      $('#insightsData').append('<br/><div class="well-lg" style="background-color:#F0F0F0;" id="noData">No data available in table<br/></div>');
   }
}

function addArrayItems() {
   console.log('array length: ' + myInsightsArray.length);
   console.log('array content: ' + myInsightsArray.toString());
   for (var j = 0; j < myInsightsArray.length; j = j + 1) {
      console.log('trying to add item ' + j);
      var obj = jQuery.parseJSON(myInsightsArray[j]);
      for (var i = 0; i < obj.length; i++) {
         var activity = obj[i];
         var propability = (obj[i].Confidence * 100) + ' %';
         var name = obj[i].DeviceUserName;
         if (name == "Anonymous") name = name + " - ID: " + obj[i].AccountID;
         var dat = new Date(obj[i].TimeStamp);
         console.log('item is: ' + obj[i].Summary);
         $("#insightsData").prepend('<div class="row listed " id="' + obj[i].InsightId + '" o " ></div>');
         $("#" + obj[i].InsightId).append('<div class="col-xs-1"><i class="fa fa-plus-circle"></i></div>');
         $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden">' + jQuery.timeago(obj[i].TimeStamp) + '</div>');
         $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden">' + name + '</div>');
         $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden">' + obj[i].Summary + '</div>');
         $("#" + obj[i].InsightId).append('');
         $("#" + obj[i].InsightId).append('<div class="moreInfo" id="' + i + obj[i].InsightId + '" style="display: none;"></div>');
         $("#" + i + obj[i].InsightId).append('<br><br><div class="col-xs-1"></div><div class="col-xs-1 "><b>Insight Rule</b></div>');
         $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + getFullMonth(dat.getMonth()) + ' ' + dat.getDate() + ', ' + dat.getFullYear() + "</div>" + '<div class="col-xs-1">' + getTimeString(dat) + '</div> ');
         $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + obj[i].Summary + " " + obj[i].RuleName + '</div> ');
         if (lastid < obj[i].InsightId) lastid = obj[i].InsightId;
      }
      jQuery("abbr.timeago").timeago();
      console.log('done adding row ' + i);
   }
   myInsightsArray.length = 0;
   myInsightsArray = [];
}

function startListening() {
   //    var userid = $('#inputUserId').val();
   //    if (oTable.fnGetData($('#example_table tbody tr:eq(0)')[0])[0])
   //        lastid = oTable.fnGetData($('#example_table tbody tr:eq(0)')[0])[0][5];
   //    else lastid = -1;
   var url = serversrc + '/GetInsights.aspx?id=' + myval + '&lastid=' + lastid + '&mid=' + $('#selectUser').val();
   console.log(url);
   if (source) {
      if (source.readyState == 0 || source.readyState == 1) source.close();
   } else $("#play").trigger("click");
   source = new EventSource(url);
   source.onopen = function(event) {
      console.log('Connection Opened with last id: ' + leastid);
   };
   source.onerror = function(event) {
      console.log('error: ' + event.data);
   };
   source.onmessage = function(e) {
      console.log(e.data);
      if (e.data == 'start') return;
      if (paused == 0) {
         console.log('data not paused, data will be added');
         var obj = jQuery.parseJSON(e.data);
         for (var i = 0; i < obj.length; i++) {
            var activity = obj[i];
            var propability = (obj[i].Confidence * 100) + ' %';
            var name = obj[i].DeviceUserName;
            if (name == "Anonymous") name = name + " - ID: " + obj[i].AccountID;
            var dat = new Date(obj[i].TimeStamp);
            $("#insightsData").prepend('<div class="row listed " id="' + obj[i].InsightId + '" o " ></div>');
            $("#" + obj[i].InsightId).append('<div class="col-xs-1"><i class="fa fa-plus-circle"></i></div>');
            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden">' + jQuery.timeago(obj[i].TimeStamp) + '</div>');
            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden">' + name + '</div>');
            $("#" + obj[i].InsightId).append('<div class="col-xs-2 bolden">' + obj[i].Summary + '</div>');
            $("#" + obj[i].InsightId).append('');
            $("#" + obj[i].InsightId).append('<div class="moreInfo" id="' + i + obj[i].InsightId + '" style="display: none;"></div>');
            $("#" + i + obj[i].InsightId).append('<br><br><div class="col-xs-1"></div><div class="col-xs-1 "><b>Insight Rule</b></div>');
            $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + getFullMonth(dat.getMonth()) + ' ' + dat.getDate() + ', ' + dat.getFullYear() + "</div>" + '<div class="col-xs-1">' + getTimeString(dat) + '</div> ');
            $("#" + i + obj[i].InsightId).append('<div class="col-xs-2">' + obj[i].Summary + " " + obj[i].RuleName + '</div> ');
            console.log('added row, new id: ' + obj[i].InsightId + ', last id: ' + lastid);
            if (lastid < obj[i].InsightId) lastid = obj[i].InsightId;
         }
         jQuery("abbr.timeago").timeago();
      } else {
         console.log('data paused nothing added');
         showErrorMessage('New insights available, press Play to show them');
         myInsightsArray.push(e.data);
      }
   }
}
