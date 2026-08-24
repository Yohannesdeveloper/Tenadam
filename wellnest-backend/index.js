require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const postgres = require('postgres');

const app = express();
app.use(cors());
app.use(express.json());

const connectionString = process.env.DATABASE_URL || '';
const isLocalConnection =
  !connectionString || /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(connectionString);

if (!connectionString) {
  console.warn('DATABASE_URL is not configured. Database features will be unavailable.');
}

// Initialize PostgreSQL client (Railway provides DATABASE_URL)
const sql = postgres(connectionString || 'postgres://localhost:5432/postgres', {
  prepare: false,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: connectionString && !isLocalConnection ? { rejectUnauthorized: false } : false,
});

// Initialize AI client (Groq free tier or OpenAI)
const aiApiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
const isGroq = Boolean(aiApiKey && aiApiKey.startsWith('gsk_'));
const openai = new OpenAI({
  apiKey: aiApiKey || 'missing',
  ...(isGroq ? { baseURL: 'https://api.groq.com/openai/v1' } : {}),
});
const AI_MODEL = isGroq ? 'openai/gpt-oss-120b' : 'gpt-4o-mini';

if (!aiApiKey) {
  console.warn('No GROQ_API_KEY or OPENAI_API_KEY configured. AI features will fail.');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Recommendations endpoint
app.post('/api/recommendations', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Fetch user data from PostgreSQL
    const [emotions, activities, nutrition] = await Promise.all([
      sql`SELECT * FROM emotions WHERE user_id = ${userId}`,
      sql`SELECT * FROM activities WHERE user_id = ${userId}`,
      sql`SELECT * FROM nutrition WHERE user_id = ${userId}`,
    ]);

    // Build a prompt for the AI
    const prompt = `You are a wellness coach specializing in African lifestyle practices. Based on the following user data, create a personalized 4‑week wellness program that includes emotional wellbeing activities, physical exercise suggestions, nutrition tips, and mindfulness practices. Incorporate culturally relevant practices where appropriate. Use a friendly tone.

Emotions: ${JSON.stringify(emotions)}
Activities: ${JSON.stringify(activities)}
Nutrition: ${JSON.stringify(nutrition)}
`;
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });
    const recommendation = completion.choices[0].message.content;

    // Store recommendation (cache) in PostgreSQL
    await sql`
      INSERT INTO recommendations (user_id, content, created_at)
      VALUES (${userId}, ${recommendation}, now())
      ON CONFLICT (user_id)
      DO UPDATE SET content = EXCLUDED.content, created_at = now()
    `;
    res.json({ recommendation });
  } catch (err) {
    console.error('Error generating recommendation', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`WellNest backend listening on port ${PORT}`);
});
