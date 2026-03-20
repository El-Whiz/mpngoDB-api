require('dotenv').config();

const express = require('express');
const cors = require('cors');
const logRequest = require("./middlewares/logger.js");
const validateTodo = require("./middlewares/validator.js");
const validatePatch = require("./middlewares/validate-patch.js");
const errorHandler = require("./middlewares/error-handler.js");
const app = express();
app.use(express.json());

const corsOptions = {
    origin: 'https://localhost:3000',
    // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(logRequest);

let todos = [
    {id: 1, task: 'Learn Node.js', completed: false},
    {id: 2, task: 'Build CRUD API', completed: false},
    {id: 2, task: 'Debug', completed: true},
    {id: 2, task: 'Deploy', completed: false},
    {id: 2, task: 'Cry', completed: true}
];

app.get('/', (req, res) => res.send('Welcome!'));

app.get('/todos', (req, res) =>{
    res.status(200).json(todos);
});

app.get('/todos/completed', (req, res, next) =>{
    try{
        const expected = todos.filter((t) => t.completed);
        res.status(200).json(expected);
    }
    catch (error){
        next(error);
    }
});

app.get('/todos/active', (req, res, next) =>{
    try{
        const todos_ = todos.filter((t) => !t.completed)
        res.status(200).json(todos_);
    }
    catch (error){
        next(error);
    }
});

app.get('/todos/:id', (req, res, next) =>{
    try{
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            throw new Error("Invalid ID");
        }
        const todo = todos.find((t) => t.id === id);
        if(!todo) return res.status(404).json({message: 'Invalid ID'});
        res.status(200).json(todo);
    }
    catch(error){
        next(error);
    }
});

app.post('/todos', validateTodo, (req, res, next) =>{
    try {
        const {task} = req.body;
        if(!task || task.length <= 2){
           return res.status(400).json({message: 'Please provide the task'});
        }
        const newTodo = {id: todos.length + 1, ...req.body};
        todos.push(newTodo);
        res.status(201).json(newTodo);
    } catch (error) {
        next(error);
    }
});

app.patch('/todos/:id', validatePatch, (req, res, next) =>{
    try{
        const todo = todos.find((t) => t.id === parseInt(req.params.id));
        if(!todo) return res.status(404).json({message: 'Todo not found'});
        Object.assign(todo, req.body);
        res.status(200).json(todo);
    }
    catch (error){
        next(error);
    }
});

app.delete('/todos/:id', (req, res, next) =>{
    try {
        const id = parseInt(req.params.id);
        const initialLength = todos.length;
        todos = todos.filter((t) => t.id !== id);
        if(todos.length === initialLength)
            return res.status(404).json({error: `Not found`});
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`APP is listening on ${PORT}`);
});