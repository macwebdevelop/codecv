// See the JQuery documentation at ... 
// http://api.jquery.com/
// http://learn.jquery.com/
// See my JQuery and Ajax notes 

function register(){
	$.ajax({ 
		method: "POST", 
		url: "/api/register/",
		data: {
			userName: $("#user_register").val(),
			userPassword: $("#password_register").val(),
			userEmail: $("#email_register").val()
		}
	}).done(function(data){
		console.log("Got back:"+JSON.stringify(data));
		if("error" in data){
			console.log(data["error"]);
			window.alert(data["error"]);
		}
		else {
			console.log("User Registered: "+JSON.stringify(data));
			$("#ui_register").hide();
			$("#ui_login").show();
		}
	});
}

function login(){
	$.ajax({
		method: "POST",
		url: "/api/login/",
		data: {
			loginName: $("#user_login").val(),
			loginPassword: $("#password_login").val(),
		}
	}).done(function(data){
		console.log("Got back: "+JSON.stringify(data));
		if("error" in data){
			console.log(data["error"]); 
			window.alert(data["error"]);
		}
		else {
			$("#ui_login").hide();
			$("#ui_game").show();
		}
	});
}

function update(){
	$.ajax({
		method: "PATCH",
		url: "api/update/",
		data: {
			updateName: $("#user_update").val(),
			oldPassword: $('#old_password').val(),
			updatePassword: $("#password_update").val(),
		}
	}).done(function(data){
		console.log("Got back: "+JSON.stringify(data));
		if("error" in data){
			console.log(data["error"]); 
			window.alert(data["error"]);
		} else {
			$("#ui_update").hide();
			$("#ui_login").show();
		}
	});
}

// This is executed when the document is ready (the DOM for this document is loaded)
$(function(){
	// Setup all events here and display the appropriate UI
	$("#loginSubmit").on('click',function(){login(); $("#InvalidCredentials").show();});
	$("#registerSubmit").on('click',function(){register(); $("#InvalidCredentials1").show();});
	$("#updateSubmit").on('click', function(){update(); $("#InvalidCredentials2").show();});
	$("#ui_login").show();
	$("#ui_game").hide();
	$("#InvalidCredentials").hide();
});
