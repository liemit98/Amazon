const patternEmail = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9-])+(\.[a-zA-Z0-9]{2,4})+$/;
const patternUsername = /^\w\d+$/;
const patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/
const patternContent = /^([\w\s\d#$^+=!*()@%&-.,;:"])+$/;
const patternNumber = /^[\d-,.]+$/;
module.exports = {
    patternEmail,
    patternUsername,
    patternPassword,
    patternContent,
    patternNumber
}