import React, { useState, useEffect, useCallback } from 'react';
import { ttsService, TTSState } from '../services/ttsService';

interface TTSControlsProps {
    text: string;
    className?: string;
}

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
    </svg>
);

export const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
    </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
    </svg>
);

export const SkipForwardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v6.622c0 1.44 1.555 2.343 2.805 1.628L12 12.558V8.69c0-1.44-1.555-2.343-2.805-1.628l-4.14 2.395ZM14.055 7.06c-1.25-.713-2.805.19-2.805 1.63v6.622c0 1.44 1.555 2.343 2.805 1.628l4.14-2.395c1.25-.713 1.25-2.544 0-3.257l-4.14-2.228Z" />
    </svg>
);

export const SkipBackwardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-6.945 3.968c-1.25.713-1.25 2.544 0 3.257l6.945 3.153Z" />
    </svg>
);

export const VolumeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
        <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
    </svg>
);

export const SpeedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
    </svg>
);

export const TTSControls: React.FC<TTSControlsProps> = ({ text, className }) => {
    const [state, setState] = useState<TTSState>({
        isPlaying: false,
        isPaused: false,
        currentSentence: 0,
        totalSentences: 0,
        voice: null,
        rate: 0.9,
        pitch: 1.0
    });
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [showSettings, setShowSettings] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        setIsSupported(ttsService.isSupported());

        if (ttsService.isSupported()) {
            // Load voices
            const loadVoices = () => {
                const availableVoices = ttsService.getAllVoices();
                setVoices(availableVoices);
                if (availableVoices.length > 0 && !state.voice) {
                    const preferredVoice = availableVoices.find(v =>
                        v.name.includes('Google') || v.name.includes('Natural')
                    ) || availableVoices[0];
                    ttsService.setVoice(preferredVoice);
                    setState(prev => ({ ...prev, voice: preferredVoice }));
                }
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;

            ttsService.setOnStateChange((newState) => {
                setState(prev => ({ ...prev, ...newState }));
            });
        }

        return () => {
            ttsService.stop();
        };
    }, []);

    const handlePlay = useCallback(() => {
        if (state.isPaused) {
            ttsService.resume();
        } else if (!state.isPlaying) {
            ttsService.speak(text);
        }
    }, [text, state.isPaused, state.isPlaying]);

    const handlePause = useCallback(() => {
        ttsService.pause();
    }, []);

    const handleStop = useCallback(() => {
        ttsService.stop();
    }, []);

    const handleSkipForward = useCallback(() => {
        ttsService.skipForward();
    }, []);

    const handleSkipBackward = useCallback(() => {
        ttsService.skipBackward();
    }, []);

    const handleVoiceChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const voice = voices.find(v => v.name === e.target.value);
        if (voice) {
            ttsService.setVoice(voice);
            setState(prev => ({ ...prev, voice }));
        }
    }, [voices]);

    const handleRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const rate = parseFloat(e.target.value);
        ttsService.setRate(rate);
        setState(prev => ({ ...prev, rate }));
    }, []);

    if (!isSupported) {
        return null;
    }

    const progress = state.totalSentences > 0
        ? (state.currentSentence / state.totalSentences) * 100
        : 0;

    return (
        <div className={`bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 ${className}`}>
            {/* Header with teacher icon */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center animate-pulse-subtle">
                        <VolumeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white">AI Teacher Voice</h4>
                        <p className="text-xs text-gray-400">
                            {state.isPlaying
                                ? `Reading ${state.currentSentence + 1} of ${state.totalSentences}`
                                : 'Click play to listen'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                    title="Voice Settings"
                >
                    <SpeedIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-gray-700 rounded-full mb-4 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full transition-all duration-300 relative"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                </div>
            </div>

            {/* Main controls */}
            <div className="flex items-center justify-center space-x-3">
                <button
                    onClick={handleSkipBackward}
                    disabled={!state.isPlaying}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110"
                    title="Previous Sentence"
                >
                    <SkipBackwardIcon className="w-6 h-6" />
                </button>

                <button
                    onClick={state.isPlaying && !state.isPaused ? handlePause : handlePlay}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all hover:scale-105 active:scale-95"
                    title={state.isPlaying && !state.isPaused ? 'Pause' : 'Play'}
                >
                    {state.isPlaying && !state.isPaused ? (
                        <PauseIcon className="w-7 h-7" />
                    ) : (
                        <PlayIcon className="w-7 h-7 ml-1" />
                    )}
                </button>

                <button
                    onClick={handleStop}
                    disabled={!state.isPlaying}
                    className="p-2 text-gray-400 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110"
                    title="Stop"
                >
                    <StopIcon className="w-6 h-6" />
                </button>

                <button
                    onClick={handleSkipForward}
                    disabled={!state.isPlaying}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110"
                    title="Next Sentence"
                >
                    <SkipForwardIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Settings panel */}
            {showSettings && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-4 animate-fade-in">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Voice</label>
                        <select
                            value={state.voice?.name || ''}
                            onChange={handleVoiceChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                        >
                            {voices.map(voice => (
                                <option key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">
                            Speed: {state.rate.toFixed(1)}x
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={state.rate}
                            onChange={handleRateChange}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>
                </div>
            )}

            {/* Waveform visualization when playing */}
            {state.isPlaying && (
                <div className="mt-4 flex items-center justify-center space-x-1">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-cyan-400 rounded-full animate-waveform"
                            style={{
                                animationDelay: `${i * 0.1}s`,
                                height: `${Math.random() * 20 + 10}px`
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TTSControls;
