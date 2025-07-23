require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();

const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const mongoUri = process.env.MONGO_URI;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables. Exiting.');
  process.exit(1);
}

// Carrega o Swagger para a UI
const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve o arquivo puro YAML
app.get('/swagger.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, './docs/swagger.yaml'));
});

// Configure CORS - ajuste as origens conforme sua necessidade
const allowedOrigins = ['http://localhost:3000', 'http://seusite.com'];
app.use(cors({
  origin: function(origin, callback) {
    // permite requests sem origin (como curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: Origin ${origin} not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

// Conecta ao MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => {
    console.error('Erro MongoDB:', err);
    process.exit(1);
  });

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

// Middleware para validar e retornar erros do express-validator
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }
  next();
}

// Rota para cadastro de usuário
app.post('/register',
  body('username').isString().isLength({ min: 3 }).trim(),
  body('password').isString().isLength({ min: 6 }),
  validateRequest,
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ error: 'Username already exists' });

      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ username, passwordHash });
      await user.save();

      res.status(201).json({ message: 'User created' });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

// Rota de login
app.post('/login',
  body('username').isString().trim(),
  body('password').isString(),
  validateRequest,
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const passwordOk = await bcrypt.compare(password, user.passwordHash);
      if (!passwordOk) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      res.json({ token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

// CRUD de Itens
app.get('/items', authMiddleware, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error('GET /items error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.get('/items/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('GET /items/:id error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.post('/items', authMiddleware,
  body('name').isString().isLength({ min: 1 }).trim(),
  body('description').optional().isString(),
  validateRequest,
  async (req, res) => {
    try {
      const { name, description } = req.body;

      const newItem = new Item({ name, description });
      await newItem.save();
      res.status(201).json(newItem);
    } catch (err) {
      console.error('POST /items error:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

app.put('/items/:id', authMiddleware,
  body('name').optional().isString().isLength({ min: 1 }).trim(),
  body('description').optional().isString(),
  validateRequest,
  async (req, res) => {
    try {
      const { name, description } = req.body;
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Item not found' });

      if (name !== undefined) item.name = name;
      if (description !== undefined) item.description = description;

      await item.save();
      res.json(item);
    } catch (err) {
      console.error('PUT /items/:id error:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

app.delete('/items/:id', authMiddleware, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('DELETE /items/:id error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    status: 'API online',
    message: 'Bem-vindo à API de autenticação e gerenciamento de itens',
    endpoints: ['/register', '/login', '/items']
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado: http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
  console.log(`Swagger YAML: http://localhost:${port}/swagger.yaml`);
});