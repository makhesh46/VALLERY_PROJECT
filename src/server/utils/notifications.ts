export const sendNotification = async (requestData: any, adminEmail: string, formspreeKey?: string) => {
  const message = `
    New Product Request:
    Customer Name: ${requestData.customerName}
    Product: ${requestData.productName}
    Phone Number: ${requestData.phoneNumber}
    Address: ${requestData.address}
    Email: ${requestData.email}
    Message: ${requestData.message || 'N/A'}
  `;

  try {
    const accessKey = formspreeKey || process.env.WEB3FORMS_ACCESS_KEY;
    
    if (!accessKey) {
      console.error('Formspree Form ID / Key is missing!');
      return;
    }

    console.log(`Attempting to send email via Formspree...`);

    // Using Formspree because it allows server-to-server requests without Cloudflare blocks
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
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};
