import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
}

interface CyberBackgroundProps {
    className?: string;
}

export const CyberBackground: React.FC<CyberBackgroundProps> = ({ className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);
    const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const colors = ['#06b6d4', '#22d3ee', '#67e8f9', '#0891b2', '#0e7490'];

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initParticles();
        };

        const initParticles = () => {
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            particlesRef.current = [];

            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        };

        const drawParticle = (p: Particle) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        };

        const drawConnections = () => {
            const particles = particlesRef.current;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = '#06b6d4';
                        ctx.globalAlpha = (1 - distance / 120) * 0.15;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }

                // Mouse interaction
                const mdx = particles[i].x - mouseRef.current.x;
                const mdy = particles[i].y - mouseRef.current.y;
                const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mouseDistance < 150 && mouseRef.current.x !== 0) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
                    ctx.strokeStyle = '#22d3ee';
                    ctx.globalAlpha = (1 - mouseDistance / 150) * 0.3;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw grid
            ctx.strokeStyle = '#1e3a5f';
            ctx.globalAlpha = 0.1;
            ctx.lineWidth = 0.5;

            const gridSize = 50;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;

            // Update and draw particles
            particlesRef.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                drawParticle(p);
            });

            drawConnections();

            animationRef.current = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: 0, y: 0 };
        };

        resize();
        window.addEventListener('resize', resize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-auto ${className || ''}`}
            style={{ zIndex: 0 }}
        />
    );
};

export const SecurityShield: React.FC<{ className?: string; animated?: boolean }> = ({
    className,
    animated = true
}) => {
    return (
        <svg
            viewBox="0 0 100 120"
            className={`${className} ${animated ? 'animate-pulse-glow' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#0891b2" />
                    <stop offset="100%" stopColor="#0e7490" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path
                d="M50 5 L95 20 L95 55 C95 85 70 105 50 115 C30 105 5 85 5 55 L5 20 Z"
                fill="url(#shieldGradient)"
                stroke="#67e8f9"
                strokeWidth="2"
                filter="url(#glow)"
            />
            <text
                x="50"
                y="65"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="32"
                fontWeight="bold"
                fontFamily="monospace"
            >
                5G
            </text>
            <path
                d="M35 80 L45 90 L65 70"
                stroke="#67e8f9"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
};

export const DataFlowAnimation: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`relative ${className}`}>
            <svg viewBox="0 0 200 60" className="w-full h-full">
                <defs>
                    <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
                <line x1="0" y1="30" x2="200" y2="30" stroke="#1e3a5f" strokeWidth="2" />
                <circle r="4" fill="#06b6d4" className="animate-data-flow">
                    <animateMotion dur="2s" repeatCount="indefinite">
                        <mpath xlinkHref="#flowPath" />
                    </animateMotion>
                </circle>
                <path id="flowPath" d="M0,30 L200,30" fill="none" />

                {/* Data packets */}
                {[0, 1, 2, 3, 4].map((i) => (
                    <rect
                        key={i}
                        width="8"
                        height="8"
                        fill="#22d3ee"
                        rx="1"
                        className="animate-data-packet"
                        style={{
                            animationDelay: `${i * 0.4}s`,
                            transform: `translateX(${i * 40}px) translateY(26px)`
                        }}
                    >
                        <animate
                            attributeName="x"
                            from="-10"
                            to="210"
                            dur="3s"
                            begin={`${i * 0.4}s`}
                            repeatCount="indefinite"
                        />
                    </rect>
                ))}
            </svg>
        </div>
    );
};

export const RadarScan: React.FC<{ className?: string; size?: number }> = ({
    className,
    size = 200
}) => {
    return (
        <svg
            viewBox="0 0 200 200"
            className={className}
            width={size}
            height={size}
        >
            <defs>
                <radialGradient id="radarGradient">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Radar circles */}
            {[80, 60, 40, 20].map((r, i) => (
                <circle
                    key={i}
                    cx="100"
                    cy="100"
                    r={r}
                    fill="none"
                    stroke="#0e7490"
                    strokeWidth="1"
                    opacity="0.3"
                />
            ))}

            {/* Cross lines */}
            <line x1="100" y1="20" x2="100" y2="180" stroke="#0e7490" strokeWidth="1" opacity="0.3" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="#0e7490" strokeWidth="1" opacity="0.3" />

            {/* Scanning beam */}
            <path
                d="M100,100 L100,20 A80,80 0 0,1 180,100 Z"
                fill="url(#radarGradient)"
                className="animate-radar-scan"
                style={{ transformOrigin: '100px 100px' }}
            />

            {/* Center dot */}
            <circle cx="100" cy="100" r="4" fill="#22d3ee" className="animate-pulse" />

            {/* Blips */}
            <circle cx="130" cy="70" r="3" fill="#22d3ee" className="animate-blip" style={{ animationDelay: '0.5s' }} />
            <circle cx="75" cy="120" r="3" fill="#22d3ee" className="animate-blip" style={{ animationDelay: '1s' }} />
            <circle cx="140" cy="130" r="3" fill="#ef4444" className="animate-blip" style={{ animationDelay: '1.5s' }} />
        </svg>
    );
};

export const EncryptionLock: React.FC<{ className?: string; locked?: boolean }> = ({
    className,
    locked = true
}) => {
    return (
        <svg viewBox="0 0 60 80" className={className}>
            <defs>
                <linearGradient id="lockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
            </defs>

            {/* Lock body */}
            <rect
                x="5"
                y="35"
                width="50"
                height="40"
                rx="5"
                fill="url(#lockGradient)"
                className={locked ? '' : 'animate-pulse'}
            />

            {/* Shackle */}
            <path
                d={locked
                    ? "M15,35 L15,20 A15,15 0 0,1 45,20 L45,35"
                    : "M15,35 L15,20 A15,15 0 0,1 45,20 L45,15"
                }
                fill="none"
                stroke="#67e8f9"
                strokeWidth="6"
                strokeLinecap="round"
                className={locked ? '' : 'animate-bounce-subtle'}
            />

            {/* Keyhole */}
            <circle cx="30" cy="52" r="6" fill="#0e7490" />
            <rect x="27" y="52" width="6" height="12" fill="#0e7490" />

            {/* Status indicator */}
            <circle
                cx="30"
                cy="52"
                r="3"
                fill={locked ? "#22c55e" : "#ef4444"}
                className="animate-pulse"
            />
        </svg>
    );
};
