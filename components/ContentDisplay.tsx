
import React from 'react';
import type { Topic, GeneratedContent } from '../types';
import { Loader } from './Loader';
import { InfoIcon, DiagramIcon, TextIcon } from './Icons';

interface ContentDisplayProps {
  topic: Topic | null;
  moduleTitle: string | null;
  content: GeneratedContent | null;
  isLoading: boolean;
  error: string | null;
}

const WelcomeMessage: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
        <InfoIcon className="w-16 h-16 mb-4 text-cyan-500" />
        <h2 className="text-2xl font-bold mb-2 text-gray-200">Welcome to the LTE Course Assistant</h2>
        <p className="max-w-md">Select a topic from the sidebar on the left to begin learning. Detailed explanations and diagrams will be generated for you.</p>
    </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-red-400 bg-red-900/20 p-8 rounded-lg">
        <InfoIcon className="w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-red-300">An Error Occurred</h2>
        <p className="max-w-md">{message}</p>
    </div>
);

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ topic, moduleTitle, content, isLoading, error }) => {
  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader /></div>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!topic) {
    return <WelcomeMessage />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
        <div>
            <p className="text-sm font-medium text-cyan-400">{moduleTitle}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">{topic.title}</h1>
        </div>
      
        {content && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold mb-4 text-gray-200 flex items-center">
                        <TextIcon className="w-6 h-6 mr-3 text-cyan-400" />
                        Explanation
                    </h2>
                    <div 
                        className="prose prose-invert prose-p:text-gray-300 prose-strong:text-gray-100 prose-ul:text-gray-300 prose-li:marker:text-cyan-400 max-w-none" 
                        dangerouslySetInnerHTML={{ __html: content.explanation.replace(/\n/g, '<br />') }} 
                    />
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold mb-4 text-gray-200 flex items-center">
                        <DiagramIcon className="w-6 h-6 mr-3 text-cyan-400" />
                        Diagram
                    </h2>
                    <div className="w-full h-auto min-h-[300px] flex items-center justify-center bg-gray-900 rounded-md p-4">
                        {content.diagram ? (
                            <div className="w-full" dangerouslySetInnerHTML={{ __html: content.diagram }} />
                        ) : (
                            <p className="text-gray-500">Diagram could not be generated.</p>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
