import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { Topic, GeneratedContent } from '../types';
import { Loader } from './Loader';
import { InfoIcon, DiagramIcon, TextIcon, ZoomInIcon, ZoomOutIcon, ResetZoomIcon, NetworkIcon, SparkleIcon, PlayIcon } from './Icons';
import { audioService } from '../services/audioService';

interface ContentDisplayProps {
  topic: Topic | null;
  moduleTitle: string | null;
  content: GeneratedContent | null;
  isLoading: boolean;
  error: string | null;
}

interface TooltipState {
    content: string;
    x: number;
    y: number;
    visible: boolean;
}

const Tooltip: React.FC<Omit<TooltipState, 'visible'>> = ({ content, x, y }) => (
    <motion.div
      role="tooltip"
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className="fixed z-50 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg shadow-xl border border-cyan-500/30 backdrop-blur-sm pointer-events-none max-w-xs"
      style={{ left: x, top: y }}
    >
      <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45 border-l border-t border-cyan-500/30" />
      {content}
    </motion.div>
);

const WelcomeMessage: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      {/* Animated background */}
      <div className="relative mb-8">
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-500/30 rounded-full"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Main icon with glow effect */}
        <motion.div
          className="relative"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.div
            className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
            <NetworkIcon className="w-20 h-20 text-cyan-400" />
          </div>
        </motion.div>
      </div>

      <motion.h2
        className="text-3xl md:text-4xl font-extrabold mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-size-200 animate-gradient">
          Welcome to VoNR Training
        </span>
      </motion.h2>

      <motion.p
        className="text-gray-400 max-w-lg mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Master Voice over New Radio technology with interactive lessons, detailed diagrams, and AI-powered explanations.
      </motion.p>

      {/* Feature cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {[
          { icon: TextIcon, title: 'Deep Explanations', desc: 'Comprehensive content' },
          { icon: DiagramIcon, title: 'Interactive Diagrams', desc: 'Visual learning' },
          { icon: SparkleIcon, title: 'AI-Powered', desc: 'Gemini technology' },
        ].map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-colors cursor-pointer group"
          >
            <feature.icon className="w-8 h-8 text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors" />
            <h3 className="font-semibold text-gray-200 group-hover:text-white">{feature.title}</h3>
            <p className="text-xs text-gray-500">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-8 flex items-center space-x-2 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <PlayIcon className="w-4 h-4" />
        <span>Select a topic from the sidebar to begin</span>
      </motion.div>
    </motion.div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      <motion.div
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: 3,
        }}
        className="bg-red-900/30 p-6 rounded-2xl border border-red-500/30 mb-6"
      >
        <InfoIcon className="w-16 h-16 text-red-400" />
      </motion.div>
      <h2 className="text-2xl font-bold mb-2 text-red-300">An Error Occurred</h2>
      <p className="max-w-md text-red-400/80">{message}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 transition-colors"
        onClick={() => window.location.reload()}
      >
        Try Again
      </motion.button>
    </motion.div>
);

const DiagramControls: React.FC<{ zoomIn: () => void; zoomOut: () => void; resetTransform: () => void }> = ({ zoomIn, zoomOut, resetTransform }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-3 right-3 z-20 flex items-center space-x-1 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl p-1.5 shadow-lg"
    >
      {[
        { icon: ZoomInIcon, action: zoomIn, title: 'Zoom In' },
        { icon: ZoomOutIcon, action: zoomOut, title: 'Zoom Out' },
        { icon: ResetZoomIcon, action: resetTransform, title: 'Reset View' },
      ].map((ctrl, i) => (
        <motion.button
          key={i}
          onClick={() => {
            audioService.play('click');
            ctrl.action();
          }}
          onMouseEnter={() => audioService.play('hover')}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
          whileTap={{ scale: 0.9 }}
          title={ctrl.title}
          className="p-2 text-gray-300 hover:text-cyan-400 rounded-lg transition-colors"
        >
          <ctrl.icon className="w-5 h-5" />
        </motion.button>
      ))}
    </motion.div>
);

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ topic, moduleTitle, content, isLoading, error }) => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [activeTab, setActiveTab] = useState<'explanation' | 'diagram'>('explanation');

  useEffect(() => {
    if (!content?.diagram) {
      setTooltip(null);
      return;
    }

    const timer = setTimeout(() => {
      const diagramContainer = document.getElementById('diagram-container');
      if (!diagramContainer) return;

      const interactiveElements = diagramContainer.querySelectorAll('[data-tooltip-content]');

      const showTooltip = (target: HTMLElement) => {
        const tooltipContent = target.getAttribute('data-tooltip-content');
        if (tooltipContent) {
          audioService.play('hover');
          const rect = target.getBoundingClientRect();
          target.classList.add('svg-highlight');
          setTooltip({
            content: tooltipContent,
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY + 8,
            visible: true,
          });
        }
      };

      const hideTooltip = (target: HTMLElement) => {
        target.classList.remove('svg-highlight');
        setTooltip(prev => prev ? { ...prev, visible: false } : null);
      };

      const handleMouseEnter = (e: Event) => showTooltip(e.currentTarget as HTMLElement);
      const handleMouseLeave = (e: Event) => hideTooltip(e.currentTarget as HTMLElement);
      const handleFocus = (e: Event) => showTooltip(e.currentTarget as HTMLElement);
      const handleBlur = (e: Event) => hideTooltip(e.currentTarget as HTMLElement);

      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
        el.addEventListener('focus', handleFocus);
        el.addEventListener('blur', handleBlur);
      });

      return () => {
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
          el.removeEventListener('focus', handleFocus);
          el.removeEventListener('blur', handleBlur);
        });
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [content?.diagram]);

  // Play success sound when content loads
  useEffect(() => {
    if (content && !isLoading) {
      audioService.play('complete');
    }
  }, [content, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!topic) {
    return <WelcomeMessage />;
  }

  return (
    <>
      <AnimatePresence>
        {tooltip?.visible && <Tooltip content={tooltip.content} x={tooltip.x} y={tooltip.y} />}
      </AnimatePresence>

      <motion.div
        key={topic.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.p
            className="text-sm font-medium text-cyan-400 flex items-center space-x-2"
            whileHover={{ x: 5 }}
          >
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span>{moduleTitle}</span>
          </motion.p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              {topic.title}
            </span>
          </h1>
        </motion.div>

        {/* Mobile tab switcher */}
        <motion.div
          className="flex lg:hidden space-x-2 p-1 bg-gray-800/50 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {(['explanation', 'diagram'] as const).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => {
                audioService.play('click');
                setActiveTab(tab);
              }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'explanation' ? 'Explanation' : 'Diagram'}
            </motion.button>
          ))}
        </motion.div>

        {content && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Explanation Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-xl ${
                activeTab !== 'explanation' ? 'hidden lg:block' : ''
              }`}
            >
              <motion.h2
                className="text-xl font-bold mb-4 text-gray-200 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <TextIcon className="w-6 h-6 mr-3 text-cyan-400" />
                </motion.div>
                Explanation
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="prose prose-invert prose-p:text-gray-300 prose-strong:text-cyan-300 prose-ul:text-gray-300 prose-li:marker:text-cyan-400 max-w-none prose-headings:text-gray-100 prose-a:text-cyan-400"
                dangerouslySetInnerHTML={{ __html: content.explanation.replace(/\n/g, '<br />') }}
              />
            </motion.div>

            {/* Diagram Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-xl flex flex-col overflow-hidden ${
                activeTab !== 'diagram' ? 'hidden lg:flex' : ''
              }`}
            >
              <motion.h2
                className="text-xl font-bold text-gray-200 flex items-center p-6 pb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                >
                  <DiagramIcon className="w-6 h-6 mr-3 text-purple-400" />
                </motion.div>
                Interactive Diagram
              </motion.h2>
              <div className="relative w-full flex-1 min-h-[400px] p-4">
                <TransformWrapper
                  initialScale={1}
                  minScale={0.5}
                  maxScale={8}
                  wheel={{ step: 0.2 }}
                >
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      <DiagramControls zoomIn={zoomIn} zoomOut={zoomOut} resetTransform={resetTransform} />
                      <TransformComponent
                        wrapperStyle={{ width: '100%', height: '100%' }}
                        contentStyle={{ width: '100%', height: '100%' }}
                      >
                        <motion.div
                          id="diagram-container"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl cursor-grab active:cursor-grabbing border border-gray-800"
                        >
                          {content.diagram ? (
                            <div className="w-full p-4" dangerouslySetInnerHTML={{ __html: content.diagram }} />
                          ) : (
                            <p className="text-gray-500">Diagram could not be generated.</p>
                          )}
                        </motion.div>
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              </div>
              <motion.p
                className="text-xs text-gray-500 text-center pb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Hover over elements for details. Use scroll or controls to zoom.
              </motion.p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};
