
import React from 'react';

export const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            {/* Cyber Shield Loading Animation */}
            <div className="relative w-24 h-28">
                {/* Shield outline with animation */}
                <svg viewBox="0 0 100 120" className="w-full h-full animate-pulse-glow">
                    <defs>
                        <linearGradient id="loadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="50%" stopColor="#0891b2" />
                            <stop offset="100%" stopColor="#0e7490" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M50 5 L95 20 L95 55 C95 85 70 105 50 115 C30 105 5 85 5 55 L5 20 Z"
                        fill="rgba(6, 182, 212, 0.1)"
                        stroke="url(#loadGradient)"
                        strokeWidth="2"
                    />
                    <text
                        x="50"
                        y="55"
                        textAnchor="middle"
                        fill="#06b6d4"
                        fontSize="24"
                        fontWeight="bold"
                        fontFamily="system-ui, sans-serif"
                    >
                        5G
                    </text>
                </svg>

                {/* Spinning ring around shield */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
                </div>

                {/* Orbiting particles */}
                <div className="absolute inset-0 animate-rotate-slow">
                    <div className="absolute top-2 left-1/2 w-2 h-2 -ml-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                </div>
                <div className="absolute inset-0 animate-rotate-slow" style={{ animationDelay: '-10s', animationDirection: 'reverse' }}>
                    <div className="absolute bottom-4 right-2 w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/50" />
                </div>
            </div>

            {/* Loading text */}
            <div className="mt-6 text-center">
                <p className="text-lg font-semibold text-white mb-1">Generating Secure Content</p>
                <p className="text-sm text-gray-400">AI is preparing your lesson...</p>
            </div>

            {/* Progress bar */}
            <div className="mt-4 w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-600 rounded-full"
                    style={{
                        animation: 'progress-indeterminate 1.5s ease-in-out infinite',
                        backgroundSize: '200% 100%',
                    }}
                />
            </div>

            <style>{`
                @keyframes progress-indeterminate {
                    0% {
                        transform: translateX(-100%);
                        width: 40%;
                    }
                    50% {
                        transform: translateX(50%);
                        width: 60%;
                    }
                    100% {
                        transform: translateX(250%);
                        width: 40%;
                    }
                }
            `}</style>
        </div>
    );
};
