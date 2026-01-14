/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  // Safelist để đảm bảo các classes DaisyUI không bị purge trong production
  safelist: [
    // Base colors
    'bg-base-100',
    'bg-base-200',
    'bg-base-300',
    'text-base-content',
    'border-base-300',
    // Primary colors và variants
    'bg-primary',
    'bg-primary/10',
    'bg-primary/5',
    'bg-primary/20',
    'border-primary',
    'text-primary',
    // Gradients
    'from-primary/10',
    'to-primary/5',
    'from-base-100',
    'to-transparent',
    'bg-gradient-to-r',
    'bg-gradient-to-t',
    // Chat components
    'chat',
    'chat-bubble',
    'chat-bubble-primary',
    'chat-start',
    'chat-end',
    'chat-header',
    // Input và button
    'input',
    'input-sm',
    'input-bordered',
    'btn',
    'btn-sm',
    'btn-primary',
    'btn-circle',
    'btn-ghost',
    // Utility classes
    'rounded-full',
    'rounded-t-2xl',
    'shadow-2xl',
    'shadow-md',
    'shadow-lg',
    // Patterns để catch tất cả variants
    {
      pattern: /^(bg|text|border)-(base|primary)-(100|200|300|content)/,
    },
    {
      pattern: /^(bg|text|border)-primary(\/.*)?$/,
    },
    {
      pattern: /^(from|to)-(base|primary)(\/.*)?$/,
    },
    {
      pattern: /^chat(-.*)?$/,
    },
  ],
  theme: {
    extend: {
      colors: {
        tinyZ: {
          dark: '#0f0f0f',
          'dark-alt': '#1a1a1a',
          accent: '#00d4ff',
          'accent-hover': '#00b9ae',
          text: '#ffffff',
          'text-secondary': '#e0e0e0',
        },
      },
      backgroundColor: {
        'grok-dark': '#0f0f0f',
        'grok-dark-alt': '#1a1a1a',
      },
      textColor: {
        'grok-accent': '#00d4ff',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        dark: {
          primary: '#00b9ae',
          secondary: '#00a89a',
          accent: '#00d4ff',
          neutral: '#0a0a0a',
          'base-100': '#0f0f0f',
          'base-200': '#1a1a1a',
          'base-300': '#2a2a2a',
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
    ],
    darkTheme: 'dark',
    base: true, // Đảm bảo base styles được apply
    styled: true, // Đảm bảo component styles được apply
    utils: true, // Đảm bảo utility classes được apply
  },
}