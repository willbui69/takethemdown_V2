
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx: Starting application initialization');

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error('main.tsx: Root element not found');
    throw new Error('Root element not found');
  }
  
  console.log('main.tsx: Root element found, creating React root');
  const root = createRoot(rootElement);
  
  console.log('main.tsx: Rendering App component');
  root.render(<App />);
  
  console.log('main.tsx: App rendered successfully');
} catch (error) {
  console.error('main.tsx: Error during initialization:', error);
}
