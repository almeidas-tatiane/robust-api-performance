require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const mongoUri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Conecta ao MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro MongoDB:', err));

// Modelos
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String
});
const User = mongoose.model('User', userSchema);

const itemSchema = new mongoose.Schema({
  name: String,
  description: String
});
const Item = mongoose.model('Item', itemSchema);

// Middleware de autenticação JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
}

// Rota para cadastro de usuário
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash });
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// CRUD de Itens
app.get('/items', authMiddleware, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/items/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/items', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const newItem = new Item({ name, description });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/items/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/items/:id', authMiddleware, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(204).send(); // sucesso, mas sem corpo
  } catch (err) {
    console.error('Erro ao deletar item:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Endpoint batch completo
app.post('/batch', authMiddleware, async (req, res) => {
  const { operations } = req.body;
  if (!Array.isArray(operations)) {
    return res.status(400).json({ error: 'Operations must be an array' });
  }

  const results = [];

  for (const op of operations) {
    try {
      const method = op.method?.toUpperCase();
      const path = op.path;
      const body = op.body || {};

      // GET /items
      if (method === 'GET' && path === '/items') {
        const items = await Item.find();
        results.push({ status: 200, body: items });

      // GET /items/:id
      } else if (method === 'GET' && path.startsWith('/items/')) {
        const match = path.match(/^\/items\/([^/]+)$/);
        const id = match ? match[1] : null;

        if (!id) {
          results.push({ status: 400, body: 'Invalid path format' });
          continue;
         }

  const item = await Item.findById(id);
  results.push(item ? { status: 200, body: item } : { status: 404, body: 'Item not found' });

      // POST /items
      } else if (method === 'POST' && path === '/items') {
        if (!body.name) {
          results.push({ status: 400, body: 'Missing name' });
          continue;
        }
        const newItem = new Item({ name: body.name, description: body.description });
        await newItem.save();
        results.push({ status: 201, body: newItem });

      // PUT /items/:id
      } else if (method === 'PUT' && path.startsWith('/items/')) {
        const id = path.split('/')[2];
        const item = await Item.findById(id);
        if (!item) {
          results.push({ status: 404, body: 'Item not found' });
          continue;
        }
        if (body.name) item.name = body.name;
        if (body.description) item.description = body.description;
        await item.save();
        results.push({ status: 200, body: item });

      // DELETE /items/:id
      } else if (method === 'DELETE' && path.startsWith('/items/')) {
        const id = path.split('/')[2];
        const result = await Item.findByIdAndDelete(id);
        if (!result) {
          results.push({ status: 404, body: 'Item not found' });
          continue;
        }
        results.push({ status: 204 });

      // Unknown method/path
      } else {
        results.push({ status: 400, body: 'Unsupported method or path' });
      }
    } catch (err) {
      results.push({ status: 500, body: 'Server error' });
    }
  }

  res.json(results);
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    status: 'API online',
    message: 'Bem-vindo à API de autenticação e gerenciamento de itens',
    endpoints: ['/register', '/login', '/items', '/batch']
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
