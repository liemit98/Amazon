const patternEmail = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9-])+(\.[a-zA-Z0-9]{2,4})+$/;
const patternUsername = /^([\w\d]){1,50}$/;
const patternInput = /^[^'()?$%<>]{1,50}$/;
const patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/
const patternContent = /^([\w\s\d#$^+=!*()@%&-.,;:"]){1,255}$/;
const patternNumber = /^[\d-,.]{1,50}$/;

function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.trim(); 
    return str;
  }

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
   if(username.value.length > 50){
    window.alert("Username không được quá 50 ký tự"); 
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
   if(mail.value.length > 50){
    window.alert("Username không được quá 50 ký tự"); 
    mail.focus(); 
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
   if(username.value.length > 50){
    window.alert("Username không được quá 50 ký tự"); 
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