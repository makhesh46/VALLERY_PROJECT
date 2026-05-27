import bcrypt from 'bcryptjs';
import { supabase } from './supabase.js';

export const seedDatabase = async () => {
  try {
    // Check if admin exists
    const { data: admins, error: adminError } = await supabase.from('admins').select('id').limit(1);
    
    if (adminError) {
      console.error('Error checking admins. Make sure you have run the SQL schema in Supabase.', adminError);
      return;
    }

    if (!admins || admins.length === 0) {
      const hashedPassword = await bcrypt.hash('Adhi99viyanag@', 10);
      
      await supabase.from('admins').insert([{
        username: 'avrevlab@gmail.com',
        password: hashedPassword,
        name: 'Admin'
      }]);
      console.log('Admin user seeded successfully.');
    }

    // Update or create settings with the requested email and WhatsApp number
    const { data: settings } = await supabase.from('settings').select('id').limit(1);
    
    if (!settings || settings.length === 0) {
      await supabase.from('settings').insert([{
        website_title: 'Metal Art & Product Design',
        admin_email: 'avrevlab@gmail.com',
        admin_phone: '8807972934'
      }]);
      console.log('Settings seeded successfully.');
    } else {
      await supabase.from('settings').update({
        admin_email: 'avrevlab@gmail.com',
        admin_phone: '8807972934'
      }).eq('id', settings[0].id);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
