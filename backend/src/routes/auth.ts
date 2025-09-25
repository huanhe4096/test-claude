import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock user storage (in production, this would be a proper database)
const users: { [key: string]: { id: string; email: string; password: string; } } = {};

// JWT secret (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register endpoint
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user already exists
      if (users[email]) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // For Docker demo - simple password storage (use bcrypt in production)
      const hashedPassword = password;

      // Create user
      const userId = Date.now().toString();
      users[email] = {
        id: userId,
        email,
        password: hashedPassword
      };

      // Generate JWT token
      const token = jwt.sign(
        { userId, email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: { id: userId, email }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Login endpoint
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists(),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = users[email];
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password (simple comparison for Docker demo)
      if (password !== user.password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Password reset endpoint (mock implementation)
router.post('/reset-password',
  [
    body('email').isEmail().normalizeEmail(),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      // Check if user exists
      if (!users[email]) {
        // For security, we don't reveal if the email exists or not
        return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      }

      // In a real application, you would:
      // 1. Generate a secure reset token
      // 2. Store it in the database with an expiration time
      // 3. Send an email with the reset link

      console.log(`Password reset requested for: ${email}`);

      res.json({
        message: 'If an account with that email exists, a password reset link has been sent.',
        // For demo purposes, we'll include a mock reset token
        resetToken: 'mock-reset-token-123'
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Middleware to verify JWT token
export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    (req as any).user = user;
    next();
  });
};

export default router;