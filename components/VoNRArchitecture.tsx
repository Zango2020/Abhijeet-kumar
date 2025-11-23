import React, { useState, useEffect, useCallback } from 'react';

interface ComponentInfo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  functions: string[];
  color: string;
}

const VONR_COMPONENTS: ComponentInfo[] = [
  {
    id: 'ue',
    name: 'UE',
    fullName: 'User Equipment',
    description: '5G-capable device with IMS client supporting VoNR',
    functions: ['VoNR call origination/termination', 'SIP signaling', 'RTP media handling', 'QoS bearer management'],
    color: '#22d3ee' // cyan-400
  },
  {
    id: 'gnb',
    name: 'gNB',
    fullName: 'gNodeB (5G Base Station)',
    description: 'Next-generation base station providing 5G NR air interface',
    functions: ['Radio resource management', 'QoS flow mapping', 'Dual connectivity', 'Beamforming & MIMO'],
    color: '#a78bfa' // violet-400
  },
  {
    id: 'amf',
    name: 'AMF',
    fullName: 'Access and Mobility Management Function',
    description: 'Handles registration, connection, and mobility management',
    functions: ['NAS signaling', 'Registration management', 'Connection management', 'Mobility management'],
    color: '#4ade80' // green-400
  },
  {
    id: 'smf',
    name: 'SMF',
    fullName: 'Session Management Function',
    description: 'Manages PDU sessions and QoS policies',
    functions: ['PDU session establishment', 'QoS flow management', 'IP address allocation', 'Policy enforcement'],
    color: '#fb923c' // orange-400
  },
  {
    id: 'upf',
    name: 'UPF',
    fullName: 'User Plane Function',
    description: 'Handles user plane packet routing and forwarding',
    functions: ['Packet routing', 'QoS enforcement', 'Traffic measurement', 'Lawful interception'],
    color: '#f472b6' // pink-400
  },
  {
    id: 'pcf',
    name: 'PCF',
    fullName: 'Policy Control Function',
    description: 'Provides policy rules for network behavior',
    functions: ['Policy decisions', 'Access control', 'QoS policy management', 'Spending limits'],
    color: '#facc15' // yellow-400
  },
  {
    id: 'ims',
    name: 'IMS',
    fullName: 'IP Multimedia Subsystem',
    description: 'Core network for VoNR call control and media',
    functions: ['SIP registration', 'Call routing', 'Supplementary services', 'Emergency calls'],
    color: '#60a5fa' // blue-400
  },
  {
    id: 'pcscf',
    name: 'P-CSCF',
    fullName: 'Proxy Call Session Control Function',
    description: 'First point of contact for UE in IMS network',
    functions: ['SIP proxy', 'Security gateway', 'QoS reservation', 'Emergency call detection'],
    color: '#34d399' // emerald-400
  },
  {
    id: 'icscf',
    name: 'I-CSCF',
    fullName: 'Interrogating CSCF',
    description: 'Entry point for incoming calls and registration',
    functions: ['S-CSCF selection', 'HSS query', 'Call routing', 'Topology hiding'],
    color: '#c084fc' // purple-400
  },
  {
    id: 'scscf',
    name: 'S-CSCF',
    fullName: 'Serving CSCF',
    description: 'Central node handling SIP registration and session control',
    functions: ['SIP registration', 'Session control', 'Service triggering', 'Routing decisions'],
    color: '#f87171' // red-400
  }
];

interface SignalPath {
  id: string;
  name: string;
  description: string;
  path: { from: string; to: string }[];
  color: string;
}

const SIGNAL_FLOWS: SignalPath[] = [
  {
    id: 'registration',
    name: 'IMS Registration',
    description: 'UE registers with IMS network for VoNR service',
    path: [
      { from: 'ue', to: 'gnb' },
      { from: 'gnb', to: 'amf' },
      { from: 'amf', to: 'smf' },
      { from: 'smf', to: 'upf' },
      { from: 'upf', to: 'pcscf' },
      { from: 'pcscf', to: 'icscf' },
      { from: 'icscf', to: 'scscf' }
    ],
    color: '#22d3ee'
  },
  {
    id: 'call_setup',
    name: 'VoNR Call Setup',
    description: 'SIP INVITE flow for establishing voice call',
    path: [
      { from: 'ue', to: 'gnb' },
      { from: 'gnb', to: 'upf' },
      { from: 'upf', to: 'pcscf' },
      { from: 'pcscf', to: 'scscf' },
      { from: 'scscf', to: 'ims' }
    ],
    color: '#4ade80'
  },
  {
    id: 'qos_setup',
    name: 'QoS Bearer Setup',
    description: '5QI=1 dedicated bearer for voice traffic',
    path: [
      { from: 'pcf', to: 'smf' },
      { from: 'smf', to: 'amf' },
      { from: 'amf', to: 'gnb' },
      { from: 'gnb', to: 'ue' }
    ],
    color: '#facc15'
  },
  {
    id: 'media_plane',
    name: 'Media Plane (RTP)',
    description: 'Voice media packets (RTP/RTCP)',
    path: [
      { from: 'ue', to: 'gnb' },
      { from: 'gnb', to: 'upf' },
      { from: 'upf', to: 'ims' }
    ],
    color: '#f472b6'
  }
];

const COMPONENT_POSITIONS: Record<string, { x: number; y: number }> = {
  ue: { x: 100, y: 300 },
  gnb: { x: 250, y: 300 },
  amf: { x: 400, y: 200 },
  smf: { x: 550, y: 200 },
  upf: { x: 400, y: 400 },
  pcf: { x: 700, y: 200 },
  pcscf: { x: 550, y: 400 },
  icscf: { x: 700, y: 350 },
  scscf: { x: 850, y: 350 },
  ims: { x: 850, y: 450 }
};

export const VoNRArchitecture: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null);
  const [activeFlow, setActiveFlow] = useState<SignalPath | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback((flow: SignalPath) => {
    setActiveFlow(flow);
    setAnimationStep(0);
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!isAnimating || !activeFlow) return;

    const timer = setTimeout(() => {
      if (animationStep < activeFlow.path.length - 1) {
        setAnimationStep(prev => prev + 1);
      } else {
        setIsAnimating(false);
        setTimeout(() => {
          setActiveFlow(null);
          setAnimationStep(0);
        }, 1500);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isAnimating, animationStep, activeFlow]);

  const getConnectionPath = (from: string, to: string): string => {
    const start = COMPONENT_POSITIONS[from];
    const end = COMPONENT_POSITIONS[to];
    if (!start || !end) return '';

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const offsetX = (end.y - start.y) * 0.2;
    const offsetY = (start.x - end.x) * 0.2;

    return `M ${start.x + 40} ${start.y + 25} Q ${midX + offsetX} ${midY + offsetY} ${end.x + 40} ${end.y + 25}`;
  };

  const isPathActive = (from: string, to: string): boolean => {
    if (!activeFlow || !isAnimating) return false;
    for (let i = 0; i <= animationStep; i++) {
      const segment = activeFlow.path[i];
      if (segment && segment.from === from && segment.to === to) return true;
    }
    return false;
  };

  return (
    <div className="w-full bg-gray-800 rounded-xl p-6 shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          VoNR (Voice over New Radio) Architecture
        </h2>
        <p className="text-gray-400">
          Interactive 5G Voice Architecture - Click components for details
        </p>
      </div>

      {/* Signal Flow Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {SIGNAL_FLOWS.map(flow => (
          <button
            key={flow.id}
            onClick={() => startAnimation(flow)}
            disabled={isAnimating}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeFlow?.id === flow.id
                ? 'ring-2 ring-offset-2 ring-offset-gray-800'
                : ''
            } ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            style={{
              backgroundColor: flow.color + '33',
              borderColor: flow.color,
              color: flow.color,
              border: '2px solid'
            }}
          >
            {flow.name}
          </button>
        ))}
      </div>

      {/* Active Flow Description */}
      {activeFlow && (
        <div
          className="text-center mb-4 p-3 rounded-lg animate-pulse"
          style={{ backgroundColor: activeFlow.color + '22', borderColor: activeFlow.color }}
        >
          <p className="font-semibold" style={{ color: activeFlow.color }}>
            {activeFlow.name}: {activeFlow.description}
          </p>
        </div>
      )}

      {/* SVG Architecture Diagram */}
      <div className="relative overflow-auto">
        <svg viewBox="0 0 1000 550" className="w-full h-auto min-h-[500px]">
          {/* Background Grid */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="0.5"/>
            </pattern>

            {/* Glow filters */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Animated dash for signal flow */}
            <linearGradient id="signalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0"/>
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="1"/>
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
            </linearGradient>

            {/* Arrow marker */}
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280"/>
            </marker>

            {SIGNAL_FLOWS.map(flow => (
              <marker
                key={`arrow-${flow.id}`}
                id={`arrowhead-${flow.id}`}
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill={flow.color}/>
              </marker>
            ))}
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)"/>

          {/* Domain Labels */}
          <g className="domain-labels">
            {/* RAN Domain */}
            <rect x="70" y="250" width="220" height="120" rx="10" fill="#22d3ee11" stroke="#22d3ee33" strokeWidth="2"/>
            <text x="180" y="275" textAnchor="middle" className="text-sm" fill="#22d3ee">RAN Domain</text>

            {/* 5G Core Domain */}
            <rect x="370" y="150" width="360" height="130" rx="10" fill="#4ade8011" stroke="#4ade8033" strokeWidth="2"/>
            <text x="550" y="175" textAnchor="middle" className="text-sm" fill="#4ade80">5G Core (5GC)</text>

            {/* IMS Domain */}
            <rect x="520" y="340" width="370" height="160" rx="10" fill="#60a5fa11" stroke="#60a5fa33" strokeWidth="2"/>
            <text x="700" y="365" textAnchor="middle" className="text-sm" fill="#60a5fa">IMS Domain</text>
          </g>

          {/* Connection Lines */}
          <g className="connections">
            {/* Static connections */}
            {[
              ['ue', 'gnb'], ['gnb', 'amf'], ['gnb', 'upf'], ['amf', 'smf'],
              ['smf', 'upf'], ['smf', 'pcf'], ['upf', 'pcscf'], ['pcscf', 'icscf'],
              ['icscf', 'scscf'], ['scscf', 'ims'], ['pcscf', 'scscf']
            ].map(([from, to], idx) => (
              <path
                key={`conn-${idx}`}
                d={getConnectionPath(from, to)}
                stroke={isPathActive(from, to) ? activeFlow?.color : '#4b5563'}
                strokeWidth={isPathActive(from, to) ? 3 : 2}
                fill="none"
                markerEnd={isPathActive(from, to) ? `url(#arrowhead-${activeFlow?.id})` : 'url(#arrowhead)'}
                className={`transition-all duration-300 ${isPathActive(from, to) ? 'animate-pulse' : ''}`}
                style={{
                  filter: isPathActive(from, to) ? 'drop-shadow(0 0 6px ' + activeFlow?.color + ')' : 'none'
                }}
              />
            ))}
          </g>

          {/* Animated Signal Dots */}
          {activeFlow && isAnimating && activeFlow.path.slice(0, animationStep + 1).map((segment, idx) => {
            const start = COMPONENT_POSITIONS[segment.from];
            const end = COMPONENT_POSITIONS[segment.to];
            if (!start || !end) return null;

            return (
              <circle
                key={`signal-${idx}`}
                r="6"
                fill={activeFlow.color}
                style={{ filter: `drop-shadow(0 0 8px ${activeFlow.color})` }}
              >
                <animateMotion
                  dur="0.6s"
                  repeatCount="indefinite"
                  path={getConnectionPath(segment.from, segment.to)}
                />
              </circle>
            );
          })}

          {/* Network Components */}
          {VONR_COMPONENTS.map(comp => {
            const pos = COMPONENT_POSITIONS[comp.id];
            if (!pos) return null;

            const isSelected = selectedComponent?.id === comp.id;
            const isInActiveFlow = activeFlow?.path.some(
              p => p.from === comp.id || p.to === comp.id
            );

            return (
              <g
                key={comp.id}
                className="cursor-pointer transition-transform duration-200 hover:scale-110"
                onClick={() => setSelectedComponent(isSelected ? null : comp)}
                style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
              >
                {/* Component Box */}
                <rect
                  x="0"
                  y="0"
                  width="80"
                  height="50"
                  rx="8"
                  fill={comp.color + '22'}
                  stroke={comp.color}
                  strokeWidth={isSelected || isInActiveFlow ? 3 : 2}
                  className={`transition-all duration-300 ${isInActiveFlow ? 'animate-pulse' : ''}`}
                  style={{
                    filter: isSelected
                      ? `drop-shadow(0 0 12px ${comp.color})`
                      : isInActiveFlow
                        ? `drop-shadow(0 0 8px ${comp.color})`
                        : 'none'
                  }}
                />

                {/* Component Name */}
                <text
                  x="40"
                  y="32"
                  textAnchor="middle"
                  fill={comp.color}
                  className="text-sm font-bold select-none"
                  style={{ fontSize: '14px' }}
                >
                  {comp.name}
                </text>

                {/* Selection indicator */}
                {isSelected && (
                  <circle
                    cx="75"
                    cy="5"
                    r="6"
                    fill={comp.color}
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}

          {/* Legend */}
          <g transform="translate(20, 480)">
            <text x="0" y="0" fill="#9ca3af" className="text-xs">Legend:</text>
            <rect x="60" y="-10" width="12" height="12" fill="#22d3ee22" stroke="#22d3ee" strokeWidth="2"/>
            <text x="78" y="0" fill="#9ca3af" className="text-xs">UE/RAN</text>
            <rect x="130" y="-10" width="12" height="12" fill="#4ade8022" stroke="#4ade80" strokeWidth="2"/>
            <text x="148" y="0" fill="#9ca3af" className="text-xs">5G Core</text>
            <rect x="200" y="-10" width="12" height="12" fill="#60a5fa22" stroke="#60a5fa" strokeWidth="2"/>
            <text x="218" y="0" fill="#9ca3af" className="text-xs">IMS</text>
          </g>
        </svg>
      </div>

      {/* Component Details Panel */}
      {selectedComponent && (
        <div
          className="mt-6 p-4 rounded-lg border-2 animate-fadeIn"
          style={{
            backgroundColor: selectedComponent.color + '11',
            borderColor: selectedComponent.color
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold" style={{ color: selectedComponent.color }}>
                {selectedComponent.name} - {selectedComponent.fullName}
              </h3>
              <p className="text-gray-300 mt-1">{selectedComponent.description}</p>
            </div>
            <button
              onClick={() => setSelectedComponent(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-200 mb-2">Key Functions:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedComponent.functions.map((func, idx) => (
                <li
                  key={idx}
                  className="flex items-center text-sm text-gray-300"
                >
                  <span
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: selectedComponent.color }}
                  />
                  {func}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* VoNR Call Flow Steps */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { step: 1, title: 'PDU Session', desc: 'Establish 5G PDU session with QoS' },
          { step: 2, title: 'IMS Registration', desc: 'SIP REGISTER to P-CSCF/S-CSCF' },
          { step: 3, title: 'QoS Flow', desc: '5QI=1 dedicated bearer for voice' },
          { step: 4, title: 'Voice Call', desc: 'SIP INVITE + RTP media stream' }
        ].map(item => (
          <div
            key={item.step}
            className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-cyan-400 transition-colors"
          >
            <div className="flex items-center mb-2">
              <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold mr-3">
                {item.step}
              </span>
              <h4 className="font-semibold text-white">{item.title}</h4>
            </div>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Key Differences from VoLTE */}
      <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/30">
        <h3 className="text-lg font-bold text-purple-300 mb-3">VoNR vs VoLTE Key Differences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-800/50 rounded p-3">
            <span className="text-cyan-400 font-semibold">5G NR Air Interface</span>
            <p className="text-gray-400 mt-1">Lower latency, higher bandwidth compared to LTE</p>
          </div>
          <div className="bg-gray-800/50 rounded p-3">
            <span className="text-green-400 font-semibold">Service Based Architecture</span>
            <p className="text-gray-400 mt-1">AMF/SMF/UPF replace MME/SGW/PGW</p>
          </div>
          <div className="bg-gray-800/50 rounded p-3">
            <span className="text-yellow-400 font-semibold">5QI QoS Model</span>
            <p className="text-gray-400 mt-1">5QI=1 for voice vs QCI=1 in LTE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoNRArchitecture;
