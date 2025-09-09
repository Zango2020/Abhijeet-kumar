import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { Topic, GeneratedContent } from '../types';
import { Loader } from './Loader';
import { InfoIcon, DiagramIcon, TextIcon, ZoomInIcon, ZoomOutIcon, ResetZoomIcon } from './Icons';

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
      className="fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700 transition-opacity duration-300 pointer-events-none"
      style={{ left: x, top: y }}
    >
      {content}
    </div>
);

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

const DiagramControls: React.FC<{ zoomIn: () => void; zoomOut: () => void; resetTransform: () => void }> = ({ zoomIn, zoomOut, resetTransform }) => (
    <div className="absolute top-3 right-3 z-20 flex items-center space-x-1 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-1">
      <button onClick={() => zoomIn()} title="Zoom In" className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"><ZoomInIcon className="w-5 h-5" /></button>
      <button onClick={() => zoomOut()} title="Zoom Out" className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"><ZoomOutIcon className="w-5 h-5" /></button>
      <button onClick={() => resetTransform()} title="Reset View" className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"><ResetZoomIcon className="w-5 h-5" /></button>
    </div>
  );

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
            y: rect.bottom + window.scrollY + 5, // Position below the element
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
    return <div className="flex items-center justify-center h-full"><Loader /></div>;
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
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-200 flex items-center p-6 pb-2">
                        <DiagramIcon className="w-6 h-6 mr-3 text-cyan-400" />
                        Diagram
                    </h2>
                    <div className="relative w-full flex-1 min-h-[300px] p-6 pt-4">
                        <TransformWrapper
                             initialScale={1}
                             minScale={0.5}
                             maxScale={8}
                             wheel={{
                                 step: 0.2,
                             }}
                        >
                            {({ zoomIn, zoomOut, resetTransform }) => (
                                <>
                                    <DiagramControls zoomIn={zoomIn} zoomOut={zoomOut} resetTransform={resetTransform} />
                                    <TransformComponent
                                        wrapperStyle={{ width: '100%', height: '100%' }}
                                        contentStyle={{ width: '100%', height: '100%' }}
                                    >
                                        <div id="diagram-container" className="w-full h-full flex items-center justify-center bg-gray-900 rounded-md cursor-grab active:cursor-grabbing">
                                            {content.diagram ? (
                                                <div className="w-full" dangerouslySetInnerHTML={{ __html: content.diagram }} />
                                            ) : (
                                                <p className="text-gray-500">Diagram could not be generated.</p>
                                            )}
                                        </div>
                                    </TransformComponent>
                                </>
                            )}
                        </TransformWrapper>
                    </div>
                </div>
            </div>
        )}
    </div>
    </>
  );
};