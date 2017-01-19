var codeIsSet = false;

$(document).ready(function () {

    var code = getParameterByName('code');
    console.log(code);
    $(".lazy").lazyload({
        effect: "fadeIn"
    });


    if (code != "") {

        loadEmail(code);

    }

 
    $.validator.addMethod("ValidEmailCheck", function (value, element) {
        var op = false;
        console.log(op);
        $.ajax({
            url: config_apiserver + 'api/users/byemail/' + value,
            type: 'GET',
            async: false,
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.log(data.length);
                if (data.length == 0) {

                    op = true;
                    console.log(op);
                }

            },
            error: function (jqXHR, exception) {

                console.log("error");

            }
        });
        console.log(op);
        return op;
    }, 'This email is already registered.');



   

    $("#frm_register").validate({

        focusInvalid: false,
        ignore: "",
        rules: {
            reg_email: {
                minlength: 2,
                required: true,
                email: true,
                ValidEmailCheck: true
            },
            reg_name: {
                minlength: 2,
                required: true,
            },
              reg_first_name: {
                minlength: 2,
                required: true,
            },
              reg_last_name: {
                minlength: 2,
                required: true,
            },
            reg_username: {
                minlength: 2,
                required: true,
            },
            reg_password: {
                minlength: 2,
                required: true,
            },
            reg_confirm_password: {
                minlength: 2,
                required: true,
                equalTo: "#reg_password"
            }
        },

        invalidHandler: function (event, validator) {
            //display error alert on form submit    
        },

        errorPlacement: function (label, element) { // render error placement for each input type   
            $('<span class="error"></span>').insertAfter(element).append(label)
            var parent = $(element).parent('.input');
            parent.removeClass('success-control').addClass('error-control');
        },

        highlight: function (element) { // hightlight error inputs

        },

        unhighlight: function (element) { // revert the change done by hightlight

        },

        success: function (label, element) {
            var parent = $(element).parent('.input');
            parent.removeClass('error-control');
        },
        submitHandler: function (form) {
            $("#btn_submit").attr("disabled", true);
            if (code.length < 1)
                postUser();
            else
                transferUser();
            //form.submit();
        }
    });



});

function postUser() {
    $("#btn_submit, .btn").attr("disabled", true);
    var email = $("#reg_email").val();
    var first_name = $("#reg_first_name").val();
    var last_name = $("#reg_last_name").val();
    var password = $("#reg_password").val();
    var token = "";
    var userid = "";
    // Generate the token 
    //var tRequesut = { username: email, password: password, client_id: clientid, grant_type: "password" };
          
    //var loginData = { username : email, password : CryptoJS.MD5(password).toString().toUpperCase() };
            
    //$.ajax({
    //    type: "POST",
    //    url: config_apiserver + "token",
    //    data: tRequesut,
    //    contentType: "application/x-www-form-urlencoded",
    //    dataType: "json",
    //    aysnc:false,

    //    success: function (data) {

    //var RxUser = {
    //    RxUserId: userid,
    //    Email: inputEmail.val(),
    //    FirstName: inputFirstName.val(),
    //    LastName: inputLastName.val()
    //};
    //$.ajax({
    //    url: config_apiserver + 'api/users/' + userid + '/personalinfo',
    //    type: 'PUT',
    //    data: JSON.stringify(RxUser),
    //    dataType: "json",





            

    jQuery.support.cors = true;
    var rxuser = {
        FirstName: first_name,
        LastName: last_name,
        HashedPassword: CryptoJS.MD5(password).toString().toUpperCase(),
        Email: email,
        Token : token
    };
    
    $.ajax({
        url: config_apiserver + 'api/users/createaccount',
        type: 'POST',
        data: JSON.stringify(rxuser),
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            console.log(jQuery.type(data));
            userid = data.RxUserId;
            console.log("User Id : ", userid);
          
            var tRequesut = { username: email, password: password, client_id: userid, grant_type: "password" };
            $.ajax({
                type: "POST",
                url: config_apiserver + "tokenYear",
                data: tRequesut, 
                contentType: "application/x-www-form-urlencoded",
                dataType: "json",
                aysnc:false,
                success: function (response) {
                    console.log("Token Sign Up Success");
                    token = response.token_type + " " + response.access_token;
                    console.log(token, "token");
                    rxuser.Token = token;
                    console.log(rxuser, " RxUser");
                    //== Save the token of the user in the RxUser table
                    $.ajax({
                        url: config_apiserver + 'api/users/' + userid + '/addToken',
                        type: 'PUT',
                        data: rxuser,
                        dataType: "json",
                        aysnc:false,
                        success: function (result) {
                            var cookieContentApi = { logged: true, 'doesExpire': true, 'blurred': false, 'SavedToken': token };
                            $.cookie("user", cookieContentApi, { expires: 3650 });
                            console.log("User Token is saved with response : ", result);                         
                        },
                        error: function (jqXHR, exception) {

                            console.log("Error when adding the token to the user");

                        }
                    });






                },
                error: function (jqXHR, exception) {

                    console.log("Error when getting the Token");

                }
            });





            //FIXME: Display Message
            // window.location.replace("login.aspx?uid=" + data.RxUserId + "&fullname=" + data.FirstName + " "+data.LastName);
            $("#divSignup").hide();
            $("#divSignupComplete").show();

        },
        error: function (jqXHR, exception) {
            $("#btn_submit, .btn").attr("disabled", false);
            $("#divSignup").hide();
            $("#divSignupError").show();
            console.log(jqXHR);
            console.log(exception);
        }
    });
}

function emailExists(email) {
    if (deviceid.length < 1) {
        $('#lblDeviceIdError').show();
        $('#lblDeviceIdError').text('Device ID is not valid.');
        $("#divDeviceId").addClass("error-control");
    }
    $.ajax({
        url: config_apiserver + 'api/device/bykey/' + deviceid,
        contentType: "application/json;charset=utf-8",
        async: true,
        success: function (data) {


            if (!data.used) {
                $('#lblDeviceIdError').hide();
                $("#divDeviceId").removeClass("error-control");
                console.log('true, data: ' + data);
            } else {
                $('#lblDeviceIdError').show();
                $('#lblDeviceIdError').text('Device ID is not valid.');
                $("#divDeviceId").addClass("error-control");
            }
        },
        error: function (x, y, z) {
            $('#lblDeviceIdError').show();
            $('#lblDeviceIdError').text('Device ID is not valid.');
            $("#divDeviceId").addClass("error-control");
        }
    });
}

function transferUser() {
    var email = $("#reg_email").val();
    var first_name = $("#reg_first_name").val();
    var last_name = $("#reg_last_name").val();
    var password = $("#reg_password").val();
    var type = "3";
    var user_status = "Active";
    jQuery.support.cors = true;
    var rxuser = {
        FirstName: first_name,
        LastName: last_name,
        UserStatus: user_status,
        HashedPassword: CryptoJS.MD5(password).toString().toUpperCase(),
        UserTypeId: type,
        Email: email
    };
    console.log(JSON.stringify(rxuser));


    $.ajax({
        url: config_apiserver + 'api/users/reg-transfer/' + getParameterByName('code'),
        type: 'POST',
        data: JSON.stringify(rxuser),
        contentType: "application/json;charset=utf-8",
        success: function (data) {

            var loginDetails = {
                username: email,
                password: CryptoJS.MD5(password).toString().toUpperCase(),
                guid: null
            };

            
            $.ajax({
                type: "POST",
                url: config_apiserver + "api/users/authenticate",
                data: JSON.stringify(loginDetails),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {

                    console.log(response);
                    var clientid = response[0].RxUserId;
                    var tRequesut = {
                        username: email,
                        password: password,
                        client_id: clientid,
                        grant_type: "password"
                    };
                    $.ajax({
                        type: "POST",
                        url: config_apiserver + "token",
                        data: tRequesut,
                        contentType: "application/x-www-form-urlencoded",
                        dataType: "json",
                        aysnc: false,

                        success: function (data) {
                            console.log(data);
                            token = data.token_type + " " + data.access_token;
                            console.log(token, "token");


                            var cookieContents = {
                                logged: true,
                                'fullname': response[0].FirstName + " " + response[0].LastName,
                                'userid': response[0].RxUserId,
                                'doesExpire': true,
                                'blurred': false,
                                'token': token
                            };

                            $.cookie.json = true;

                            $.cookie("user", cookieContents, {
                                expires: 1
                            });

                            console.log($.cookie("user"), "cookie");

                            //$(":text, :password, #login_toggle, .btn").attr("disabled", false);


                            window.location = "patients";
                        }




                    });



                }
            });

        }

        ,
        error: function (x, y, z) {
            $("#btn_submit, .btn").attr("disabled", false);
            console.log('x:' + x + '; y: ' + y + '; z: ' + z);
        }

    });
}



function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function switchTabs() {
    var v = getParameterByName("t");
    if (v == 2)
        $('#tab-01 a[href="#prescriptions"]').tab('show')
    else if (v == 1)
        $('#tab-01 a[href="#privacy"]').tab('show')
    else
        $('#tab-01 a[href="#accountinfo"]').tab('show')
}


function loadEmail(code) {
    var url = config_apiserver + "api/invitation/" + code;
    console.log(url);
    console.log("loadEmail");
    $.ajax({
        url: url,
        type: 'GET',
        data: '',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != null) {
                codeIsSet = true;
                console.log(codeIsSet);
                $("#reg_email").val(data.InvitationEmail);
                $("#reg_email").attr("disabled", true);
            }
        },
        error: function () {
            console.log(codeIsSet);
            code = null;
        }
    });


}