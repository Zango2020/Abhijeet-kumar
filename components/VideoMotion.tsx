import React, { useEffect, useRef, useState } from 'react';

// ============================================
// NETWORK FLOW VISUALIZATION
// ============================================
export const NetworkFlowVisualization: React.FC<{ className?: string }> = ({ className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
            ctx.scale(2, 2);
        };
        resize();

        // Network nodes
        const nodes: { x: number; y: number; vx: number; vy: number; type: string }[] = [];
        const nodeCount = 15;
        const nodeTypes = ['gNB', 'AMF', 'SMF', 'UPF', 'UE', 'Core'];

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.offsetWidth,
                y: Math.random() * canvas.offsetHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)]
            });
        }

        // Data packets
        const packets: { x: number; y: number; targetNode: number; progress: number; color: string }[] = [];

        const addPacket = () => {
            if (packets.length < 20 && Math.random() > 0.95) {
                const startNode = Math.floor(Math.random() * nodeCount);
                let targetNode = Math.floor(Math.random() * nodeCount);
                while (targetNode === startNode) targetNode = Math.floor(Math.random() * nodeCount);

                packets.push({
                    x: nodes[startNode].x,
                    y: nodes[startNode].y,
                    targetNode,
                    progress: 0,
                    color: Math.random() > 0.8 ? '#ef4444' : '#22d3ee'
                });
            }
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
            ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

            // Draw connections
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
            ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Update and draw nodes
            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 20 || node.x > canvas.offsetWidth - 20) node.vx *= -1;
                if (node.y < 20 || node.y > canvas.offsetHeight - 20) node.vy *= -1;

                // Draw node
                ctx.beginPath();
                ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
                ctx.fillStyle = '#0891b2';
                ctx.fill();
                ctx.strokeStyle = '#22d3ee';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw label
                ctx.fillStyle = '#67e8f9';
                ctx.font = '10px system-ui';
                ctx.textAlign = 'center';
                ctx.fillText(node.type, node.x, node.y + 20);
            });

            // Update and draw packets
            for (let i = packets.length - 1; i >= 0; i--) {
                const p = packets[i];
                const target = nodes[p.targetNode];
                const dx = target.x - p.x;
                const dy = target.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 5) {
                    packets.splice(i, 1);
                    continue;
                }

                p.x += (dx / dist) * 3;
                p.y += (dy / dist) * 3;

                // Draw packet
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Trail effect
                ctx.beginPath();
                ctx.arc(p.x - (dx / dist) * 10, p.y - (dy / dist) * 10, 2, 0, Math.PI * 2);
                ctx.fillStyle = p.color + '44';
                ctx.fill();
            }

            addPacket();
            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);
        window.addEventListener('resize', resize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${className || ''}`}
            style={{ background: 'transparent' }}
        />
    );
};

// ============================================
// SECURITY THREAT VISUALIZATION
// ============================================
export const ThreatVisualization: React.FC<{ threats?: number; className?: string }> = ({
    threats = 5,
    className
}) => {
    const [activeThreats, setActiveThreats] = useState<{ id: number; x: number; y: number; type: string }[]>([]);
    const threatTypes = ['MITM', 'DDoS', 'Rogue', 'Sniff', 'Spoof'];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveThreats(prev => {
                const newThreats = [...prev];

                // Add new threat
                if (newThreats.length < threats && Math.random() > 0.7) {
                    newThreats.push({
                        id: Date.now(),
                        x: Math.random() * 80 + 10,
                        y: Math.random() * 80 + 10,
                        type: threatTypes[Math.floor(Math.random() * threatTypes.length)]
                    });
                }

                // Remove old threats
                if (newThreats.length > 0 && Math.random() > 0.8) {
                    newThreats.shift();
                }

                return newThreats;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [threats]);

    return (
        <div className={`relative w-full h-full ${className || ''}`}>
            {/* Shield in center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-24 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center animate-pulse">
                    <svg className="w-12 h-12 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            {/* Threat indicators */}
            {activeThreats.map(threat => (
                <div
                    key={threat.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-threat-pulse"
                    style={{ left: `${threat.x}%`, top: `${threat.y}%` }}
                >
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-red-400 whitespace-nowrap">
                            {threat.type}
                        </span>
                        {/* Attack line to center */}
                        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                            <line
                                x1="16"
                                y1="16"
                                x2={`calc(50vw - ${threat.x}vw)`}
                                y2={`calc(50vh - ${threat.y}vh)`}
                                stroke="#ef444466"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                className="animate-dash"
                            />
                        </svg>
                    </div>
                </div>
            ))}

            <style>{`
                @keyframes threat-pulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
                }
                .animate-threat-pulse {
                    animation: threat-pulse 1s ease-in-out infinite;
                }
                @keyframes dash {
                    to { stroke-dashoffset: -8; }
                }
                .animate-dash {
                    animation: dash 0.5s linear infinite;
                }
            `}</style>
        </div>
    );
};

// ============================================
// ENCRYPTION FLOW ANIMATION
// ============================================
export const EncryptionFlow: React.FC<{ className?: string }> = ({ className }) => {
    const [stage, setStage] = useState(0);
    const stages = ['Plaintext', 'Key Generation', 'Encryption', 'Ciphertext', 'Transmission', 'Decryption'];

    useEffect(() => {
        const interval = setInterval(() => {
            setStage(prev => (prev + 1) % stages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex items-center justify-between p-4 ${className || ''}`}>
            {stages.map((s, i) => (
                <React.Fragment key={s}>
                    <div className={`flex flex-col items-center transition-all duration-500 ${i <= stage ? 'opacity-100 scale-100' : 'opacity-30 scale-90'}`}>
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${i === stage ? 'bg-cyan-500 animate-pulse' : i < stage ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                            {i === 0 && <span className="text-lg">Aa</span>}
                            {i === 1 && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" /></svg>}
                            {i === 2 && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>}
                            {i === 3 && <span className="text-lg font-mono">@#$</span>}
                            {i === 4 && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>}
                            {i === 5 && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" /></svg>}
                        </div>
                        <span className="mt-2 text-xs text-center">{s}</span>
                    </div>
                    {i < stages.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${i < stage ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                            {i === stage - 1 && (
                                <div className="h-full bg-cyan-400 animate-flow" style={{ width: '100%' }} />
                            )}
                        </div>
                    )}
                </React.Fragment>
            ))}
            <style>{`
                @keyframes flow {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(0); }
                }
                .animate-flow {
                    animation: flow 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

// ============================================
// PROTOCOL STACK VISUALIZATION
// ============================================
export const ProtocolStack: React.FC<{ className?: string }> = ({ className }) => {
    const layers = [
        { name: 'Application', color: '#a855f7', protocols: ['HTTP/3', 'SIP', 'DIAMETER'] },
        { name: 'Transport', color: '#3b82f6', protocols: ['SCTP', 'TCP', 'UDP'] },
        { name: 'Network', color: '#22c55e', protocols: ['GTP-U', 'IPsec', 'IPv6'] },
        { name: 'Data Link', color: '#eab308', protocols: ['PDCP', 'RLC', 'MAC'] },
        { name: 'Physical', color: '#ef4444', protocols: ['NR', 'OFDM', 'MIMO'] }
    ];
    const [activeLayer, setActiveLayer] = useState(-1);

    return (
        <div className={`flex flex-col space-y-2 ${className || ''}`}>
            {layers.map((layer, i) => (
                <div
                    key={layer.name}
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setActiveLayer(i)}
                    onMouseLeave={() => setActiveLayer(-1)}
                >
                    <div
                        className={`p-4 rounded-lg transition-all duration-300 ${activeLayer === i ? 'scale-105 shadow-lg' : ''}`}
                        style={{
                            backgroundColor: `${layer.color}20`,
                            borderLeft: `4px solid ${layer.color}`
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold" style={{ color: layer.color }}>{layer.name}</span>
                            <div className="flex space-x-2">
                                {layer.protocols.map(p => (
                                    <span key={p} className="px-2 py-1 text-xs bg-gray-800 rounded">{p}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Data flow indicator */}
                    {activeLayer === i && (
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                            <div className="flex items-center space-x-1">
                                {[0, 1, 2].map(j => (
                                    <div
                                        key={j}
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            backgroundColor: layer.color,
                                            animation: `ping 1s ease-in-out infinite`,
                                            animationDelay: `${j * 0.2}s`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// ============================================
// SIGNAL STRENGTH INDICATOR
// ============================================
export const SignalStrength: React.FC<{
    strength: number; // 0-100
    className?: string;
}> = ({ strength, className }) => {
    const bars = 5;
    const activeBars = Math.ceil((strength / 100) * bars);

    return (
        <div className={`flex items-end space-x-1 ${className || ''}`}>
            {Array.from({ length: bars }).map((_, i) => (
                <div
                    key={i}
                    className={`w-3 rounded-sm transition-all duration-300 ${i < activeBars ? 'bg-cyan-400' : 'bg-gray-700'}`}
                    style={{
                        height: `${(i + 1) * 6}px`,
                        opacity: i < activeBars ? 1 : 0.3,
                        animation: i < activeBars ? `pulse 1.5s ease-in-out infinite` : undefined,
                        animationDelay: `${i * 0.1}s`
                    }}
                />
            ))}
        </div>
    );
};

// ============================================
// AUTHENTICATION FLOW
// ============================================
export const AuthenticationFlow: React.FC<{ className?: string }> = ({ className }) => {
    const [step, setStep] = useState(0);
    const steps = [
        { label: 'UE', icon: '📱' },
        { label: 'gNB', icon: '📡' },
        { label: 'AMF', icon: '🔐' },
        { label: 'AUSF', icon: '🛡️' },
        { label: 'UDM', icon: '🗄️' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prev => (prev + 1) % (steps.length * 2));
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const direction = step < steps.length ? 'right' : 'left';
    const activeIndex = step < steps.length ? step : steps.length * 2 - step - 1;

    return (
        <div className={`relative py-8 ${className || ''}`}>
            <div className="flex items-center justify-between">
                {steps.map((s, i) => (
                    <div key={s.label} className="flex flex-col items-center z-10">
                        <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${i === activeIndex ? 'bg-cyan-500 scale-110 shadow-lg shadow-cyan-500/50' : 'bg-gray-800'}`}
                        >
                            {s.icon}
                        </div>
                        <span className="mt-2 text-sm font-medium">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Connection line */}
            <div className="absolute top-12 left-8 right-8 h-0.5 bg-gray-700">
                <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{
                        width: `${(activeIndex / (steps.length - 1)) * 100}%`,
                        marginLeft: direction === 'left' ? 'auto' : 0
                    }}
                />
            </div>

            {/* Moving packet */}
            <div
                className="absolute top-10 w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 transition-all duration-300"
                style={{
                    left: `calc(${(activeIndex / (steps.length - 1)) * 100}% + 24px)`,
                    transform: 'translateX(-50%)'
                }}
            />
        </div>
    );
};
