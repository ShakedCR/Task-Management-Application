const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middlewares
app.use(cors());
app.use(express.json());

// Schemas
const listSchema = new mongoose.Schema({
  name: String,
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  status: String,
  listId: mongoose.Schema.Types.ObjectId,
});

const List = mongoose.model('List', listSchema);
const Task = mongoose.model('Task', taskSchema);

// Routes

// Test route
app.get('/', (req, res) => {
  res.send('Server is working!');
});

// Lists
app.post('/lists', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const newList = new List({ name });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    console.error('Failed to create list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/lists', async (req, res) => {
  const lists = await List.find();
  res.json(lists);
});

app.delete('/lists/:id', async (req, res) => {
  const { id } = req.params;
  await List.findByIdAndDelete(id);
  await Task.deleteMany({ listId: id });
  res.status(204).end();
});

// Tasks
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, date, listId } = req.body;
    if (!title || !listId) return res.status(400).json({ error: 'Title and listId are required' });

    const newTask = new Task({
      title,
      description: description || "",
      date: date || null,
      status: "To Do",
      listId: new mongoose.Types.ObjectId(listId)
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Failed to create task:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/tasks/:listId', async (req, res) => {
  const { listId } = req.params;
  const tasks = await Task.find({ listId });
  res.json(tasks);
});

app.put('/tasks/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.status = status;
    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Failed to update status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.title = title;
    task.description = description;
    task.date = date;
    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Failed to update task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.status(204).end();
});

// Server listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
