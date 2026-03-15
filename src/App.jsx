import { useState } from 'react';
import Landing from './components/Landing';
import Journey from './components/Journey';
import './styles/globals.css';

export default function App() {
  const [started, setStarted] = useState(() => {
    try {
      return !!localStorage.getItem('forge_started');
    } catch {
      return false;
    }
  });

  const handleStart = () => {
    try {
      localStorage.setItem('forge_started', '1');
    } catch {}
    setStarted(true);
  };

  return started ? <Journey /> : <Landing onStart={handleStart} />;
}
