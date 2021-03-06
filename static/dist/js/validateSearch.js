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

function validateSearch(){
    var txtfind = document.getElementById("txtfind");
    if(txtfind.value.length > 50){
        window.alert("Nhập quá số lượng ký tự quy định"); 
        txtfind.focus(); 
        return false; 
    }
    if(!txtfind.value.match(patternInput)){
        window.alert("Nhập không đúng định dạng"); 
        txtfind.focus(); 
        return false; 
    }
    return true
}