import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { Topic, GeneratedContent } from '../types';
import { audioService } from '../services/audioService';
import {
    MatrixRain,
    GlitchText,
    HolographicCard,
    AnimatedCounter,
    TypingText,
    NeonBorder,
    FloatingParticles,
    ScanLineOverlay,
    Spotlight
} from './AdvancedAnimations';
import {
    NetworkFlowVisualization,
    ThreatVisualization,
    EncryptionFlow,
    ProtocolStack,
    AuthenticationFlow,
    SignalStrength
} from './VideoMotion';

interface ImmersiveLessonProps {
    topic: Topic | null;
    moduleTitle: string | null;
    content: GeneratedContent | null;
    isLoading: boolean;
    error: string | null;
}

// ============================================
// ENHANCED TEACHER CONTROLS
// ============================================
const TeacherVoicePanel: React.FC<{
    text: string;
    className?: string;
}> = ({ text, className }) => {
    const [state, setState] = useState({
        isPlaying: false,
        isPaused: false,
        currentSentence: 0,
        totalSentences: 0,
        progress: 0
    });
    const [currentText, setCurrentText] = useState('');
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [showSettings, setShowSettings] = useState(false);
    const [rate, setRate] = useState(0.9);
    const waveformRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!audioService.isSupported()) return;

        const loadVoices = () => {
            const available = audioService.getAvailableVoices();
            setVoices(available);
            const premium = audioService.getPremiumVoices();
            if (premium.length > 0) {
                audioService.setVoice(premium[0]);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        audioService.setOnStateChange(setState);
        audioService.setOnSentenceChange((_, sentence) => setCurrentText(sentence));

        return () => {
            audioService.stop();
        };
    }, []);

    const handlePlay = () => {
        audioService.playClickSound();
        if (state.isPaused) {
            audioService.resume();
        } else if (!state.isPlaying) {
            audioService.speak(text);
        }
    };

    const handlePause = () => {
        audioService.playClickSound();
        audioService.pause();
    };

    const handleStop = () => {
        audioService.playClickSound();
        audioService.stop();
        setCurrentText('');
    };

    const handleRateChange = (newRate: number) => {
        setRate(newRate);
        audioService.setSettings({ voiceRate: newRate });
    };

    return (
        <NeonBorder color="cyan" className={className}>
            <div className="p-6 bg-gray-900/90 rounded-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {state.isPlaying && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">AI Security Instructor</h3>
                            <p className="text-sm text-gray-400">
                                {state.isPlaying ? 'Speaking...' : 'Ready to teach'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 text-gray-400 hover:text-cyan-400 transition-colors rounded-lg hover:bg-gray-800"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>

                {/* Current sentence display */}
                {currentText && (
                    <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border-l-4 border-cyan-500">
                        <p className="text-gray-300 italic">"{currentText}"</p>
                    </div>
                )}

                {/* Progress bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{state.currentSentence} / {state.totalSentences} sentences</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300 relative"
                            style={{ width: `${state.progress * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        </div>
                    </div>
                </div>

                {/* Waveform visualization */}
                {state.isPlaying && (
                    <div ref={waveformRef} className="flex items-center justify-center space-x-1 h-12 mb-4">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-1.5 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-full"
                                style={{
                                    height: `${Math.random() * 100}%`,
                                    animation: `waveform 0.5s ease-in-out infinite`,
                                    animationDelay: `${i * 0.05}s`
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Main controls */}
                <div className="flex items-center justify-center space-x-4">
                    <button
                        onClick={() => audioService.skipToPrevious()}
                        disabled={!state.isPlaying}
                        className="p-3 text-gray-400 hover:text-white disabled:opacity-30 transition-all hover:scale-110"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.445 14.832A1 1 0 0010 14v-4.587l5.445 3.42A1 1 0 0017 12V8a1 1 0 00-1.555-.832L10 10.587V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                        </svg>
                    </button>

                    <button
                        onClick={state.isPlaying && !state.isPaused ? handlePause : handlePlay}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all hover:scale-105 active:scale-95"
                    >
                        {state.isPlaying && !state.isPaused ? (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>

                    <button
                        onClick={handleStop}
                        disabled={!state.isPlaying && state.currentSentence === 0}
                        className="p-3 text-gray-400 hover:text-red-400 disabled:opacity-30 transition-all hover:scale-110"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <button
                        onClick={() => audioService.skipToNext()}
                        disabled={!state.isPlaying}
                        className="p-3 text-gray-400 hover:text-white disabled:opacity-30 transition-all hover:scale-110"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11.555 5.168A1 1 0 0010 6v4.587l-5.445-3.42A1 1 0 003 8v4a1 1 0 001.555.832L10 9.413V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" />
                        </svg>
                    </button>
                </div>

                {/* Settings panel */}
                {showSettings && (
                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Voice</label>
                            <select
                                onChange={(e) => {
                                    const voice = voices.find(v => v.name === e.target.value);
                                    if (voice) audioService.setVoice(voice);
                                }}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                            >
                                {voices.map(v => (
                                    <option key={v.name} value={v.name}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Speed: {rate.toFixed(1)}x
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={rate}
                                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                                className="w-full accent-cyan-500"
                            />
                        </div>
                    </div>
                )}
            </div>
        </NeonBorder>
    );
};

// ============================================
// INTERACTIVE DIAGRAM VIEWER
// ============================================
const DiagramViewer: React.FC<{
    diagram: string;
    className?: string;
}> = ({ diagram, className }) => {
    const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);

    useEffect(() => {
        const container = document.getElementById('immersive-diagram');
        if (!container) return;

        const elements = container.querySelectorAll('[data-tooltip-content]');

        const showTooltip = (e: Event) => {
            const target = e.currentTarget as HTMLElement;
            const content = target.getAttribute('data-tooltip-content');
            if (content) {
                const rect = target.getBoundingClientRect();
                target.classList.add('svg-highlight');
                setTooltip({
                    content,
                    x: rect.left + rect.width / 2,
                    y: rect.bottom + 10
                });
            }
        };

        const hideTooltip = (e: Event) => {
            (e.currentTarget as HTMLElement).classList.remove('svg-highlight');
            setTooltip(null);
        };

        elements.forEach(el => {
            el.addEventListener('mouseenter', showTooltip);
            el.addEventListener('mouseleave', hideTooltip);
        });

        return () => {
            elements.forEach(el => {
                el.removeEventListener('mouseenter', showTooltip);
                el.removeEventListener('mouseleave', hideTooltip);
            });
        };
    }, [diagram]);

    return (
        <div className={`relative ${className || ''}`}>
            {tooltip && (
                <div
                    className="fixed z-50 px-4 py-2 bg-gray-900/95 border border-cyan-500/50 rounded-lg text-sm text-white shadow-xl max-w-xs pointer-events-none animate-fade-in"
                    style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)' }}
                >
                    {tooltip.content}
                </div>
            )}
            <TransformWrapper initialScale={1} minScale={0.5} maxScale={5}>
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        <div className="absolute top-2 right-2 z-10 flex space-x-1 bg-gray-900/80 rounded-lg p-1">
                            <button onClick={() => zoomIn()} className="p-2 hover:bg-gray-700 rounded transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </button>
                            <button onClick={() => zoomOut()} className="p-2 hover:bg-gray-700 rounded transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                </svg>
                            </button>
                            <button onClick={() => resetTransform()} className="p-2 hover:bg-gray-700 rounded transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </button>
                        </div>
                        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                            <div
                                id="immersive-diagram"
                                className="w-full h-full flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
                                dangerouslySetInnerHTML={{ __html: diagram }}
                            />
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
};

// ============================================
// MAIN IMMERSIVE LESSON COMPONENT
// ============================================
export const ImmersiveLesson: React.FC<ImmersiveLessonProps> = ({
    topic,
    moduleTitle,
    content,
    isLoading,
    error
}) => {
    const [activeTab, setActiveTab] = useState<'lesson' | 'diagram' | 'practice'>('lesson');
    const [showVisualizer, setShowVisualizer] = useState(true);

    // Welcome screen
    if (!topic) {
        return (
            <div className="relative h-full overflow-hidden">
                <MatrixRain className="opacity-20" />
                <FloatingParticles count={30} />
                <Spotlight />

                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="mb-8 animate-float">
                        <svg viewBox="0 0 120 140" className="w-40 h-48">
                            <defs>
                                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#06b6d4" />
                                    <stop offset="100%" stopColor="#0891b2" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <path
                                d="M60 5 L115 25 L115 65 C115 100 85 125 60 135 C35 125 5 100 5 65 L5 25 Z"
                                fill="url(#shieldGrad)"
                                filter="url(#glow)"
                            />
                            <text x="60" y="70" textAnchor="middle" fill="white" fontSize="36" fontWeight="bold" fontFamily="monospace">5G</text>
                            <path d="M45 90 L55 100 L75 80" stroke="#67e8f9" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <GlitchText
                        text="5G SECURITY MASTERCLASS"
                        className="text-4xl font-bold text-white mb-4"
                        intensity="low"
                    />

                    <p className="text-xl text-gray-400 mb-8 max-w-2xl">
                        Master the art of securing next-generation mobile networks with AI-powered interactive lessons
                    </p>

                    <div className="grid grid-cols-3 gap-8 mb-8">
                        <HolographicCard className="p-6 bg-gray-800/50 rounded-xl">
                            <AnimatedCounter value={18} className="text-4xl font-bold text-cyan-400" />
                            <p className="text-gray-400 mt-2">Modules</p>
                        </HolographicCard>
                        <HolographicCard className="p-6 bg-gray-800/50 rounded-xl">
                            <AnimatedCounter value={108} className="text-4xl font-bold text-cyan-400" />
                            <p className="text-gray-400 mt-2">Topics</p>
                        </HolographicCard>
                        <HolographicCard className="p-6 bg-gray-800/50 rounded-xl">
                            <AnimatedCounter value={40} suffix="h" className="text-4xl font-bold text-cyan-400" />
                            <p className="text-gray-400 mt-2">Content</p>
                        </HolographicCard>
                    </div>

                    <div className="flex items-center space-x-2 text-cyan-400">
                        <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span>Select a topic from the sidebar to begin</span>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="relative h-full overflow-hidden">
                <MatrixRain className="opacity-10" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse-glow">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#0e7490" strokeWidth="2" />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#06b6d4"
                                strokeWidth="2"
                                strokeDasharray="280"
                                strokeDashoffset="210"
                                className="animate-spin"
                                style={{ transformOrigin: 'center', animationDuration: '1.5s' }}
                            />
                            <text x="50" y="55" textAnchor="middle" fill="#06b6d4" fontSize="20" fontWeight="bold">5G</text>
                        </svg>
                    </div>
                    <TypingText
                        text="Generating secure content..."
                        className="text-lg text-gray-300 mt-6"
                        speed={50}
                    />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Security Breach Detected</h2>
                <p className="text-gray-400 max-w-md">{error}</p>
            </div>
        );
    }

    // Main lesson view
    return (
        <div className="h-full flex flex-col overflow-hidden">
            <ScanLineOverlay className="z-0" />
            <Spotlight />

            {/* Header */}
            <div className="relative z-10 p-6 border-b border-gray-700/50">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-medium text-cyan-400">{moduleTitle}</span>
                            <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                                ADVANCED
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">{topic.title}</h1>
                    </div>
                    <SignalStrength strength={85} className="opacity-50" />
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mt-4">
                    {(['lesson', 'diagram', 'practice'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => {
                                audioService.playClickSound();
                                setActiveTab(tab);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 overflow-auto p-6">
                {content && (
                    <>
                        {activeTab === 'lesson' && (
                            <div className="space-y-6 animate-fade-in">
                                <TeacherVoicePanel text={content.explanation} />

                                <HolographicCard className="bg-gray-800/50 rounded-xl overflow-hidden">
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                            <svg className="w-6 h-6 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Lesson Content
                                        </h2>
                                        <div
                                            className="prose prose-invert prose-cyan max-w-none"
                                            dangerouslySetInnerHTML={{ __html: content.explanation.replace(/\n/g, '<br />') }}
                                        />
                                    </div>
                                </HolographicCard>

                                {/* Visualization section */}
                                {showVisualizer && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <NeonBorder color="cyan" className="h-48">
                                            <div className="h-full bg-gray-900/90 rounded-xl p-4">
                                                <h3 className="text-sm font-medium text-gray-400 mb-2">Network Flow</h3>
                                                <NetworkFlowVisualization />
                                            </div>
                                        </NeonBorder>
                                        <NeonBorder color="purple" className="h-48">
                                            <div className="h-full bg-gray-900/90 rounded-xl p-4">
                                                <h3 className="text-sm font-medium text-gray-400 mb-2">Threat Monitor</h3>
                                                <ThreatVisualization threats={3} />
                                            </div>
                                        </NeonBorder>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'diagram' && (
                            <div className="h-full animate-fade-in">
                                <HolographicCard className="h-full bg-gray-800/50 rounded-xl overflow-hidden">
                                    <DiagramViewer diagram={content.diagram} className="h-full" />
                                </HolographicCard>
                            </div>
                        )}

                        {activeTab === 'practice' && (
                            <div className="space-y-6 animate-fade-in">
                                <HolographicCard className="bg-gray-800/50 rounded-xl p-6">
                                    <h2 className="text-xl font-bold text-white mb-4">Interactive Practice</h2>
                                    <div className="space-y-4">
                                        <EncryptionFlow />
                                        <AuthenticationFlow />
                                        <ProtocolStack />
                                    </div>
                                </HolographicCard>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ImmersiveLesson;
