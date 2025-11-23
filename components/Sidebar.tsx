
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Module, Topic, TopicHistoryItem } from '../types';
import { ChevronDownIcon, BookOpenIcon, DocumentTextIcon, HistoryIcon, VoNRIcon, SoundOnIcon, SoundOffIcon } from './Icons';
import { audioService } from '../services/audioService';

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
  index: number;
}> = ({ module, onTopicSelect, selectedTopic, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    audioService.play('click');
    setIsOpen(!isOpen);
  };

  const handleTopicClick = (topic: Topic) => {
    audioService.play('success');
    onTopicSelect(topic, module);
  };

  return (
    <motion.div
      className="mb-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
    >
      <motion.button
        onClick={handleToggle}
        onMouseEnter={() => audioService.play('hover')}
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg bg-gradient-to-r from-gray-700/50 to-gray-800/50 hover:from-cyan-900/30 hover:to-gray-700/50 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group"
      >
        <div className="flex items-center">
          <motion.div
            animate={{ rotate: isOpen ? 360 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <BookOpenIcon className="h-5 w-5 mr-3 text-cyan-400 group-hover:text-cyan-300" />
          </motion.div>
          <span className="font-semibold text-sm text-gray-200 group-hover:text-white">{module.title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDownIcon className="h-5 w-5 text-gray-400 group-hover:text-cyan-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-2 pl-4 overflow-hidden"
          >
            <div className="border-l-2 border-gradient-to-b from-cyan-500 to-purple-500 pl-2">
              {module.topics.map((topic, topicIndex) => (
                <motion.li
                  key={topic.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: topicIndex * 0.05 }}
                >
                  <motion.button
                    onClick={() => handleTopicClick(topic)}
                    onMouseEnter={() => audioService.play('hover')}
                    whileHover={{ x: 8, scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full text-left py-2.5 px-3 my-0.5 rounded-lg text-sm transition-all duration-300 flex items-center group ${
                      selectedTopic?.id === topic.id
                        ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/20 text-cyan-300 font-medium border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                        : 'text-gray-400 hover:bg-gray-700/60 hover:text-gray-200 border border-transparent'
                    }`}
                  >
                    <motion.div
                      animate={selectedTopic?.id === topic.id ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5, repeat: selectedTopic?.id === topic.id ? Infinity : 0, repeatDelay: 2 }}
                    >
                      <DocumentTextIcon className={`h-4 w-4 mr-3 flex-shrink-0 ${selectedTopic?.id === topic.id ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`} />
                    </motion.div>
                    <span className="truncate">{topic.title}</span>
                    {selectedTopic?.id === topic.id && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-cyan-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                </motion.li>
              ))}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ modules, onTopicSelect, selectedTopic, history, onHistorySelect }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    audioService.setEnabled(newState);
    if (newState) audioService.play('click');
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-80 h-screen bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 flex-shrink-0 flex flex-col border-r border-gray-700/50 shadow-2xl"
    >
      {/* Header */}
      <motion.div
        className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <VoNRIcon className="h-8 w-8 text-cyan-400" />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                VoNR Course
              </h2>
              <p className="text-xs text-gray-500">Voice over New Radio</p>
            </div>
          </div>
          <motion.button
            onClick={toggleSound}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
            title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundEnabled ? (
              <SoundOnIcon className="h-5 w-5 text-cyan-400" />
            ) : (
              <SoundOffIcon className="h-5 w-5 text-gray-500" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Progress indicator */}
      <motion.div
        className="px-4 py-3 border-b border-gray-700/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Course Progress</span>
          <span className="text-cyan-400">15 Modules</span>
        </div>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '0%' }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </div>
      </motion.div>

      {/* Modules list */}
      <nav className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
        >
          {modules.map((module, index) => (
            <ModuleItem
              key={module.id}
              module={module}
              onTopicSelect={onTopicSelect}
              selectedTopic={selectedTopic}
              index={index}
            />
          ))}
        </motion.div>
      </nav>

      {/* History section */}
      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="flex-shrink-0 p-4 border-t border-gray-700/50 bg-gradient-to-t from-gray-900 to-transparent"
          >
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <HistoryIcon className="h-4 w-4 mr-2 text-purple-400" />
              </motion.div>
              Recent Topics
            </h3>
            <ul className="space-y-1">
              {history.map((item, index) => (
                <motion.li
                  key={item.topicId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.button
                    onClick={() => {
                      audioService.play('click');
                      onHistorySelect(item);
                    }}
                    onMouseEnter={() => audioService.play('hover')}
                    whileHover={{ x: 4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left py-2 px-3 rounded-lg text-sm text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 transition-all duration-200 group border border-transparent hover:border-purple-500/30"
                    title={`${item.moduleTitle} - ${item.topicTitle}`}
                  >
                    <span className="block font-medium text-gray-300 group-hover:text-white truncate">{item.topicTitle}</span>
                    <span className="block text-xs text-gray-500 group-hover:text-gray-400 truncate">{item.moduleTitle}</span>
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};
