const patternEmail = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9-])+(\.[a-zA-Z0-9]{2,4})+$/;
const patternUsername = /^([\w\d]){1,50}$/;
const patternInput = /^[^'()?$%<>]{1,50}$/;
const patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/
const patternContent = /^([\w\s\d#$^+=!*()@%&-.,;:"]){1,255}$/;
const patternNumber = /^[\d-,.]{1,50}$/;
module.exports = {
    patternEmail,
    patternUsername,
    patternPassword,
    patternContent,
    patternNumber,
    patternInput
}