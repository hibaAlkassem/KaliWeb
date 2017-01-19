
$(document).ready(function () {
    
    var code = getParameterByName('code');


	$(".lazy").lazyload({
      effect : "fadeIn"
	});
	$.validator.addMethod("ValidEmailCheck", function (value, element) {
	    var op = false;
	    $.ajax({
	        url: config_apiserver + 'api/users/byemail/'+value,
	        type: 'GET',
	        async: ture,
	        crossDomain: true,
	        contentType: "application/json;charset=utf-8",
	        success: function (data) {
	            console.log(data.length);
	            if (data.length == 0) { 
	                op =  true;
	            }
	             
	        },
	        error: function (jqXHR, exception) {
	            console.log("error");
	            
	        }
	    }); 
	    console.log(op);
	    return op;
	}, 'This email is already registered..');


	$("#frm_register").validate({

                focusInvalid: false, 
                ignore: "",
                rules: {
                    reg_email: {
                        minlength: 2,
                        required: true,
                        email: true,
                        ValidEmailCheck:true
                    },
                    reg_name: {
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

                    if (code.length < 1)
                        postUser();
                    else
                        transferUser();
						//form.submit();
				}
	});



});

function postUser()
{
    var email = $("#reg_email").val();
    var first_name = $("#reg_first_name").val();
    var last_name = $("#reg_last_name").val();
    var password = $("#reg_password").val();
    var type = "3";

    jQuery.support.cors = true;
    var rxuser = {
        FirstName: first_name,
        LastName: last_name,
        HashedPassword: password,
        UserTypeId: type,
        Email: email
    };

    $.ajax({
        url: config_apiserver + 'api/rxusers/',
        type: 'POST',
        data: JSON.stringify(rxuser),
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            console.log(jQuery.type(data));
            //FIXME: Display Message
            // window.location.replace("login.aspx?uid=" + data.RxUserId + "&fullname=" + data.FirstName + " "+data.LastName);
            $("#divSignup").hide();
            $("#divSignupComplete").show();

        },
        error: function (jqXHR, exception) {
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
        $('#lblDeviceIdError').text('DeviceId is not valid.');
        $("#divDeviceId").addClass("error-control");
    }
    $.ajax({
        url: config_apiserver + 'api/device/bykey/' + deviceid,
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (data) {


            if (!data.used) {
                $('#lblDeviceIdError').hide();
                $("#divDeviceId").removeClass("error-control");
                console.log('true, data: ' + data);
            }
            else {
                $('#lblDeviceIdError').show();
                $('#lblDeviceIdError').text('Device ID is not valid.');
                $("#divDeviceId").addClass("error-control");
            }
        },
        error: function (x, y, z) {
            $('#lblDeviceIdError').show();
            $('#lblDeviceIdError').text('DeviceId is not valid.');
            $("#divDeviceId").addClass("error-control");
        }
    });
}

function transferUser()
{
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
        HashedPassword: password,
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
            window.location.replace("login.aspx");
        },
        error: function (x, y, z) {
            console.log('x:' + x + '; y: ' + y + '; z: ' + z );
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
