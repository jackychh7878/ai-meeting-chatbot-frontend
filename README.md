# AI Meeting Chatbot Frontend

A React frontend application for an AI-powered meeting chatbot built with TypeScript and Vite, integrated with N8N workflows.

## Features

- N8N webhook integration for chatbot functionality
- Runtime environment variable configuration for Docker containers
- Configurable CORS whitelisting
- Nginx-based static file serving

## Environment Variables

The application supports both build-time and runtime environment variables for Docker deployment:

### Required Variables

- `VITE_N8N_WEBHOOK_ID`: The webhook ID for your N8N workflow
- `VITE_N8N_BASE_URL`: Base URL of your N8N instance (default: http://localhost:5678)
- `VITE_CORS_WHITELIST`: Comma-separated list of allowed CORS origins (default: *)

### Example .env file

```env
VITE_N8N_WEBHOOK_ID=your-webhook-id-here
VITE_N8N_BASE_URL=http://localhost:5678
VITE_CORS_WHITELIST=https://yourdomain.com,https://anotherdomain.com
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Docker Deployment

### Using Docker Compose (Recommended)

1. Copy `env.example` to `.env` and configure your variables
2. Run with docker-compose:

```bash
docker-compose up -d
```

### Manual Docker Build

```bash
# Build the image
docker build -t ai-meeting-chatbot-frontend .

# Run with environment variables
docker run -p 3000:3000 \
  -e VITE_N8N_WEBHOOK_ID=your-webhook-id \
  -e VITE_N8N_BASE_URL=https://your-n8n-instance.com \
  -e VITE_CORS_WHITELIST=https://yourdomain.com \
  ai-meeting-chatbot-frontend
```

## Runtime Environment Variables

This application supports runtime environment variable injection for Docker containers. Environment variables are injected at container startup, allowing you to change configuration without rebuilding the image.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
