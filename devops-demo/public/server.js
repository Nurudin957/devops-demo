const express = require('express')
const app = express()
const path = require('path')


var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '8f2ecdc2efe94f86b0e0d066909b9ff9',
  captureUncaught: true,
  captureUnhandledRejections: true,
})


rollbar.log('Hello world!')

app.use(express.json())

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    rollbar.info("Students was requested", students)
    res.status(200).send(students)
})


    app.post("/api/students", (req, res) => {
        let { name } = req.body;
    
        const index = students.findIndex((student) => {
            return student === name;
        });
    
        try {
            if (index === -1 && name !== "") {
                students.push(name);
    
                rollbar.info("A new student was created", name)
    
                res.status(200).send(students);
            } else if (name === "") {
                rollbar.error("A student was posted without a name")
    
                res.status(400).send("You must enter a name.");
            } else {
                rollbar.critical("A student that already exists was posted", name)
    
                res.status(400).send("That student already exists.");
            }
        } catch (err) {
            console.log(err);
        }
    });
    
    