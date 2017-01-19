$.cookie.json = true;
var cookieIsSet = $.cookie('user');
//console.log(cookieIsSet);
if (cookieIsSet == null || !$.cookie('user').logged) window.location = "login";
var cookieExpire = $.cookie('user').doesExpire;
var sidebarContents = "";
var myval = $.cookie('user').userid;
var token = $.cookie('user').token;

//var savedToken = $.cookie('apiUser').SavedToken;
var userType;
var minutes = 60;
var timer;
cookieChecker();
var timezonetest = [];

ajaxSetup();
//get sidebar list items
getUserPermissions();
getSidebarItems();
//console.log(token,"token",myval,"myval",$.cookie('user'),"cookie");
console.info(token);

var pageName = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

var pages = ["apitool", "importeddata", "kalidrop", "kalicloudapi", "device-activities", "research", "research-details", "badrequests", "apitool.html", "importeddata.html", "kalidrop.html", "kalicloudapi.html", "device-activities.html", "research.html", "research-details.html", "badrequests.html"];

var pageIndex = pages.indexOf(pageName);


if (pages.indexOf(pageName) > -1) {
    ajaxSetup();
    authorizeUser(pages[pageIndex]);
}

if (cookieExpire) {


    $(document).focus(function () {
        var checkCookie = $.cookie('user');
        if (checkCookie == null)
            window.location = "login";

        $.cookie.json = true;
        cookieChecker();

        var cookieContents = {
            logged: true,
            'fullname': $.cookie('user').fullname,
            'userid': $.cookie('user').userid,
            'doesExpire': $.cookie('user').doesExpire,
            'blurred': false,
            'token': token
        };

        $.cookie("user", cookieContents, {
            expires: 1
        });

        stopCookieTimeOut();
        //console.log("focus");
    });

    $(document).blur(function () {
        $.cookie.json = true;
        cookieChecker();

        var blurredCookieContents = {
            logged: true,
            'fullname': $.cookie('user').fullname,
            'userid': $.cookie('user').userid,
            'doesExpire': $.cookie('user').doesExpire,
            'blurred': true,
            'token': token
        };
        //console.log("blurred");


        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        $.cookie("user", blurredCookieContents, {
            expires: date
        });
        startCookieTimeOut();

    });


    $(document).unload(function () {
        $.cookie.json = true;

        if (!$.cookie("user").blurred) {
            var date = new Date();
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            $.cookie("user", cookieContents, {
                expires: date
            });
        }
    });

}



function getSidebarItems() {
    $.ajax({
        type: "GET",
        url: config_apiserver + "/api/usertype/" + userType + "/pages",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            for (var page in response) {
                var noActivePage = true;
                if (response[page].ShowInMenu) {
                    if (location.pathname.substring(location.pathname.lastIndexOf("/") + 1) == "" && response[page].PageName == "patients") sidebarContents += "<li class='active'><a href='" + response[page].PageName.toLowerCase() + "'><i class='" + response[page].MenuIcon + "'></i><span class='title'>" + response[page].MenuName + "</span></a></li>";
                    else if (location.pathname.substring(location.pathname.lastIndexOf("/") + 1) == response[page].PageName) sidebarContents += "<li class='active'><a href='" + response[page].PageName.toLowerCase() + "'><i class='" + response[page].MenuIcon + "'></i><span class='title'>" + response[page].MenuName + "</span></a></li>";
                    else sidebarContents += "<li class=''><a href='" + response[page].PageName.toLowerCase() + "'><i class='" + response[page].MenuIcon + "'></i><span class='title'>" + response[page].MenuName + "</span></a></li>";
                }
            }
            sidebarContents += "<li class='' id='demoDrop'><a href='#'><i class='fa fa-eyedropper'></i><span class='title'>Demo Device</span></a></li>"
        },
        error: function (response) {},
        async: false
    });
}

function signout() {
    //console.log("removing cookie...")
    $.removeCookie('user');
    window.location = "login";
}

function getUserPermissions() {
    $.ajax({
        type: "GET",
        url: config_apiserver + '/api/users/' + myval,
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            userType = response[0].UserTypeId;
        },
        async: false
    });
}
//3600000
function startCookieTimeOut() {

    timer = setTimeout(function () {

        $.removeCookie('user');
        window.location = "login";

    }, (minutes * 60 * 1000) + 1000);
}

function stopCookieTimeOut() {

    clearTimeout(timer);
}

function cookieChecker() {
    $.cookie.json = true;
    if ($.cookie('user').fullname == null || $.cookie('user').userid == null || $.cookie('user').doesExpire == null || $.cookie('user').token == null) {
        $.removeCookie('user');
        window.location = "login";
    }



}

var masterHead = '<meta charset="utf-8"/> <meta http-equiv="content-type" content="text/html;charset=UTF-8" />' + '   <meta charset="utf-8" />' + '   <title>Kali Care</title>' + '   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />' + '  <meta content="" name="description" />' + ' <meta content="" name="author" />' + '  <link href="assets/plugins/bootstrap-select2/select2.css" rel="stylesheet" type="text/css" media="screen" />' + '   <link href="assets/plugins/jquery-slider/css/jquery.sidr.light.css" rel="stylesheet" type="text/css" media="screen" />' + ' <link href="assets/plugins/jquery-datatable/css/jquery.dataTables.css" rel="stylesheet" type="text/css" />' + ' <link href="assets/plugins/boostrap-checkbox/css/bootstrap-checkbox.css" rel="stylesheet" type="text/css" media="screen" />' + '    <link href="assets/plugins/datatables-responsive/css/datatables.responsive.css" rel="stylesheet" type="text/css" media="screen" />' + ' <!-- END PLUGIN CSS -->' + '    <!-- BEGIN CORE CSS FRAMEWORK -->' + '  <link href="assets/plugins/boostrapv3/css/bootstrap.min.css" rel="stylesheet" type="text/css" />' + '   <link href="assets/plugins/boostrapv3/css/bootstrap-theme.min.css" rel="stylesheet" type="text/css" />' + ' <link href="assets/plugins/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" />' + '  <link href="assets/css/animate.min.css" rel="stylesheet" type="text/css" />' + '    <!-- END CORE CSS FRAMEWORK -->' + '    <!-- BEGIN CSS TEMPLATE -->' + '    <link href="assets/css/style.css" rel="stylesheet" type="text/css" />' + '  <link href="assets/css/responsive.css" rel="stylesheet" type="text/css" />' + ' <link href="assets/css/custom-icon-set.css" rel="stylesheet" type="text/css" /> <link href="assets/css/select2.min.css" rel="stylesheet" type="text/css"  /> ';
var masterBody = '<ng-include id="ngDemo" src="\'partials/demo-device.html\'" style="display:none"></ng-include> <form>' + '  <input type="hidden" value="" id="myval"/>' + '     <!-- BEGIN HEADER -->' + '      <div class="header navbar navbar-inverse ">' + '            <!-- BEGIN TOP NAVIGATION BAR -->' + '          <div class="navbar-inner">' + '             <div class="header-seperation" style="display:block;">' + '                 <ul class="nav pull-left notifcation-center" id="main-menu-toggle-wrapper" style="display:none; background-color:none;">' + '                   <li class="dropdown"> <a id="main-menu-toggle" href="#main-menu"  class="" >' + '                   <div class="iconset top-menu-toggle-dark"></div>' + '                   </a> </li>' + '                 </ul>' + '                  <!-- BEGIN LOGO -->' + '                <img src="assets/img/kali-logo.png" class="logo" alt=""  data-src="assets/img/kali-logo.png" data-src-retina="assets/img/kali-logo.png" width="auto" height="auto" style="margin-left:31px;margin-top:31px;"/>' + '                 <!-- END LOGO -->' + '              </div>' + '             <div class="pull-right" style="margin-top:15px;">' + '                  <div class="chat-toggler">    ' + '                     <div class="profile-pic"> ' + '                         <img src="assets/img/profile/1.png" runat="server" id="imgProfile" alt="" width="50" height="50"/> ' + '                    </div>                   ' + '                          <div class="user-details"> ' + '                            <div class="username">' + '                                 <div style="height:20px;">Welcome</div>' + '                                <strong>' + '                                       ' + $.cookie('user').fullname + '                                   </strong>' + '                              </div>                       ' + '                          </div> ' + '                </div>' + '                 <div class="chat-toggler" style="margin-top:25px;">    ' + '                    <a href="#http://" onclick="signout()" ><i class="fa fa-power-off"></i>&nbsp;&nbsp;Sign out</a>' + '                </div>' + '                 </div>' + '             <!-- END TOP NAVIGATION MENU -->' + '   </div>' + '         <!-- END TOP NAVIGATION BAR -->' + '        </div>' + '     <!-- END HEADER -->' + '<!-- BEGIN CONTAINER -->' + '       <div class="page-container row-fluid">' + '         <!-- BEGIN SIDEBAR -->' + '         <div class="page-sidebar" id="main-menu">' + '              <!-- BEGIN MINI-PROFILE -->' + '                <div class="page-sidebar-wrapper" id="main-menu-wrapper">' + '                  <!-- END MINI-PROFILE -->' + '                  <!-- BEGIN SIDEBAR MENU -->' + '                    <p class="menu-title">' + '                 </p>' + '                   <ul>' + sidebarContents + '                 </ul>' + '                  <div class="clearfix"></div>' + '                   <!-- END SIDEBAR MENU -->' + '              </div>' + '         </div>' + '         <!-- END SIDEBAR -->';
var beginPageContent = '            <!-- BEGIN PAGE CONTAINER-->' + '           <div class="page-content">' + '             <!-- BEGIN SAMPLE PORTLET CONFIGURATION MODAL FORM-->' + '              <div id="portlet-config" class="modal hide">' + '                   <div class="modal-header">' + '                     <button data-dismiss="modal" class="close" type="button"></button>' + '                     <h3>Widget Settings</h3>' + '                   </div>' + '                 <div class="modal-body">Widget settings form goes here </div>' + '              </div>' + '             <div class="clearfix"></div>' + '               <div class="content">';
var endPageContent = '              </div>' + '         </div>' + '     </div>' + '     <!-- END CONTAINER -->' + ' <form>';
var masterFooter = '<!-- BEGIN GENERAL JS-->' + '       <!-- END GENERAL JS-->' + '     <!-- BEGIN CORE JS FRAMEWORK-->' + '        <script src="assets/plugins/jquery-1.8.3.min.js" type="text/javascript"></script>' + '      <script src="assets/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>' + '     <script src="assets/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>' + '        <script src="assets/plugins/breakpoints.js" type="text/javascript"></script>' + '       <script src="assets/plugins/jquery-unveil/jquery.unveil.min.js" type="text/javascript"></script>' + '       <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore-min.js"></script>' + '     <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min.js"></script>' + '        <!-- END CORE JS FRAMEWORK -->' + '     <!-- BEGIN PAGE LEVEL JS -->' + '       <script src="assets/plugins/jquery-slider/jquery.sidr.min.js" type="text/javascript"></script>' + '     <script src="assets/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>' + '       <script src="assets/plugins/jquery-numberAnimate/jquery.animateNumbers.js" type="text/javascript"></script>' + '        <script src="assets/js/jquery.cookie.js" type="text/javascript"></script>' + '     <!-- END PAGE LEVEL PLUGINS -->' + '        <!-- BEGIN PAGE LEVEL JS -->' + '       <script src="assets/plugins/jquery-block-ui/jqueryblockui.js" type="text/javascript"></script>' + '     <script src="assets/plugins/jquery-slider/jquery.sidr.min.js" type="text/javascript"></script>' + '     <script src="assets/plugins/jquery-numberAnimate/jquery.animateNumbers.js" type="text/javascript"></script>' + '        <script src="assets/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>' + '       <script src="assets/plugins/bootstrap-select2/select2.min.js" type="text/javascript"></script>' + '     <script src="assets/plugins/jquery-datatable/js/jquery.dataTables.js" type="text/javascript"></script>' + '     <script src="assets/plugins/jquery-datatable/extra/js/dataTables.tableTools.min.js" type="text/javascript"></script>' + '       <script type="text/javascript" src="assets/plugins/datatables-responsive/js/datatables.responsive.js"></script>' + '        <script type="text/javascript" src="assets/plugins/datatables-responsive/js/lodash.min.js"></script> <script src="assets/js/select2.full.min.js" type="text/javascript"></script>' + '       <!-- END PAGE LEVEL PLUGINS -->' + '        <script type="text/javascript" src="assets/js/jquery.timeago.js"></script>' + '     <script type="text/javascript" src="assets/js/date_functions.js"></script>' + '     <script src="assets/js/fnReloadAjax.js"></script>' + '      <!-- BEGIN CORE TEMPLATE JS -->' + '        <script src="assets/js/core.js" type="text/javascript"></script>' + '       <script src="assets/js/chat.js" type="text/javascript"></script>' + '       <script src="assets/js/demo.js" type="text/javascript"></script>' + '       <!-- END CORE TEMPLATE JS -->';
//console.log("master.js loaded!");




function ajaxSetup() {
    $.ajaxSetup({
        beforeSend: function (xhr) {
           xhr.setRequestHeader('Authorization', token);


        }
    });


}

function authorizeUser(pageName) {

    $.ajax({
        type: "POST",
        url: config_apiserver + '/api/users/' + myval + '/authorizeUser?pageName=' + pageName,
        contentType: "application/json; charset=utf-8",
        success: function (response) {

        },
        error: function () {

            window.location = "404";

        },
        async: false



    });

}


$(document).ready(function () {

    //$('.select-2').select2({minimumResultsForSearch: Infinity});

});
