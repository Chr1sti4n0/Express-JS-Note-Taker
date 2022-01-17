const express = require('express');
const fs = require('fs');
const path = require('path');

//npm uuid package
const uuid = require('uuid');
const app = express();

//Middleware
app.use(express.json())

app.use(express.static(path.join(__dirname, 'Develop', 'public')))

//HTML route that will return notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public','notes.html'))
})

//API route that will navigate to and read db.json file and return the saved notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    })
})

//API route that will take the new note and add it to the db.json file
app.post('/api/notes', (req, res) => {
    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const notes = (JSON.parse(data));
            const newNote = req.body;
            
            //generates a random id to allow for the items to be saved and selected
            newNote.id = uuid.v4();
            notes.push(newNote);

            //saves to db.json file
            fs.writeFile('./Develop/db/db.json', JSON.stringify(notes), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(req.body);
                } 
            })  
        }
    })
})

//Wildcard: HTML route that will return index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'))
})

//Server will start on PORT 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));