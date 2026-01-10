const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../src/environments/environment.prod.ts');

let content = fs.readFileSync(envFilePath, 'utf8');

const apiKey = process.env.TMDB_API_KEY || 'YOUR_API_KEY_HERE';

content = content.replace(
  /tmdbApiKey:\s*['"`].*?['"`]/,
  `tmdbApiKey: '${apiKey}'`
);

fs.writeFileSync(envFilePath, content, 'utf8');
console.log('✅ Environment variables injected successfully');

