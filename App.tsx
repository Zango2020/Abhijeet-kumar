
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentDisplay } from './components/ContentDisplay';
import { COURSE_OUTLINE, COURSE_META } from './constants';
import type { Topic, GeneratedContent, Module, TopicHistoryItem } from './types';
import { generate5GSecurityExplanation } from './services/geminiService';
import { SecurityShield } from './components/CyberBackground';

// Custom Logo Icon for 5G Security
const Logo5G: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 50 50" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <path
            d="M25 3 L47 12 L47 28 C47 42 35 52 25 57 C15 52 3 42 3 28 L3 12 Z"
            fill="url(#logoGradient)"
            stroke="#67e8f9"
            strokeWidth="1"
            filter="url(#logoGlow)"
        />
        <text
            x="25"
            y="32"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
        >
            5G
        </text>
        <circle cx="25" cy="42" r="3" fill="#22d3ee" className="animate-pulse" />
    </svg>
);

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TopicHistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('5g-security-course-history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      setHistory([]);
    }
  }, []);

  const handleTopicSelect = useCallback((topic: Topic, module: Module) => {
    setSelectedTopic(topic);
    setModuleTitle(module.title);
    setContent(null);
    setError(null);

    setHistory(prevHistory => {
      const newHistoryItem: TopicHistoryItem = {
        topicId: topic.id,
        topicTitle: topic.title,
        moduleId: module.id,
        moduleTitle: module.title,
      };

      const filteredHistory = prevHistory.filter(item => item.topicId !== topic.id);
      const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, 5);

      try {
        localStorage.setItem('5g-security-course-history', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Failed to save history to localStorage", e);
      }

      return updatedHistory;
    });
  }, []);

  const handleHistorySelect = useCallback((historyItem: TopicHistoryItem) => {
    const module = COURSE_OUTLINE.find(m => m.id === historyItem.moduleId);
    if (module) {
        const topic = module.topics.find(t => t.id === historyItem.topicId);
        if (topic) {
            handleTopicSelect(topic, module);
        }
    }
  }, [handleTopicSelect]);

  useEffect(() => {
    if (!selectedTopic || !moduleTitle) {
      return;
    }

    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generate5GSecurityExplanation(selectedTopic, moduleTitle);
        setContent(result);
      } catch (err) {
        console.error("Error generating content:", err);
        setError("Failed to generate content. Please check your API key and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [selectedTopic, moduleTitle]);

  // Calculate progress
  const totalTopics = COURSE_OUTLINE.reduce((sum, m) => sum + m.topics.length, 0);
  const completedTopics = history.length;
  const progressPercent = Math.round((completedTopics / totalTopics) * 100);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      <Sidebar
        modules={COURSE_OUTLINE}
        onTopicSelect={handleTopicSelect}
        selectedTopic={selectedTopic}
        history={history}
        onHistorySelect={handleHistorySelect}
      />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-gray-800/70 backdrop-blur-md border-b border-gray-700/50 p-4 shadow-xl z-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Logo5G className="h-12 w-12" />
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center">
                            {COURSE_META.title}
                            <span className="ml-3 px-2 py-0.5 text-xs font-medium bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                                v{COURSE_META.version}
                            </span>
                        </h1>
                        <p className="text-sm text-gray-400">{COURSE_META.subtitle}</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                    {/* Progress Indicator */}
                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Course Progress</p>
                            <p className="text-sm font-semibold text-white">{completedTopics} / {totalTopics} topics</p>
                        </div>
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500 relative"
                                style={{ width: `${progressPercent}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                            </div>
                        </div>
                    </div>
                    {/* Certification Badge */}
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-lg border border-cyan-500/20">
                        <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-cyan-400">{COURSE_META.certification}</span>
                    </div>
                </div>
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          {/* Subtle background effect */}
          <div className="absolute inset-0 cyber-grid pointer-events-none opacity-30" />

          <ContentDisplay
            topic={selectedTopic}
            moduleTitle={moduleTitle}
            content={content}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Footer Stats */}
        <footer className="bg-gray-800/50 border-t border-gray-700/50 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                    <span>{COURSE_META.totalModules} Modules</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span>{COURSE_META.totalTopics} Topics</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span>{COURSE_META.estimatedHours}h+ Content</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span>Powered by Gemini AI</span>
                </div>
            </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
