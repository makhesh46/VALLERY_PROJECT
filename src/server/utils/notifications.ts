import twilio from 'twilio';

export const sendNotification = async (
  requestData: any,
  adminEmail: string,
  formspreeKey?: string,
  adminPhone?: string
) => {
  const message = `
    New Product Request:
    Customer Name: ${requestData.customerName}
    Product: ${requestData.productName}
    Phone Number: ${requestData.phoneNumber}
    Address: ${requestData.address}
    Email: ${requestData.email}
    Message: ${requestData.message || 'N/A'}
  `;

  // 1. Email Notification via Formspree
  try {
    const accessKey = formspreeKey || process.env.WEB3FORMS_ACCESS_KEY;
    
    if (!accessKey) {
      console.error('Formspree Form ID / Key is missing!');
    } else {
      console.log(`Attempting to send email via Formspree...`);

      const response = await fetch(`https://formspree.io/f/${accessKey.trim()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          subject: 'New Product Request from your website',
          email: requestData.email || 'no-reply@vallery.com',
          message: message,
        })
      });

      const textResponse = await response.text();
      
      try {
        const result = JSON.parse(textResponse);
        if (response.status === 200 || response.status === 201) {
          console.log(`Email sent successfully via Formspree!`);
        } else {
          console.error('Email sending failed:', result);
        }
      } catch (parseError) {
        console.error(`API returned an HTML error page (Status: ${response.status}).`);
        console.error('HTML Response preview:', textResponse.substring(0, 150));
      }
    }
  } catch (error) {
    console.error('Email sending failed:', error);
  }

  // 2. WhatsApp Notification via Twilio
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromWhatsApp = process.env.TWILIO_FROM_WHATSAPP;
  const toWhatsAppOverride = process.env.TWILIO_TO_WHATSAPP;

  if (accountSid && authToken && fromWhatsApp) {
    try {
      let toWhatsApp = toWhatsAppOverride;
      if (!toWhatsApp && adminPhone) {
        let phone = adminPhone.trim();
        if (!phone.startsWith('+')) {
          phone = `+91${phone}`; // Default to India country code if not present
        }
        toWhatsApp = `whatsapp:${phone}`;
      }

      if (toWhatsApp) {
        console.log(`Attempting to send WhatsApp message via Twilio to ${toWhatsApp}...`);
        const client = twilio(accountSid, authToken);
        await client.messages.create({
          body: message,
          from: fromWhatsApp,
          to: toWhatsApp
        });
        console.log('WhatsApp notification sent successfully!');
      } else {
        console.warn('WhatsApp notification skipped: No recipient phone number provided.');
      }
    } catch (twilioError) {
      console.error('Failed to send WhatsApp notification via Twilio:', twilioError);
    }
  } else {
    console.log('Twilio credentials not fully set. Skipping WhatsApp notification.');
  }
};
