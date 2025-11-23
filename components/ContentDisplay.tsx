import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { Topic, GeneratedContent } from '../types';
import { Loader } from './Loader';
import { InfoIcon, DiagramIcon, TextIcon, ZoomInIcon, ZoomOutIcon, ResetZoomIcon } from './Icons';
import { TTSControls } from './TTSControls';
import { SecurityShield, RadarScan, EncryptionLock } from './CyberBackground';

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
    <div
      role="tooltip"
      className="fixed z-50 px-4 py-2 text-sm font-medium text-white bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-lg border border-cyan-500/30 tooltip transition-opacity duration-300 pointer-events-none max-w-xs"
      style={{ left: x, top: y }}
    >
      {content}
      <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 border-l border-t border-cyan-500/30 transform rotate-45" />
    </div>
);

const WelcomeMessage: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8 animate-fade-in">
        <div className="relative mb-8">
            <SecurityShield className="w-32 h-40 animate-float" animated={true} />
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-cyan-500/20 rounded-full blur-md" />
        </div>
        <h2 className="text-3xl font-bold mb-3 gradient-text">Welcome to 5G Security Masterclass</h2>
        <p className="max-w-lg text-gray-400 mb-6">
            Master the art of securing next-generation mobile networks. Select a topic from the sidebar to begin your journey into 5G security.
        </p>
        <div className="flex items-center space-x-8 mt-4">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-2 animate-pulse-subtle">
                    <span className="text-2xl font-bold text-cyan-400">18</span>
                </div>
                <span className="text-xs text-gray-500">Modules</span>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-2 animate-pulse-subtle" style={{ animationDelay: '0.3s' }}>
                    <span className="text-2xl font-bold text-cyan-400">108</span>
                </div>
                <span className="text-xs text-gray-500">Topics</span>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-2 animate-pulse-subtle" style={{ animationDelay: '0.6s' }}>
                    <span className="text-2xl font-bold text-cyan-400">40h</span>
                </div>
                <span className="text-xs text-gray-500">Content</span>
            </div>
        </div>
        <div className="mt-8 flex items-center space-x-2 text-sm text-gray-500">
            <RadarScan className="w-5 h-5" size={20} />
            <span>AI-powered explanations with teacher voice narration</span>
        </div>
    </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
        <div className="relative mb-6">
            <EncryptionLock className="w-20 h-28" locked={false} />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-red-400">Security Alert</h2>
        <p className="max-w-md text-gray-400 mb-4">{message}</p>
        <div className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
            Error Code: API_CONNECTION_FAILED
        </div>
    </div>
);

const DiagramControls: React.FC<{ zoomIn: () => void; zoomOut: () => void; resetTransform: () => void }> = ({ zoomIn, zoomOut, resetTransform }) => (
    <div className="absolute top-3 right-3 z-20 flex items-center space-x-1 bg-gray-900/70 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-1">
      <button onClick={() => zoomIn()} title="Zoom In" className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 rounded-md transition-all"><ZoomInIcon className="w-5 h-5" /></button>
      <button onClick={() => zoomOut()} title="Zoom Out" className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 rounded-md transition-all"><ZoomOutIcon className="w-5 h-5" /></button>
      <button onClick={() => resetTransform()} title="Reset View" className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 rounded-md transition-all"><ResetZoomIcon className="w-5 h-5" /></button>
    </div>
);

const SecurityLevelBadge: React.FC<{ level: string }> = ({ level }) => {
    const colors: Record<string, string> = {
        'critical': 'bg-red-500/20 border-red-500/50 text-red-400',
        'high': 'bg-orange-500/20 border-orange-500/50 text-orange-400',
        'medium': 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
        'advanced': 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors[level] || colors['advanced']} security-level`}>
            {level.toUpperCase()}
        </span>
    );
};

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ topic, moduleTitle, content, isLoading, error }) => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader />
        <div className="mt-6 flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full loading-dot" />
          <div className="w-2 h-2 bg-cyan-400 rounded-full loading-dot" />
          <div className="w-2 h-2 bg-cyan-400 rounded-full loading-dot" />
        </div>
        <p className="text-gray-400 mt-4 text-sm">Generating secure content...</p>
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
    {tooltip?.visible && <Tooltip content={tooltip.content} x={tooltip.x} y={tooltip.y} />}
    <div className="space-y-6 animate-fade-in">
        {/* Header Section */}
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                    <p className="text-sm font-medium text-cyan-400">{moduleTitle}</p>
                    <SecurityLevelBadge level="advanced" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">{topic.title}</h1>
            </div>
            <div className="hidden lg:block">
                <EncryptionLock className="w-12 h-16 animate-lock" locked={true} />
            </div>
        </div>

        {content && (
            <>
                {/* TTS Controls */}
                <TTSControls text={content.explanation} className="animate-slide-in-left" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Explanation Panel */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 card-hover overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500/10 to-transparent p-4 border-b border-gray-700/50">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mr-3">
                                    <TextIcon className="w-5 h-5 text-cyan-400" />
                                </div>
                                Expert Explanation
                            </h2>
                        </div>
                        <div className="p-6">
                            <div
                                className="prose prose-invert prose-p:text-gray-300 prose-strong:text-cyan-300 prose-ul:text-gray-300 prose-li:marker:text-cyan-400 prose-headings:text-white max-w-none"
                                dangerouslySetInnerHTML={{ __html: content.explanation.replace(/\n/g, '<br />') }}
                            />
                        </div>
                    </div>

                    {/* Diagram Panel */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 card-hover flex flex-col overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500/10 to-transparent p-4 border-b border-gray-700/50">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mr-3">
                                    <DiagramIcon className="w-5 h-5 text-cyan-400" />
                                </div>
                                Interactive Diagram
                            </h2>
                        </div>
                        <div className="relative flex-1 min-h-[400px] p-4">
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
                                            <div id="diagram-container" className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-lg cursor-grab active:cursor-grabbing border border-gray-700/30">
                                                {content.diagram ? (
                                                    <div className="w-full p-4" dangerouslySetInnerHTML={{ __html: content.diagram }} />
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-500">
                                                        <DiagramIcon className="w-12 h-12 mb-2 opacity-50" />
                                                        <p>Diagram could not be generated.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </TransformComponent>
                                    </>
                                )}
                            </TransformWrapper>
                        </div>
                        <div className="p-3 border-t border-gray-700/50 bg-gray-800/30">
                            <p className="text-xs text-gray-500 text-center">
                                Hover over diagram elements for details. Use scroll to zoom, drag to pan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Stats Bar */}
                <div className="flex items-center justify-center space-x-8 py-4 border-t border-gray-700/30">
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>AI Content Generated</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        <span>Interactive Diagram Active</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                        <span>Voice Narration Ready</span>
                    </div>
                </div>
            </>
        )}
    </div>
    </>
  );
};
