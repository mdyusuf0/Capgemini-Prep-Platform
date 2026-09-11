import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import PracticePage from '@/pages/PracticePage';
import MCQPracticePage from '@/pages/MCQPracticePage';
import PseudocodePracticePage from '@/pages/PseudocodePracticePage';
import PseudocodeSpeedModePage from '@/pages/PseudocodeSpeedModePage';
import { CodingListPage } from '@/pages/CodingListPage';
import { CodingProblemPage } from '@/pages/CodingProblemPage';
import DebuggingPage from '@/pages/DebuggingPage';
import DebuggingChallengePage from '@/pages/DebuggingChallengePage';
import TimedDebuggingPage from '@/pages/TimedDebuggingPage';
import { AICodingPage } from '@/pages/AICodingPage';
import { AILiteracyPage } from '@/pages/AILiteracyPage';
import { CommunicationPage } from '@/pages/CommunicationPage';
import CognitiveGamesPage from '@/pages/CognitiveGamesPage';
import { BehavioralPage } from '@/pages/BehavioralPage';
import MockTestListPage from '@/pages/MockTestListPage';
import MockTestPage from '@/pages/MockTestPage';
import MockResultPage from '@/pages/MockResultPage';
import TechInterviewPage from '@/pages/TechInterviewPage';
import HRInterviewPage from '@/pages/HRInterviewPage';
import AIInterviewPage from '@/pages/AIInterviewPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import MistakesPage from '@/pages/MistakesPage';
import BookmarksPage from '@/pages/BookmarksPage';
import RoadmapPage from '@/pages/RoadmapPage';
import SettingsPage from '@/pages/SettingsPage';
import MustKnowPage from '@/pages/MustKnowPage';
import DailyChallengePage from '@/pages/DailyChallengePage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              
              <Route path="/must-know" element={<MustKnowPage />} />
              <Route path="/daily-challenge" element={<DailyChallengePage />} />

              <Route path="/practice" element={<PracticePage />} />
              <Route path="/practice/mcq/:category?" element={<MCQPracticePage />} />
              <Route path="/practice/pseudocode" element={<PseudocodePracticePage />} />
              <Route path="/practice/pseudocode/speed" element={<PseudocodeSpeedModePage />} />
              
              <Route path="/coding" element={<CodingListPage />} />
              <Route path="/coding/:id" element={<CodingProblemPage />} />
              
              <Route path="/debugging" element={<DebuggingPage />} />
              <Route path="/debugging/timed" element={<TimedDebuggingPage />} />
              <Route path="/debugging/:id" element={<DebuggingChallengePage />} />

              <Route path="/ai-coding" element={<AICodingPage />} />
              <Route path="/ai-literacy" element={<AILiteracyPage />} />
              <Route path="/communication" element={<CommunicationPage />} />
              <Route path="/games" element={<CognitiveGamesPage />} />
              <Route path="/behavioral" element={<BehavioralPage />} />
              
              <Route path="/mocks" element={<MockTestListPage />} />
              <Route path="/mocks/attempt/:id" element={<MockTestPage />} />
              <Route path="/mocks/result/:id" element={<MockResultPage />} />
              
              <Route path="/interview/technical" element={<TechInterviewPage />} />
              <Route path="/interview/hr" element={<HRInterviewPage />} />
              <Route path="/interview/ai" element={<AIInterviewPage />} />
              
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/mistakes" element={<MistakesPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1e1e2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }} 
      />
    </QueryClientProvider>
  );
}
