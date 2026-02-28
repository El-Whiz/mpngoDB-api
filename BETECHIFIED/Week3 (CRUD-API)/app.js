require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());

let todos = [
    {id: 1, task: 'Learn Node.js', completed: false},
    {id: 2, task: 'Build CRUD API', completed: false},
    {id: 2, task: 'Debug', completed: true},
    {id: 2, task: 'Deploy', completed: false},
    {id: 2, task: 'Cry', completed: true}
]

app.get('/todos', (req, res) =>{
    res.status(200).json(todos);
});

app.get('/todos/completed', (req, res) =>{
    const expected = todos.filter((t) => t.completed);
    res.status(200).json(expected);
});

app.get('/todos/active', (req, res) =>{
    const todos_ = todos.filter((t) => !t.completed)
    res.status(200).json(todos_);
});

app.get('/todos/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    const todo = todos.find((t) => t.id === id);
    if(!todo) return res.status(404).json({message: 'Invalid ID'});
    res.status(200).json(todo);
});

app.post('/todos', (req, res) =>{
    if(req.body.task === undefined || req.body.completed === undefined) return res.status(400).json({message: 'Add all fields'});
    const newTodo = {id: todos.length + 1, ...req.body};
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.patch('/todos/:id', (req, res) =>{
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if(!todo) return res.status(404).json({message: 'Todo not found'});
    Object.assign(todo, req.body);
    res.status(200).json(todo);
});

app.delete('/todos/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter((t) => t.id !== id);
    if(todos.length === initialLength)
        return res.status(404).json({error: `Not found`});
    res.status(204).send();
});

app.use((err, req, res, next) =>{
    res.status(500).json({error: "Server error!"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`APP is listening on ${PORT}`);
});