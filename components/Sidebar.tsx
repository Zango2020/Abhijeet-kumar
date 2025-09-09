
import React, { useState } from 'react';
import type { Module, Topic, TopicHistoryItem } from '../types';
import { ChevronDownIcon, BookOpenIcon, DocumentTextIcon, HistoryIcon } from './Icons';

interface SidebarProps {
  modules: Module[];
  onTopicSelect: (topic: Topic, module: Module) => void;
  selectedTopic: Topic | null;
  history: TopicHistoryItem[];
  onHistorySelect: (item: TopicHistoryItem) => void;
}

const ModuleItem: React.FC<{
  module: Module;
  onTopicSelect: (topic: Topic, module: Module) => void;
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
                onClick={() => onTopicSelect(topic, module)}
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

export const Sidebar: React.FC<SidebarProps> = ({ modules, onTopicSelect, selectedTopic, history, onHistorySelect }) => {
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
      {history.length > 0 && (
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <h3 className="text-md font-semibold text-gray-300 mb-3 flex items-center">
            <HistoryIcon className="h-5 w-5 mr-2 text-cyan-400" />
            History
          </h3>
          <ul className="space-y-1">
            {history.map((item) => (
              <li key={item.topicId}>
                <button
                  onClick={() => onHistorySelect(item)}
                  className="w-full text-left py-1.5 px-3 rounded-md text-sm text-gray-400 hover:bg-gray-700/80 hover:text-gray-200 transition-colors duration-200 group"
                  title={`${item.moduleTitle} - ${item.topicTitle}`}
                >
                  <span className="block font-medium text-gray-300 group-hover:text-white truncate">{item.topicTitle}</span>
                  <span className="block text-xs text-gray-500 group-hover:text-gray-400 truncate">{item.moduleTitle}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};
