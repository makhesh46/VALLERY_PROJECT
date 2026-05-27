import express from 'express';
import { supabase } from '../utils/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = express.Router();

const parseImageUrls = (imageUrlStr: string): string[] => {
  if (!imageUrlStr) return [];
  if (imageUrlStr.startsWith('[')) {
    try {
      const parsed = JSON.parse(imageUrlStr);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // fallback
    }
  }
  if (imageUrlStr.includes(',')) {
    return imageUrlStr.split(',').map((s: string) => s.trim()).filter(Boolean);
  }
  return [imageUrlStr];
};

const formatProduct = (p: any) => {
  const imageUrls = parseImageUrls(p.image_url);
  return {
    ...p,
    isPublished: p.is_published,
    imageUrls,
    imageUrl: imageUrls[0] || '', // first image for backward compatibility
    _id: p.id // Keep _id for frontend compatibility
  };
};

// Get all published products (public)
router.get('/', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    res.json((products || []).map(formatProduct));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products (admin)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json((products || []).map(formatProduct));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !product) return res.status(404).json({ message: 'Product not found' });
    
    res.json(formatProduct(product));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product
router.post('/', authenticateAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const { name, price, description, isPublished, category } = req.body;
    const files = (req.files as any[]) || [];
    const imageUrls: string[] = [];

    if (files.length > 0) {
      for (const file of files) {
        const url = await uploadToCloudinary(file.buffer);
        imageUrls.push(url);
      }
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        title: name,
        price: Number(price),
        description,
        image_url: JSON.stringify(imageUrls),
        is_published: isPublished === 'true',
        category: category || 'General'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(formatProduct(product));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/:id', authenticateAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const { name, price, description, isPublished, category, existingImages } = req.body;
    const files = (req.files as any[]) || [];
    const newImageUrls: string[] = [];

    if (files.length > 0) {
      for (const file of files) {
        const url = await uploadToCloudinary(file.buffer);
        newImageUrls.push(url);
      }
    }

    // Parse existing images that were kept
    let finalImageUrls: string[] = [];
    if (existingImages) {
      try {
        const parsed = JSON.parse(existingImages);
        if (Array.isArray(parsed)) {
          finalImageUrls = parsed;
        }
      } catch (e) {
        if (typeof existingImages === 'string') {
          finalImageUrls = existingImages.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }
    }

    // Merge kept existing images with new uploaded images
    finalImageUrls = [...finalImageUrls, ...newImageUrls];

    const updateData: any = { 
      title: name, 
      price: Number(price), 
      description, 
      is_published: isPublished === 'true',
      category: category || 'General',
      image_url: JSON.stringify(finalImageUrls)
    };

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !product) return res.status(404).json({ message: 'Product not found' });
    
    res.json(formatProduct(product));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
