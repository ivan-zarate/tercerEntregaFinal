const twilio=require("twilio");

//credenciales
const accountId="ACffc303506b8d78abe13e084daa7bd1d4";
const accountToken="b7beeb845ff3525a6221d75660d75bc1";

const twilioClient=twilio(accountId, accountToken);

const twilioWapp="whatsapp:+14155238886";
const adminWapp="whatsapp:+5491169351659";


module.exports = {twilioWapp, adminWapp, twilioClient};  