
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { ContentDisplay } from './components/ContentDisplay';
import { COURSE_OUTLINE } from './constants';
import type { Topic, GeneratedContent, Module, TopicHistoryItem } from './types';
import { generateVoNRExplanation } from './services/geminiService';
import { NetworkIcon, SparkleIcon } from './components/Icons';

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TopicHistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('vonr-course-history');
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
        localStorage.setItem('vonr-course-history', JSON.stringify(updatedHistory));
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
        const result = await generateVoNRExplanation(selectedTopic, moduleTitle);
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ top: '10%', right: '10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ bottom: '20%', left: '5%' }}
        />
      </div>

      <Sidebar
        modules={COURSE_OUTLINE}
        onTopicSelect={handleTopicSelect}
        selectedTopic={selectedTopic}
        history={history}
        onHistorySelect={handleHistorySelect}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="bg-gray-800/30 backdrop-blur-xl border-b border-gray-700/50 p-4 shadow-2xl z-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-cyan-500/30 rounded-lg blur-lg" />
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-lg border border-cyan-500/30">
                  <NetworkIcon className="h-8 w-8 text-cyan-400" />
                </div>
              </motion.div>
              <div>
                <motion.h1
                  className="text-2xl font-extrabold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    VoNR Training Course
                  </span>
                </motion.h1>
                <motion.div
                  className="flex items-center space-x-2 text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span>Voice over New Radio</span>
                  <span className="text-gray-600">|</span>
                  <span className="flex items-center space-x-1">
                    <SparkleIcon className="w-3 h-3 text-purple-400" />
                    <span>Powered by Gemini AI</span>
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Status indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden md:flex items-center space-x-3"
            >
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800/50 rounded-full border border-gray-700/50">
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <span className="text-xs text-gray-400">System Ready</span>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Main content area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar"
        >
          <AnimatePresence mode="wait">
            <ContentDisplay
              key={selectedTopic?.id || 'welcome'}
              topic={selectedTopic}
              moduleTitle={moduleTitle}
              content={content}
              isLoading={isLoading}
              error={error}
            />
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800/20 backdrop-blur-sm border-t border-gray-800/50 px-4 py-2"
        >
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>5G NR Voice Technology Training</span>
            <span className="flex items-center space-x-2">
              <span>15 Modules</span>
              <span className="text-gray-700">|</span>
              <span>75+ Topics</span>
            </span>
          </div>
        </motion.footer>
      </main>
    </div>
  );
};

export default App;
