const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  const { email, action } = req.query;

  if (!email || !action) {
    return res.status(400).send('Missing email or action');
  }

  try {
    if (action === 'approve') {
      await supabase
        .from('approval_requests')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('email', email);

      return res.status(200).send(`
        <html>
          <body style="font-family: Arial; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            <div style="text-align: center; padding: 40px; background: #1e293b; border-radius: 12px;">
              <h1 style="color: #22c55e;">✅ Access Approved!</h1>
              <p style="color: #cbd5e1;">${email} has been granted access.</p>
              <p style="color: #64748b;">They can now log in to the app.</p>
              <p style="color: #64748b; font-size: 12px; margin-top: 20px;">You can assign their role from the Admin Dashboard.</p>
            </div>
          </body>
        </html>
      `);
    }

    if (action === 'reject') {
      await supabase
        .from('approval_requests')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('email', email);

      return res.status(200).send(`
        <html>
          <body style="font-family: Arial; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            <div style="text-align: center; padding: 40px; background: #1e293b; border-radius: 12px;">
              <h1 style="color: #ef4444;">❌ Access Rejected</h1>
              <p style="color: #cbd5e1;">${email} has been denied access.</p>
              <p style="color: #64748b;">They will see an Access Denied screen.</p>
            </div>
          </body>
        </html>
      `);
    }

    return res.status(400).send('Invalid action');

  } catch (err) {
    console.error('Approve error:', err);
    return res.status(500).send('Server error');
  }
};