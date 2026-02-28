const express = require('express');
const { error } = require('node:console');
const app = express();
app.use(express.json());

app.use((req, res, next) =>{
    console.log(`Action: ${req.method}\nPath: ${req.url}\nDate: ${new Date()}`);
    next();
});

app.get('/', (req, res) => res.send('My Week2 API'));

app.post('/user', (req, res) => {
    const {name, email} = req.body;
    if(!name || !email){
        return res.status(400).json({
            error: `Missing fields`
        });
    }

    res.status(201).json({
        message: `Hello, ${name}!`
    });
});

app.get('/user/:id', (req, res) =>{
    res.json({
        id: req.params.id,
        name: `User ${id} profile`
    })
});

app.listen(3000, () => console.log('API live on port 3000'));