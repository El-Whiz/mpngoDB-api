require('dotenv').config();

const express = require('express');
const cors = require('cors');
const logRequest = require("./middlewares/logger.js");
const validateTodo = require("./middlewares/validator.js");
const validatePatch = require("./middlewares/validate-patch.js");
const errorHandler = require("./middlewares/error-handler.js");
const connectDB = require("./database/db.js");
const Todo = require("./models/todo.model.js");
const app = express();
app.use(express.json());

const corsOptions = {
    origin: 'https://localhost:3000',
    // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(logRequest);

connectDB();

app.get('/', (req, res) => res.send('Welcome!'));

// app.get('/todos', async (req, res) =>{
//     const todos = await Todo.find({});
//     res.status(200).json(todos);
// });

app.get('/todos/completed', async (req, res, next) =>{
    try{
        const completed = await Todo.find({completed: true})
        res.status(200).json(completed);
    }
    catch (error){
        next(error);
    }
});

app.get('/todos', async (req, res, next) => {
  try {
    const { completed } = req.query;

    const filter = completed === undefined ? {} : { completed: completed === 'true' };

    const todos = await Todo.find(filter);
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
});

app.get('/todos/:id', async (req, res, next) =>{
    try{
        const todo = await Todo.findById(req.params.id);

        if(!todo) return res.status(404).json({message: 'Todonot found/Invalid ID'});
        res.status(200).json(todo);
    }
    catch(error){
        next(error);
    }
});

app.post('/todos', validateTodo, async (req, res, next) =>{
    try {
        const {task, completed} = req.body;
        const newTodo = new Todo({
            task,
            completed
        });

        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        next(error);
    }
});

app.patch('/todos/:id', validatePatch, async (req, res, next) =>{
    try{
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        if(!todo) return res.status(404).json({message: 'Todonot found/Invalid ID'});
        res.status(200).json(todo);
    }
    catch (error){
        next(error);
    }
});

app.delete('/todos/:id', async (req, res, next) =>{
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id)

        if(!todo) return res.status(404).json({message: 'Todonot found/Invalid ID'});
        res.status(200).json({message: `Todo ${req.params.id} deleted`})
    } catch (error) {
        next(error);
    }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`APP is listening on ${PORT}`);
});