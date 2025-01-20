// imports
const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./database/database')
const acceptFormData = require('express-fileupload')
const path = require('path');
const cors = require('cors');




// creating express app
const app= express();

// Configure Cors Policy
const CorsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(CorsOptions))

// dotenv configuration
dotenv.config()

connectDatabase()
app.use(acceptFormData())
app.use(express.json())

// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));





const PORT= process.env.PORT;

app.get('/test', (req, res) => {
    res.send("Test API is working!...")
})

app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/product', require('./routes/productRoutes'))

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}!`) // making dynamic using `` instead of "" // stop by Ctrl+C
    
})


module.exports= connectDatabase();
module.exports = app