const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../src/environments/environment.prod.ts');

let content = fs.readFileSync(envFilePath, 'utf8');

const tmdbApiKey = process.env.TMDB_API_KEY || 'YOUR_API_KEY_HERE';
const groqApiKey = process.env.GROQ_API_KEY || 'GROQ_API_KEY';

content = content.replace(
  /tmdbApiKey:\s*['"`].*?['"`]/,
  `tmdbApiKey: '${tmdbApiKey}'`
);

content = content.replace(
  /groqApiKey:\s*['"`].*?['"`]/,
  `groqApiKey: '${groqApiKey}'`
);

fs.writeFileSync(envFilePath, content, 'utf8');
console.log('✅ Environment variables injected successfully');