const patternEmail = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9-])+(\.[a-zA-Z0-9]{2,4})+$/;
const patternUsername = /^([\w\d])+$/;
const patternInput = /^[^'()?$%<>]+$/;
const patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/
const patternContent = /^([\w\s\d#$^+=!*()@%&-.,;:"])+$/;
const patternNumber = /^[\d-,.]+$/;

function validateSignUp()                                    
{ 
    var username = document.getElementById("username-signup")            
    var mail = document.getElementById("mail-signup")
    var password = document.getElementById("password-signup")
	var password1 = document.getElementById("password-signup-repeat")
    if(username.value == ""){
        window.alert("Username không được để trống"); 
        username.focus(); 
        return false; 
   }
    if(!username.value.match(patternUsername)){
        window.alert("Nhập sai định dạng Username - Chỉ cho phép nhập chữ và số"); 
        username.focus(); 
        return false; 
    }
    if(mail.value == ""){
        window.alert("Mail không được để trống"); 
        password.focus(); 
        return false; 
   }
    if (!mail.value.match(patternEmail))                 
    { 
        window.alert("Nhập sai định dạng mail"); 
        mail.focus(); 
        return false; 
    } 
   if(password.value == ""){
        window.alert("Password không được để trống"); 
        password.focus(); 
        return false; 
   }
   
    if (!password.value.match(patternPassword))                        
    { 
        window.alert("Nhập sai định dạng Password"); 
        password.focus(); 
        return false; 
    } 

	if (password.value != password1.value)                        
    { 
        window.alert("Nhập lại Password sai"); 
        password.focus(); 
        return false; 
    } 
    return true; 
}

function validateLogin(){
    var username = document.getElementById("username-login");
    var password = document.getElementById("password-login");
    if(username.value == ""){
        window.alert("Username không được để trống"); 
        username.focus(); 
        return false; 
   }
    if(!username.value.match(patternUsername)){
        window.alert("Nhập sai định dạng Username - Chỉ cho phép nhập chữ và số"); 
        username.focus(); 
        return false; 
    }
    if(password.value == ""){
        window.alert("Password không được để trống"); 
        password.focus(); 
        return false; 
   }
   
    if (!password.value.match(patternPassword))                        
    { 
        window.alert("Nhập sai định dạng Password"); 
        password.focus(); 
        return false; 
    } 
    return true;
}