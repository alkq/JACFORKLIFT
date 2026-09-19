// api/submit.js - Vercel Serverless Function
export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // ─────────────────────────────────────────────────────────
    // STEP 1: Safely parse the request body
    // Vercel may or may not auto-parse depending on config.
    // If req.body is already an object, use it. Otherwise, read
    // the raw stream and parse it.
    // ─────────────────────────────────────────────────────────
    let body = req.body;

    if (!body || typeof body === 'string') {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf-8');
      try {
        body = raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.error('❌ Failed to parse body as JSON:', raw.substring(0, 200));
        return res.status(400).json({ success: false, message: 'Invalid JSON body' });
      }
    }

    console.log('📥 Submission received:', {
      from_name: body?.from_name,
      subject: body?.subject,
      email: body?.business_email || body?.email,
      timestamp: new Date().toISOString()
    });

    // ─────────────────────────────────────────────────────────
    // STEP 2: Check the env var
    // ─────────────────────────────────────────────────────────
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.error('❌ WEB3FORMS_ACCESS_KEY not set');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: missing access key'
      });
    }

    // ─────────────────────────────────────────────────────────
    // STEP 3: Forward to Web3Forms
    // ─────────────────────────────────────────────────────────
    const payload = {
      ...body,
      access_key: accessKey
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // ─────────────────────────────────────────────────────────
    // STEP 4: Safely parse Web3Forms response
    // Web3Forms occasionally returns HTML on errors.
    // We must not call response.json() blindly.
    // ─────────────────────────────────────────────────────────
    const responseText = await response.text();

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Web3Forms returned non-JSON:', responseText.substring(0, 500));
      return res.status(502).json({
        success: false,
        message: 'Upstream provider returned an invalid response',
        detail: responseText.substring(0, 200)
      });
    }

    if (result.success) {
      console.log('✅ Web3Forms accepted submission');
    } else {
      console.warn('⚠️ Web3Forms rejected submission:', result.message || 'Unknown');
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('❌ Fatal error in /api/submit:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
}