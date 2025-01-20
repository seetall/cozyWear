const axios = require('axios')

const sendOtp = async (phone, otp) => {

    // setting state for api hit
    let isSent = false;     // let is used instead of const as it changing variable

    // API eEndpoint of managepoint.co // Url to send otp
    const url = 'https://api.managepoint.co/api/sms/send'

    // payload to send as in managepoint api-documentation
    const payload = {
        'apiKey': '104d1d74-062a-48f7-9590-c6782d5b7377',
        'to': phone,
        'message': `Your verification code for Ramro Market is ${otp}`
    }

    // npm install axios code run in terminal to add pacakges in backend


    try {
        const res = await axios.post(url, payload)
        // if (res.staus === 200) {
        isSent = true;


    } catch (error) {
        console.log('Error Sending OTP', error.message)
    }
    return isSent;

}

module.exports = sendOtp;