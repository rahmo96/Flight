// backend/controllers/usersController.js
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }
    
    // Store password directly (no encryption as requested)
    const user = await User.create({
      username,
      email,
      password_hash: password, // No encryption
      first_name,
      last_name,
      created_at: new Date()
    });
    
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle duplicate username/email errors
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Username or email already in use' });
    }
    
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Simple password check (no encryption)
    if (password !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    await user.update({ last_login: new Date() });
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};
