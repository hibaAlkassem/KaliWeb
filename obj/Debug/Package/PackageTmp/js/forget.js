
$(document).ready(function () {
    
    var code = getParameterByName('code');


	$(".lazy").lazyload({
      effect : "fadeIn"
	});
	 
	$.validator.addMethod("ValidEmailCheck", function (value, element) {
	    var op = true;
	    $.ajax({
	        url: config_apiserver + 'api/users/byemail/' + value,
	        type: 'GET',
	        async: true,
	        crossDomain: true,
	        contentType: "application/json;charset=utf-8",
	        success: function (data) {
	            console.log(data.length);
	            if (data.length == 0) {
	                op = false;
	            }

	        },
	        error: function (jqXHR, exception) {
	            console.log("error");

	        }
	    });
	    console.log(op);
	    return op;
	}, 'This email is not registered..');


	$("#frm_register").validate({

                focusInvalid: false, 
                ignore: "",
                rules: {
                    reg_email: {
                        minlength: 2,
                        required: true,
                        email: true,
                        ValidEmailCheck:true
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
                    postForget()
				}
	});



});

function postForget()
{
    var email = $("#reg_email").val();
  
    $("#btn_submit, .btn").attr("disabled", true);
    jQuery.support.cors = true;
    
    $.ajax({
        url: config_apiserver + 'api/users/'+email+'/forget-password',
        type: 'POST', 
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            $("#btn_submit, .btn").attr("disabled", false);
            console.log(jQuery.type(data));
            //FIXME: Display Message
            // window.location.replace("login.aspx?uid=" + data.RxUserId + "&fullname=" + data.FirstName + " "+data.LastName);
            $("#divForget").hide();
            $("#divForgetComplete").show();

        },
        error: function (jqXHR, exception) {
            $("#btn_submit, .btn").attr("disabled", false);
            $("#divForget").hide();
            $("#divForgetCompleteError").show();
            console.log(jqXHR);
            console.log(exception);
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
