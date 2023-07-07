const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];

const url =
    "mongodb+srv://test:1234@cluster0.9pfjlke.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 3) {
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(person);
        });
        mongoose.connection.close();
    });
    return;
}

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
});

person.save().then((result) => {
    console.log(result, "saved");
    mongoose.connection.close();
});
