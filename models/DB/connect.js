const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(console.log("connected to database"))
        .catch(err => console.log(err));
}

module.exports = connectDB;