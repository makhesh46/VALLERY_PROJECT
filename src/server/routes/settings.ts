import express from 'express';
import { supabase } from '../utils/supabase.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = express.Router();

// Get settings (public)
router.get('/', async (req, res) => {
  try {
    let { data: settings, error } = await supabase.from('settings').select('*').limit(1).single();
    
    if (error || !settings) {
      // Return default if none found
      settings = {
        website_title: 'Metal Art & Product Design',
        admin_email: 'avrevlab@gmail.com',
        admin_phone: '8807972934',
        atelier_address: 'Kanniyakumari\nTamil Nadu\nIndia',
        instagram_username: '@vallery_studio.lab',
        formspree_key: ''
      };
    }
    
    res.json({
      websiteTitle: settings.website_title,
      adminEmail: settings.admin_email,
      adminPhone: settings.admin_phone,
      logoUrl: settings.logo_url,
      heroSubtitle: settings.hero_subtitle || 'Bespoke Metal Craft',
      heroTitle: settings.hero_title || 'Where Metal Meets Mastery',
      heroButton: settings.hero_button || 'Explore Collection',
      atelierAddress: settings.atelier_address || 'Kanniyakumari\nTamil Nadu\nIndia',
      instagramUsername: settings.instagram_username || '@vallery_studio.lab',
      formspreeKey: settings.formspree_key || ''
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings (admin)
router.put('/', authenticateAdmin, upload.single('logo'), async (req: any, res) => {
  try {
    const { websiteTitle, adminEmail, adminPhone, adminName, heroSubtitle, heroTitle, heroButton, atelierAddress, instagramUsername, formspreeKey } = req.body;
    
    let { data: settings } = await supabase.from('settings').select('*').limit(1).single();
    
    const updateData: any = {};
    if (websiteTitle) updateData.website_title = websiteTitle;
    if (adminEmail) updateData.admin_email = adminEmail;
    if (adminPhone) updateData.admin_phone = adminPhone;
    if (heroSubtitle !== undefined) updateData.hero_subtitle = heroSubtitle;
    if (heroTitle !== undefined) updateData.hero_title = heroTitle;
    if (heroButton !== undefined) updateData.hero_button = heroButton;
    if (atelierAddress !== undefined) updateData.atelier_address = atelierAddress;
    if (instagramUsername !== undefined) updateData.instagram_username = instagramUsername;
    if (formspreeKey !== undefined) updateData.formspree_key = formspreeKey;

    if (req.file) {
      updateData.logo_url = await uploadToCloudinary(req.file.buffer);
    }

    let updateError;
    try {
      if (!settings) {
        // Insert
        const { data: newSettings, error: err } = await supabase.from('settings').insert([updateData]).select().single();
        if (err) throw err;
        settings = newSettings;
      } else {
        // Update
        const { data: updatedSettings, error: err } = await supabase.from('settings').update(updateData).eq('id', settings.id).select().single();
        if (err) throw err;
        settings = updatedSettings;
      }
    } catch (err: any) {
      // Self-healing fallback if columns are missing
      if (err.message && (err.message.includes('column') || err.message.includes('does not exist') || err.message.includes('attribute'))) {
        console.warn('Hero settings columns are missing in Supabase. Falling back to standard columns.');
        const fallbackData: any = {};
        if (websiteTitle) fallbackData.website_title = websiteTitle;
        if (adminEmail) fallbackData.admin_email = adminEmail;
        if (adminPhone) fallbackData.admin_phone = adminPhone;
        if (req.file) {
          fallbackData.logo_url = updateData.logo_url;
        }

        if (!settings) {
          const { data } = await supabase.from('settings').insert([fallbackData]).select().single();
          settings = data;
        } else {
          const { data } = await supabase.from('settings').update(fallbackData).eq('id', settings.id).select().single();
          settings = data;
        }
        updateError = 'DATABASE_COLUMNS_MISSING';
      } else {
        throw err;
      }
    }

    if (adminName) {
      await supabase.from('admins').update({ name: adminName }).eq('id', req.adminId);
    }

    res.json({
      websiteTitle: settings?.website_title,
      adminEmail: settings?.admin_email,
      adminPhone: settings?.admin_phone,
      logoUrl: settings?.logo_url,
      heroSubtitle: settings?.hero_subtitle || heroSubtitle || 'Bespoke Metal Craft',
      heroTitle: settings?.hero_title || heroTitle || 'Where Metal Meets Mastery',
      heroButton: settings?.hero_button || heroButton || 'Explore Collection',
      atelierAddress: settings?.atelier_address || atelierAddress || 'Kanniyakumari\nTamil Nadu\nIndia',
      instagramUsername: settings?.instagram_username || instagramUsername || '@vallery_studio.lab',
      formspreeKey: settings?.formspree_key || formspreeKey || '',
      warning: updateError
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
