
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ImmersiveLesson } from './components/ImmersiveLesson';
import { COURSE_OUTLINE, COURSE_META } from './constants';
import type { Topic, GeneratedContent, Module, TopicHistoryItem } from './types';
import { generate5GSecurityExplanation } from './services/geminiService';
import { audioService } from './services/audioService';
import { GlitchText, AnimatedCounter } from './components/AdvancedAnimations';

// Custom 5G Shield Logo with animation
const AnimatedLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 60 70" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4">
                    <animate attributeName="stop-color" values="#06b6d4;#22d3ee;#06b6d4" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#0891b2">
                    <animate attributeName="stop-color" values="#0891b2;#06b6d4;#0891b2" dur="3s" repeatCount="indefinite" />
                </stop>
            </linearGradient>
            <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <path
            d="M30 3 L57 15 L57 35 C57 55 42 67 30 72 C18 67 3 55 3 35 L3 15 Z"
            fill="url(#logoGrad)"
            stroke="#67e8f9"
            strokeWidth="1.5"
            filter="url(#logoGlow)"
        />
        <text
            x="30"
            y="40"
            textAnchor="middle"
            fill="white"
            fontSize="18"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
        >
            5G
        </text>
        {/* Animated pulse ring */}
        <circle cx="30" cy="52" r="6" fill="none" stroke="#22d3ee" strokeWidth="1">
            <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="30" cy="52" r="3" fill="#22d3ee">
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
        </circle>
    </svg>
);

// Status indicator component
const StatusIndicator: React.FC<{ status: 'online' | 'loading' | 'error'; label: string }> = ({ status, label }) => {
    const colors = {
        online: 'bg-green-400',
        loading: 'bg-yellow-400',
        error: 'bg-red-400'
    };

    return (
        <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${colors[status]} ${status === 'loading' ? 'animate-pulse' : 'animate-pulse-subtle'}`} />
            <span className="text-xs text-gray-500">{label}</span>
        </div>
    );
};

const App: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [moduleTitle, setModuleTitle] = useState<string | null>(null);
    const [content, setContent] = useState<GeneratedContent | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<TopicHistoryItem[]>([]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('5g-security-course-history');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to parse history from localStorage", e);
            setHistory([]);
        }
    }, []);

    const handleTopicSelect = useCallback((topic: Topic, module: Module) => {
        audioService.playClickSound();
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
                localStorage.setItem('5g-security-course-history', JSON.stringify(updatedHistory));
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
                const result = await generate5GSecurityExplanation(selectedTopic, moduleTitle);
                setContent(result);
                audioService.playSuccessSound();
            } catch (err) {
                console.error("Error generating content:", err);
                setError("Failed to generate content. Please check your API key and try again.");
                audioService.playErrorSound();
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, [selectedTopic, moduleTitle]);

    // Calculate progress
    const totalTopics = COURSE_OUTLINE.reduce((sum, m) => sum + m.topics.length, 0);
    const completedTopics = history.length;
    const progressPercent = Math.round((completedTopics / totalTopics) * 100);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-0' : 'w-80'}`}>
                <Sidebar
                    modules={COURSE_OUTLINE}
                    onTopicSelect={handleTopicSelect}
                    selectedTopic={selectedTopic}
                    history={history}
                    onHistorySelect={handleHistorySelect}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                </div>

                {/* Header */}
                <header className="relative z-10 bg-gray-800/70 backdrop-blur-xl border-b border-gray-700/50 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Sidebar toggle */}
                            <button
                                onClick={() => {
                                    audioService.playClickSound();
                                    setSidebarCollapsed(!sidebarCollapsed);
                                }}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <AnimatedLogo className="h-14 w-12" />

                            <div>
                                <div className="flex items-center space-x-3">
                                    <h1 className="text-xl font-bold text-white">{COURSE_META.title}</h1>
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                                        PRO v{COURSE_META.version}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400">{COURSE_META.subtitle}</p>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center space-x-6">
                            {/* Progress */}
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Course Progress</p>
                                    <p className="text-sm font-semibold text-white">
                                        <AnimatedCounter value={completedTopics} duration={500} /> / {totalTopics}
                                    </p>
                                </div>
                                <div className="w-32 h-2.5 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-purple-500 rounded-full transition-all duration-500 relative"
                                        style={{ width: `${progressPercent}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                                    </div>
                                </div>
                            </div>

                            {/* Certification badge */}
                            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 rounded-lg border border-cyan-500/20">
                                <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium text-cyan-400">{COURSE_META.certification}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Lesson Content */}
                <div className="relative z-10 flex-1 overflow-hidden">
                    <ImmersiveLesson
                        topic={selectedTopic}
                        moduleTitle={moduleTitle}
                        content={content}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>

                {/* Footer */}
                <footer className="relative z-10 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50 px-4 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-xs text-gray-500">
                            <span>{COURSE_META.totalModules} Modules</span>
                            <span>{COURSE_META.totalTopics} Topics</span>
                            <span>{COURSE_META.estimatedHours}h+ Content</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <StatusIndicator
                                status={isLoading ? 'loading' : error ? 'error' : 'online'}
                                label={isLoading ? 'Generating...' : error ? 'Error' : 'Gemini AI Ready'}
                            />
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default App;
