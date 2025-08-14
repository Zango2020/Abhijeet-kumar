
import React, { useState } from 'react';
import type { Module, Topic } from '../types';
import { ChevronDownIcon, BookOpenIcon, DocumentTextIcon } from './Icons';

interface SidebarProps {
  modules: Module[];
  onTopicSelect: (topic: Topic, moduleTitle: string) => void;
  selectedTopic: Topic | null;
}

const ModuleItem: React.FC<{
  module: Module;
  onTopicSelect: (topic: Topic, moduleTitle: string) => void;
  selectedTopic: Topic | null;
}> = ({ module, onTopicSelect, selectedTopic }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-md bg-gray-700/50 hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center">
          <BookOpenIcon className="h-5 w-5 mr-3 text-cyan-400" />
          <span className="font-semibold text-sm text-gray-200">{module.title}</span>
        </div>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <ul className="mt-2 pl-6 border-l-2 border-gray-700">
          {module.topics.map((topic) => (
            <li key={topic.id}>
              <button
                onClick={() => onTopicSelect(topic, module.title)}
                className={`w-full text-left py-2 px-3 my-0.5 rounded-md text-sm transition-colors duration-200 flex items-center ${
                  selectedTopic?.id === topic.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                    : 'text-gray-400 hover:bg-gray-700/80 hover:text-gray-200'
                }`}
              >
                <DocumentTextIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                <span>{topic.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ modules, onTopicSelect, selectedTopic }) => {
  return (
    <aside className="w-80 h-screen bg-gray-800 flex-shrink-0 flex flex-col border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white">Course Modules</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {modules.map((module) => (
          <ModuleItem 
            key={module.id} 
            module={module} 
            onTopicSelect={onTopicSelect} 
            selectedTopic={selectedTopic}
          />
        ))}
      </nav>
    </aside>
  );
};
