const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsPath));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const listSchema = new mongoose.Schema({
  name: String,
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  status: String,
  listId: mongoose.Schema.Types.ObjectId,
  filePath: String,
});

const List = mongoose.model('List', listSchema);
const Task = mongoose.model('Task', taskSchema);

app.get('/', (req, res) => {
  res.send('Server is working!');
});

app.post('/lists', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const newList = new List({ name });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
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

app.post('/tasks', upload.single('file'), async (req, res) => {
  try {
    const { title, description, date, listId } = req.body;
    if (!title || !listId) return res.status(400).json({ error: 'Title and listId are required' });

    const newTask = new Task({
      title,
      description: description || '',
      date: date || null,
      status: 'To Do',
      listId: new mongoose.Types.ObjectId(listId),
      filePath: req.file ? req.file.filename : null,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/tasks/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.title = title;
    task.description = description;
    task.date = date;

    if (req.file) {
      if (task.filePath) {
        const oldPath = path.join(uploadsPath, task.filePath);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      task.filePath = req.file.filename;
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (task.filePath) {
    const filePath = path.join(uploadsPath, task.filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await Task.findByIdAndDelete(id);
  res.status(204).end();
});

app.delete('/tasks/:id/file', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.filePath) {
      const filePath = path.join(uploadsPath, task.filePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      task.filePath = null;
      await task.save();
    }

    res.status(200).json({ message: 'File deleted' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
