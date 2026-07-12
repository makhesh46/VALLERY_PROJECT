import express from 'express';
import { supabase } from '../utils/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { sendNotification } from '../utils/notifications.js';

const router = express.Router();

// Create request (public)
router.post('/', async (req, res) => {
  try {
    const { customerName, address, email, phoneNumber, productId, message } = req.body;

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) return res.status(404).json({ message: 'Product not found' });

    const { data: request, error: requestError } = await supabase
      .from('requests')
      .insert([{
        customer_name: customerName,
        customer_email: email,
        customer_phone: phoneNumber,
        product_id: productId,
        message,
        status: 'pending'
      }])
      .select()
      .single();

    if (requestError) throw requestError;

    // Fetch settings to get admin contact info
    const { data: settings } = await supabase.from('settings').select('*').limit(1).single();
    const adminEmail = settings?.admin_email || process.env.EMAIL_USER || 'admin@example.com';
    const adminPhone = settings?.admin_phone || undefined;
    const formspreeKey = settings?.formspree_key || undefined;

    // Send notifications asynchronously
    sendNotification({
      customerName,
      productName: product.title,
      phoneNumber,
      address,
      email,
      message,
    }, adminEmail, formspreeKey, adminPhone);

    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all requests (admin)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { data: requests, error } = await supabase
      .from('requests')
      .select('*, product:products(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedRequests = requests.map(r => ({
      ...r,
      customerName: r.customer_name,
      phoneNumber: r.customer_phone,
      email: r.customer_email,
      createdAt: r.created_at,
      _id: r.id,
      product: r.product ? {
        ...r.product,
        name: r.product.title,
        _id: r.product.id
      } : null
    }));

    res.json(formattedRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update request status
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { data: request, error } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !request) return res.status(404).json({ message: 'Request not found' });
    
    res.json({
      ...request,
      _id: request.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
