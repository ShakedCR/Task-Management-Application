const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // טוען את קובץ הסביבה או משתני סביבה של דוקר

const app = express();

// התחברות ל-MongoDB דרך משתנה סביבה
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middlewares
app.use(cors());
app.use(express.json());

// סכמות (Schemas)
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

// בדיקה בסיסית
app.get('/', (req, res) => {
  res.send('Server is working!');
});

// יצירת רשימה
app.post('/lists', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const newList = new List({ name });
  await newList.save();
  res.status(201).json(newList);
});

// שליפת כל הרשימות
app.get('/lists', async (req, res) => {
  const lists = await List.find();
  res.json(lists);
});

// מחיקת רשימה + כל המשימות שלה
app.delete('/lists/:id', async (req, res) => {
  const id = req.params.id;
  await List.findByIdAndDelete(id);
  await Task.deleteMany({ listId: id });
  res.status(204).end();
});

// יצירת משימה
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

// שליפת משימות לפי רשימה
app.get('/tasks/:listId', async (req, res) => {
  const listId = req.params.listId;
  const tasks = await Task.find({ listId });
  res.json(tasks);
});

// שינוי סטטוס
app.put('/tasks/:id/status', async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  const task = await Task.findById(taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  task.status = status;
  await task.save();
  res.json(task);
});

// עריכת משימה
app.put('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const { title, description, date } = req.body;

  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.title = title;
  task.description = description;
  task.date = date;
  await task.save();
  res.json(task);
});

// מחיקת משימה
app.delete('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  await Task.findByIdAndDelete(id);
  res.status(204).end();
});

// הרצת השרת
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
