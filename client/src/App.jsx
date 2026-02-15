import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import ConfigPage from './pages/ConfigPage';
import InterviewPage from './pages/InterviewPage';
import ReportPage from './pages/ReportPage';
import HistoryPage from './pages/HistoryPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ToastProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<ConfigPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </ToastProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
