import React, { useEffect, useRef, useState } from 'react';

// ============================================
// MATRIX RAIN EFFECT
// ============================================
export const MatrixRain: React.FC<{ className?: string; density?: number }> = ({
    className,
    density = 30
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン5G';
        const charArray = chars.split('');
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops: number[] = Array(columns).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(17, 24, 39, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#06b6d4';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = charArray[Math.floor(Math.random() * charArray.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Gradient effect - brighter at the head
                const gradient = ctx.createLinearGradient(x, y - 50, x, y);
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.8, '#0891b2');
                gradient.addColorStop(1, '#22d3ee');
                ctx.fillStyle = gradient;

                ctx.fillText(char, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resize);
        };
    }, [density]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-none ${className || ''}`}
            style={{ opacity: 0.3 }}
        />
    );
};

// ============================================
// GLITCH TEXT EFFECT
// ============================================
export const GlitchText: React.FC<{
    text: string;
    className?: string;
    intensity?: 'low' | 'medium' | 'high';
}> = ({ text, className, intensity = 'medium' }) => {
    const intensityMap = {
        low: { duration: '4s', offset: '2px' },
        medium: { duration: '2s', offset: '4px' },
        high: { duration: '1s', offset: '6px' }
    };
    const { duration, offset } = intensityMap[intensity];

    return (
        <div className={`relative inline-block ${className}`}>
            <span className="relative z-10">{text}</span>
            <span
                className="absolute top-0 left-0 text-cyan-400 opacity-70"
                style={{
                    clipPath: 'inset(0 0 50% 0)',
                    animation: `glitch-top ${duration} infinite linear alternate-reverse`,
                    transform: `translate(${offset}, -${offset})`
                }}
            >
                {text}
            </span>
            <span
                className="absolute top-0 left-0 text-red-400 opacity-70"
                style={{
                    clipPath: 'inset(50% 0 0 0)',
                    animation: `glitch-bottom ${duration} infinite linear alternate-reverse`,
                    transform: `translate(-${offset}, ${offset})`
                }}
            >
                {text}
            </span>
            <style>{`
                @keyframes glitch-top {
                    0%, 100% { transform: translate(${offset}, -${offset}); }
                    20% { transform: translate(-${offset}, ${offset}); }
                    40% { transform: translate(${offset}, ${offset}); }
                    60% { transform: translate(-${offset}, -${offset}); }
                    80% { transform: translate(${offset}, 0); }
                }
                @keyframes glitch-bottom {
                    0%, 100% { transform: translate(-${offset}, ${offset}); }
                    20% { transform: translate(${offset}, -${offset}); }
                    40% { transform: translate(-${offset}, -${offset}); }
                    60% { transform: translate(${offset}, ${offset}); }
                    80% { transform: translate(-${offset}, 0); }
                }
            `}</style>
        </div>
    );
};

// ============================================
// CYBER SCAN LINE EFFECT
// ============================================
export const ScanLineOverlay: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className || ''}`}>
            {/* Moving scan line */}
            <div
                className="absolute left-0 w-full h-32 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"
                style={{
                    animation: 'scanMove 4s linear infinite'
                }}
            />
            {/* Static scan lines */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.03) 2px, rgba(6, 182, 212, 0.03) 4px)',
                    pointerEvents: 'none'
                }}
            />
            <style>{`
                @keyframes scanMove {
                    0% { top: -100%; }
                    100% { top: 100%; }
                }
            `}</style>
        </div>
    );
};

// ============================================
// HOLOGRAPHIC CARD EFFECT
// ============================================
export const HolographicCard: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setRotation({
            x: (y - 0.5) * 20,
            y: (x - 0.5) * -20
        });
        setGlare({ x: x * 100, y: y * 100 });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setGlare({ x: 50, y: 50 });
    };

    return (
        <div
            ref={cardRef}
            className={`relative transform-gpu transition-transform duration-200 ${className || ''}`}
            style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Holographic gradient overlay */}
            <div
                className="absolute inset-0 rounded-xl opacity-30 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(103, 232, 249, 0.4), transparent 50%)`,
                    mixBlendMode: 'overlay'
                }}
            />
            {/* Rainbow gradient */}
            <div
                className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
                style={{
                    background: `linear-gradient(${glare.x * 3.6}deg, #ff0080, #ff8c00, #40e0d0, #8a2be2, #ff0080)`,
                    mixBlendMode: 'color-dodge'
                }}
            />
            {children}
        </div>
    );
};

// ============================================
// ANIMATED COUNTER
// ============================================
export const AnimatedCounter: React.FC<{
    value: number;
    duration?: number;
    className?: string;
    prefix?: string;
    suffix?: string;
}> = ({ value, duration = 2000, className, prefix = '', suffix = '' }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const startTime = useRef<number>(0);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        startTime.current = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime.current;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            setDisplayValue(Math.floor(eased * value));

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };
        animate();
        return () => cancelAnimationFrame(animationRef.current);
    }, [value, duration]);

    return (
        <span className={`tabular-nums ${className || ''}`}>
            {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
    );
};

// ============================================
// TYPING ANIMATION
// ============================================
export const TypingText: React.FC<{
    text: string;
    speed?: number;
    className?: string;
    onComplete?: () => void;
}> = ({ text, speed = 50, className, onComplete }) => {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayText('');
        setIsComplete(false);
        let index = 0;

        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayText(text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(timer);
                setIsComplete(true);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed, onComplete]);

    return (
        <span className={className}>
            {displayText}
            {!isComplete && <span className="animate-pulse text-cyan-400">|</span>}
        </span>
    );
};

// ============================================
// PULSE RING EFFECT
// ============================================
export const PulseRings: React.FC<{
    count?: number;
    color?: string;
    className?: string;
}> = ({ count = 3, color = '#06b6d4', className }) => {
    return (
        <div className={`relative ${className || ''}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 opacity-0"
                    style={{
                        borderColor: color,
                        animation: `pulseRing 2s ease-out infinite`,
                        animationDelay: `${i * (2 / count)}s`
                    }}
                />
            ))}
            <style>{`
                @keyframes pulseRing {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

// ============================================
// FLOATING PARTICLES
// ============================================
export const FloatingParticles: React.FC<{
    count?: number;
    className?: string;
}> = ({ count = 20, className }) => {
    const particles = Array.from({ length: count }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5
    }));

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className || ''}`}>
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-cyan-400"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        bottom: '-20px',
                        opacity: 0.6,
                        boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)',
                        animation: `floatUp ${p.duration}s ease-in-out infinite`,
                        animationDelay: `${p.delay}s`
                    }}
                />
            ))}
            <style>{`
                @keyframes floatUp {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.6; }
                    90% { opacity: 0.6; }
                    100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

// ============================================
// NEON BORDER EFFECT
// ============================================
export const NeonBorder: React.FC<{
    children: React.ReactNode;
    className?: string;
    color?: 'cyan' | 'purple' | 'green' | 'red';
    animated?: boolean;
}> = ({ children, className, color = 'cyan', animated = true }) => {
    const colors = {
        cyan: { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)' },
        purple: { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)' },
        green: { primary: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)' },
        red: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' }
    };
    const { primary, glow } = colors[color];

    return (
        <div className={`relative ${className || ''}`}>
            <div
                className="absolute -inset-[1px] rounded-xl"
                style={{
                    background: `linear-gradient(90deg, ${primary}, transparent, ${primary})`,
                    backgroundSize: '200% 100%',
                    animation: animated ? 'neonMove 3s linear infinite' : undefined,
                    filter: `blur(1px)`
                }}
            />
            <div
                className="absolute -inset-[2px] rounded-xl opacity-50"
                style={{
                    background: glow,
                    filter: 'blur(8px)'
                }}
            />
            <div className="relative bg-gray-900 rounded-xl">
                {children}
            </div>
            <style>{`
                @keyframes neonMove {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
            `}</style>
        </div>
    );
};

// ============================================
// 3D FLIP CARD
// ============================================
export const FlipCard: React.FC<{
    front: React.ReactNode;
    back: React.ReactNode;
    className?: string;
}> = ({ front, back, className }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={`relative cursor-pointer ${className || ''}`}
            style={{ perspective: '1000px' }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div
                className="relative w-full h-full transition-transform duration-700"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
            >
                {/* Front */}
                <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {front}
                </div>
                {/* Back */}
                <div
                    className="absolute inset-0"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    {back}
                </div>
            </div>
        </div>
    );
};

// ============================================
// WAVE ANIMATION
// ============================================
export const WaveBackground: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className || ''}`}>
            <svg
                className="absolute bottom-0 w-full"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#0891b2" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                    </linearGradient>
                </defs>
                <path
                    fill="url(#waveGrad)"
                    d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    style={{ animation: 'wave 8s ease-in-out infinite' }}
                />
                <path
                    fill="url(#waveGrad)"
                    d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    style={{ animation: 'wave 6s ease-in-out infinite reverse', opacity: 0.5 }}
                />
            </svg>
            <style>{`
                @keyframes wave {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(-25px); }
                }
            `}</style>
        </div>
    );
};

// ============================================
// SPOTLIGHT EFFECT
// ============================================
export const Spotlight: React.FC<{ className?: string }> = ({ className }) => {
    const [position, setPosition] = useState({ x: 50, y: 50 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className || ''}`}
            style={{
                background: `radial-gradient(circle at ${position.x}% ${position.y}%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)`,
                transition: 'background 0.3s ease-out'
            }}
        />
    );
};
