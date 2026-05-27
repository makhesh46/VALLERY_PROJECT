import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../utils/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
    res.json({ token, admin: { username: admin.username, name: admin.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authenticateAdmin, async (req: any, res) => {
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, username, name, created_at')
      .eq('id', req.adminId)
      .single();

    if (error || !admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
