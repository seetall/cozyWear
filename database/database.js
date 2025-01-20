const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_LOCAL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Database Connected!");
    }).catch((error) => {
        console.error("Database Connection Failed:", error.message);
        process.exit(1); // Exit process with failure
    });
};



module.exports = connectDatabase;
