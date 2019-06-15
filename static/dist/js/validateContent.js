const patternContent = /^([\w\s\d#$^+=!*()@%&-.,;:"])+$/;
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
    var comment = document.getElementById("comment");               
    if (comment.value == "" )                                  
    { 
        window.alert("Không được bỏ trống"); 
        comment.focus(); 
        return false; 
    } 

	if (!change_alias(comment.value).match(patternContent) )                                  
    { 
        window.alert("Nhập không đúng mặc định"); 
        comment.focus(); 
        return false; 
    } 
       
    return true; 
}