import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import '@n8n/chat/style.css'
import { createChat } from '@n8n/chat'
import './App.css'
import CCGLogo from './assets/catomind_logo.png'
import { getEnvVar } from './utils/env'

interface ChatAppProps {
  title: string;
  webhookUrl: string;
  path: string;
}

function ChatApp({ title, webhookUrl, path }: ChatAppProps) {
  const containerId = `n8n-chat-container-${path}`;

  useEffect(() => {
    createChat({
      webhookUrl: webhookUrl,
      target: `#${containerId}`,
      mode: 'fullscreen',
      showWelcomeScreen: true,
      initialMessages: ['Hello! Welcome to T-Flow Project Management Agent', 'How can I help you today?']
    });
  }, [webhookUrl, containerId]);

  return (
    <div className="chat-app-wrapper">
      <header className="app-header">
        <div className="header-left">
          <img src={CCGLogo} alt="CCG Logo" className="ccg-logo" />
          <h1 className="app-title">{title}</h1>
        </div>
      </header>
      <div id={containerId} className="full-height-chat"></div>
    </div>
  );
}

function DynamicChatRoute() {
  const webhookId = getEnvVar('VITE_N8N_WEBHOOK_ID');
  const baseUrl = getEnvVar('VITE_N8N_BASE_URL') || 'http://localhost:5678';
  const webhookUrl = webhookId ? `${baseUrl}/webhook/${webhookId}/chat` : '';

  const [webhookExists, setWebhookExists] = useState<null | boolean>(null);
  const [checking, setChecking] = useState(false);

  // Debug: Log the webhook ID to console
  console.log('Base url from env:', baseUrl);
  console.log('Webhook ID from env:', webhookId);

  // Check webhook existence
  useEffect(() => {
    let ignore = false;
    if (!webhookId) return;
    setChecking(true);
    setWebhookExists(null);
    fetch(webhookUrl, { method: 'GET' })
      .then(res => {
        if (!ignore) setWebhookExists(res.ok);
      })
      .catch(() => {
        if (!ignore) setWebhookExists(false);
      })
      .finally(() => {
        if (!ignore) setChecking(false);
      });
    return () => { ignore = true; };
  }, [webhookUrl, webhookId]);

  if (checking || webhookExists === null) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Checking webhook... <span className="loader" /></div>;
  }

  if (!webhookExists) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>Webhook not found or not available.</div>;
  }

  return (
    <ChatApp
      title="T-flow Agent"
      webhookUrl={webhookUrl}
      path={webhookId as string}
    />
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<DynamicChatRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
