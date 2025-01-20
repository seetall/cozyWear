
const jwt = require('jsonwebtoken')

const authGuard = (req, res, next) => {

    // check incoming data
    console.log(req.headers);


    // 1. get authrisation data from headers
    const authHeader = req.headers.authorization;

    // 2. check or validate
    if (!authHeader) {
        return res.status(400).json({
            success: false,
            message: "Auth Header not found!"
        })
    }
    // 3. split the data in format: bearer token-sdfg .. take only token

    const token = authHeader.split(' ')[1]; // index 0 is bearer and index 1 is token

    // 4. if token  not found - stop the process / end response
    if (!token || token === '') {
        return res.status(400).json({
            success: false,
            message: "Token not found!"
        })
    }

    // 5. if token found - verify token

    try {
        const decodeUserData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodeUserData
        next()
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Not Authenticated"
        })
    }
}
// 6. if token verified - next(function in the route/controller)
// 7. if token not verified - stop the process / end response

// -----------------
// Admin Guard

// check incoming data
const adminGuard = (req, res, next) => {
    console.log(req.headers);


    // 1. get authrisation data from headers
    const authHeader = req.headers.authorization;

    // 2. check or validate
    if (!authHeader) {
        return res.status(400).json({
            success: false,
            message: "Auth Header not found!"
        })
    }
    // 3. split the data in format: bearer token-sdfg .. take only token

    const token = authHeader.split(' ')[1]; // index 0 is bearer and index 1 is token

    // 4. if token  not found - stop the process / end response
    if (!token || token === '') {
        return res.status(400).json({
            success: false,
            message: "Token not found!"
        })
    }

    // 5. if token found - verify token

    try {
        const decodeUserData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodeUserData;   // id, isAdmin

        if (!req.user.isAdmin) {
            return res.status(400).json({
                success: false,
                message: " Permission Denied!"
            })
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Not Authenticated"
        })
    }
}

module.exports = {
    authGuard,
    adminGuard
}