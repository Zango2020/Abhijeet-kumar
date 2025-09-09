
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentDisplay } from './components/ContentDisplay';
import { COURSE_OUTLINE } from './constants';
import type { Topic, GeneratedContent, Module, TopicHistoryItem } from './types';
import { generateLteExplanation } from './services/geminiService';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TopicHistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('lte-course-history');
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
        localStorage.setItem('lte-course-history', JSON.stringify(updatedHistory));
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
        const result = await generateLteExplanation(selectedTopic, moduleTitle);
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
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar 
        modules={COURSE_OUTLINE} 
        onTopicSelect={handleTopicSelect} 
        selectedTopic={selectedTopic}
        history={history}
        onHistorySelect={handleHistorySelect}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-lg z-10 flex items-center space-x-4">
            <LogoIcon className="h-8 w-8 text-cyan-400" />
            <div>
                <h1 className="text-xl font-bold text-white">LTE Training Course Assistant</h1>
                <p className="text-sm text-gray-400">Powered by Gemini</p>
            </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <ContentDisplay
            topic={selectedTopic}
            moduleTitle={moduleTitle}
            content={content}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
