const Joi = require("@hapi/joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [{ id: 1, name: "Course1" }, { id: 2, name: "Course2" }, { id: 3, name: "Course3" }];

app.get("/", (req, res) => {
    res.send("Hello World!!!");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("The course with the given ID was not found.");
    res.send(course.name);
});

app.post("/api/courses", (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
    //Look up course
    //If not existing return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("The course with the given ID was not found.");

    //Validate
    //If invalid, return 400 - Bad request
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Update course
    course.name = req.body.name;
    //Return update course
    res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
    //Look up course
    //If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("The course with the given ID was not found.");

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //Return same course
    res.send(course);
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required()
    });

    return schema.validate(course);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
