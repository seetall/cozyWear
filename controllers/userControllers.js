
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const sendOtp = require('../service/sendOtp');

const createUser = async (req, res) => {

    //1. Check incoming data
    console.log(req.body);

    //2. Destructure  the incoming data
    const { fName, lName, email, number, password, confirmpassword  } = req.body; 

    //3. Validate the data (check email and password is received/)

    if (!fName || !lName || !email || !number || !password || !confirmpassword ) {
        
        res.json({
            "success": false,
            "message": "Please enter all fields!" 
        })

    }
    if(password !== confirmpassword){
        console.log('Validation failed: Password do not match');
        return res.json({
            success: false,
            message: "Password doesn't match!"
        })
    }

    //4. ERROR Handling ( TRY,CATCH)
    try {
        
        const existingUser = await userModel.findOne({ email: email })
    
        if (existingUser) {
            return res.json({
                "success": false,
                "message": "User Already Exists!"
            })
        }
        const randomSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, randomSalt)
        const newUser = new userModel({
            fName: fName, 
            lName: lName,
            email: email,
            number: number,
            // password: password
            password: hashedPassword
            
        })

        // save to the database
        await newUser.save()
        // send the response
        res.json({
            "success": true,
            "message": "User created Successfully!"
        })


    } catch (error) {
        console.log(error)
        return res.json({
            "success": false,
            "message": "Internal Server Error!"
        })

    }




}


// // USER LOGIN

const loginUser = async (req, res) => {

    console.log(req.body)

    // Destructuring
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
        return res.json({
            "success": false,
            "message": " Please enter all fields!"
        })
    }

    // Try catch
    try {


        // Find user (email)
        const user = await userModel.findOne({ email: email })

        // email not found (error message)
        if (!user) {
            return res.json({
                "success": false,
                "message": " User doesn't exist!"
            })
        }

        const isValidPassword = await bcrypt.compare(password, user.password)


        // password not valid (error)
        if (!isValidPassword) {
            return res.json({
                "success": false,
                "message": " {Password is wrong}!"
            })
        }
        const token = await jwt.sign(
            { id: user._id, isAdmin: user.isAdmin }, // token id, mongo db id
            process.env.JWT_SECRET
        )

        res.json({
            "success": true,
            "message": "User Login Successful",
            "token": token,
            "userData": user
        })

    } catch (error) {
        console.log(error)
        return res.json({
            "success": false,
            "message": "Internal Server Error!"
        })
    }
}


const forgotPassword = async (req, res) => {

    const { number } = req.body;
    if (!number) {
        return res.status(400).json({
            success: false,
            message: "Please Provide your Phone Number!"
        })
    }
    try {

        //finding user 
        const user = await userModel.findOne({ number: number })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!"
            })
        }

        //generating random 6 digit otp
        const otp = Math.floor(100000 + Math.random() * 900000);

        //generating expiry time for otp
        const expiryDate = Date.now() + 360000;

        //save to database for verification
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = expiryDate;
        await user.save();


        //send to registered phone number
        const isSent = await sendOtp(number, otp);
        console.log(isSent)
        if (!isSent) {
            return res.status(400).json({
                success: false,
                message: "Error sending OTP code!"
            })
        }

        //if success
        res.status(200).json({
            success: true,
            message: "OTP sent successfully!"
        })



    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server Error!"
        })

    }
}

//Verify Otp and set new Password
const verifyOtpAndSetPassword = async (req, res) => {
   

    // get data
    const { number, otp, newPassword } = req.body;
    if (!number || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Please provide all fields!"
        })
    }
    try {
        const user = await userModel.findOne({ number: number })

        // Verify otp
        if (user.resetPasswordOTP != otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP!"
            })
        }
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired!"
            })
        }

        // Update password // hash the new password
        const randomSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, randomSalt)

        // save to database
        user.password = hashedPassword;
        await user.save();

        // send success response
        res.status(200).json({
            success: true,
            message: "OTP Verified and Password updated successfully!"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server Error!"
        })
    }

}





module.exports = {
    createUser,
    loginUser,
    forgotPassword,
    verifyOtpAndSetPassword
}