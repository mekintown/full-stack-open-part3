require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(express.json());

app.use(express.static("build"));

morgan.token("custom", function (req, res) {
    return JSON.stringify(req.body);
});
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :custom"
    )
);

app.use(cors());

app.get("/api/persons", (request, response) => {
    Person.find({}).then((people) => {
        response.json(people);
    });
});

app.get("/info", (request, response) => {
    Person.find({}).then((people) => {
        response.send(`
        <div>
            <p>Phonebook has info for ${people.length} people</p>
            <p>${new Date()}</p>
        </div>`);
    });
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    Person.findById(request.params.id)
        .then((note) => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => {
            console.log(error);
            response.status(400).send({ error: "malformatted id" });
        });
});

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "content missing",
        });
    }
    // if (Person.find((currentPerson) => currentPerson.name === person.name)) {
    //     return response.status(400).json({
    //         error: "name must be unique",
    //     });
    // }
    const person = new Person({
        name: body.name,
        number: Number(body.number),
    });

    person.save().then((savedPerson) => {
        response.json(savedPerson);
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
