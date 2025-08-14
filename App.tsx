
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentDisplay } from './components/ContentDisplay';
import { COURSE_OUTLINE } from './constants';
import type { Topic, GeneratedContent } from './types';
import { generateLteExplanation } from './services/geminiService';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTopicSelect = useCallback((topic: Topic, title: string) => {
    setSelectedTopic(topic);
    setModuleTitle(title);
    setContent(null); 
    setError(null);
  }, []);

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
