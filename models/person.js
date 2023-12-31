const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URL;

console.log("connecting to", url);

mongoose
    .connect(url)
    .then(() => {
        console.log("connected to", url);
    })
    .catch((error) => {
        console.log("error connecting to MangoDB:", error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        validate: function (v) {
            return /^\d{2,3}-\d{6,}$/.test(v);
        },
    },
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
