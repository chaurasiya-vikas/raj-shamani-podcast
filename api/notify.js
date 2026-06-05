const { Resend } = require('resend');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, name } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'chaurasiyavikas1234@gmail.com';
  const appUrl = 'https://raj-shamani-podcast.vercel.app';

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: adminEmail,
      subject: `🔔 New Access Request - ${name || email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f172a; color: #ffffff; border-radius: 12px;">
          <h2 style="color: #a78bfa;">🎙️ Figuring Out — New Access Request</h2>
          <p style="color: #cbd5e1;">Someone wants to join your podcast intelligence system.</p>
          <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Name:</strong> ${name || 'Unknown'}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          </div>
          <a href="${appUrl}/api/approve?email=${encodeURIComponent(email)}&action=approve" 
             style="background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-right: 12px;">
            ✅ Approve Access
          </a>
          <a href="${appUrl}/api/approve?email=${encodeURIComponent(email)}&action=reject" 
             style="background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            ❌ Reject Access
          </a>
          <p style="color: #64748b; font-size: 12px; margin-top: 20px;">You can also manage access from your Admin Dashboard.</p>
        </div>
      `
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};