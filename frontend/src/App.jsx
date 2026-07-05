import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import LogToday from './pages/LogToday';
import Chat from './pages/Chat';
import History from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="log" element={<LogToday />} />
          <Route path="history" element={<History />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
