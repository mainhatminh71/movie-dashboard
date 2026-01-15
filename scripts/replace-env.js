const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../src/environments/environment.prod.ts');

let content = fs.readFileSync(envFilePath, 'utf8');

const tmdbApiKey = process.env.TMDB_API_KEY || 'YOUR_API_KEY_HERE';
const groqApiKey = process.env.GROQ_API_KEY || 'GROQ_API_KEY';

// Log để debug (không log giá trị thực của API key)
console.log('🔧 Injecting environment variables...');
console.log(`   TMDB_API_KEY: ${tmdbApiKey ? '✅ Set' : '❌ Not set'}`);
console.log(`   GROQ_API_KEY: ${groqApiKey && groqApiKey !== 'GROQ_API_KEY' ? '✅ Set' : '❌ Not set'}`);

// Escape single quotes trong API key để tránh lỗi syntax
const escapeSingleQuotes = (str) => str.replace(/'/g, "\\'");

content = content.replace(
  /tmdbApiKey:\s*['"`].*?['"`]/,
  `tmdbApiKey: '${escapeSingleQuotes(tmdbApiKey)}'`
);

content = content.replace(
  /groqApiKey:\s*['"`].*?['"`]/,
  `groqApiKey: '${escapeSingleQuotes(groqApiKey)}'`
);

fs.writeFileSync(envFilePath, content, 'utf8');
console.log('✅ Environment variables injected successfully');