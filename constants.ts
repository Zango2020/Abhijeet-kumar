
import type { Module } from './types';

export const COURSE_OUTLINE: Module[] = [
    {
        id: 'm1',
        title: 'Module 1: Introduction to VoNR',
        topics: [
            { id: 'm1t1', title: 'What is Voice over New Radio (VoNR)?' },
            { id: 'm1t2', title: 'Evolution: VoLTE to VoNR Journey' },
            { id: 'm1t3', title: '5G NR Fundamentals for Voice Services' },
            { id: 'm1t4', title: 'VoNR vs VoLTE: Key Differences' },
            { id: 'm1t5', title: 'Market Drivers and Global Deployment Status' },
        ],
    },
    {
        id: 'm2',
        title: 'Module 2: 5G Core Network Architecture for VoNR',
        topics: [
            { id: 'm2t1', title: '5G System Architecture (5GS) Overview' },
            { id: 'm2t2', title: 'Service-Based Architecture (SBA) Principles' },
            { id: 'm2t3', title: 'Access and Mobility Management Function (AMF)' },
            { id: 'm2t4', title: 'Session Management Function (SMF)' },
            { id: 'm2t5', title: 'User Plane Function (UPF)' },
            { id: 'm2t6', title: 'Policy Control Function (PCF)' },
        ],
    },
    {
        id: 'm3',
        title: 'Module 3: IMS Architecture for VoNR',
        topics: [
            { id: 'm3t1', title: 'IP Multimedia Subsystem (IMS) Overview' },
            { id: 'm3t2', title: 'Proxy-CSCF (P-CSCF) Functions' },
            { id: 'm3t3', title: 'Interrogating-CSCF (I-CSCF) Functions' },
            { id: 'm3t4', title: 'Serving-CSCF (S-CSCF) Functions' },
            { id: 'm3t5', title: 'Media Resource Function (MRF)' },
            { id: 'm3t6', title: 'Telephony Application Server (TAS)' },
        ],
    },
    {
        id: 'm4',
        title: 'Module 4: VoNR Protocol Stack',
        topics: [
            { id: 'm4t1', title: 'SIP Protocol for VoNR Signaling' },
            { id: 'm4t2', title: 'SDP (Session Description Protocol)' },
            { id: 'm4t3', title: 'RTP/RTCP for Voice Media Transport' },
            { id: 'm4t4', title: 'Diameter Protocol Integration' },
            { id: 'm4t5', title: 'HTTP/2 and REST APIs in 5GC' },
        ],
    },
    {
        id: 'm5',
        title: 'Module 5: VoNR Call Flows',
        topics: [
            { id: 'm5t1', title: 'VoNR Registration Procedure' },
            { id: 'm5t2', title: 'Mobile Originating (MO) Call Setup' },
            { id: 'm5t3', title: 'Mobile Terminating (MT) Call Setup' },
            { id: 'm5t4', title: 'VoNR Call Release Procedures' },
            { id: 'm5t5', title: 'Supplementary Services (Call Hold, Transfer, Conference)' },
        ],
    },
    {
        id: 'm6',
        title: 'Module 6: QoS Framework for VoNR',
        topics: [
            { id: 'm6t1', title: '5G QoS Model and QoS Flows' },
            { id: 'm6t2', title: '5QI (5G QoS Identifier) for Voice' },
            { id: 'm6t3', title: 'GBR vs Non-GBR Bearers' },
            { id: 'm6t4', title: 'QoS Policy Control via PCF' },
            { id: 'm6t5', title: 'End-to-End QoS Assurance' },
        ],
    },
    {
        id: 'm7',
        title: 'Module 7: Voice Codecs and Media',
        topics: [
            { id: 'm7t1', title: 'EVS (Enhanced Voice Services) Codec' },
            { id: 'm7t2', title: 'AMR-WB and AMR-NB Codecs' },
            { id: 'm7t3', title: 'Codec Negotiation in VoNR' },
            { id: 'm7t4', title: 'Jitter Buffer Management' },
            { id: 'm7t5', title: 'Packet Loss Concealment Techniques' },
        ],
    },
    {
        id: 'm8',
        title: 'Module 8: VoNR Mobility and Handover',
        topics: [
            { id: 'm8t1', title: 'Intra-5G NR Handover for Voice' },
            { id: 'm8t2', title: 'Inter-RAT Handover: 5G to LTE (EPS Fallback)' },
            { id: 'm8t3', title: 'Service Continuity Mechanisms' },
            { id: 'm8t4', title: 'Voice Service Continuity (VSC)' },
            { id: 'm8t5', title: 'RAT Fallback Strategies' },
        ],
    },
    {
        id: 'm9',
        title: 'Module 9: Emergency Services over VoNR',
        topics: [
            { id: 'm9t1', title: 'Emergency Call (NG-eCall) Architecture' },
            { id: 'm9t2', title: 'Location Services for Emergency Calls' },
            { id: 'm9t3', title: 'Priority and Preemption for Emergency' },
            { id: 'm9t4', title: 'PSAP (Public Safety Answering Point) Integration' },
            { id: 'm9t5', title: 'Regulatory Requirements and Compliance' },
        ],
    },
    {
        id: 'm10',
        title: 'Module 10: VoNR Security',
        topics: [
            { id: 'm10t1', title: '5G Security Architecture Overview' },
            { id: 'm10t2', title: 'Authentication and Key Agreement (5G-AKA)' },
            { id: 'm10t3', title: 'IPsec for IMS Security' },
            { id: 'm10t4', title: 'TLS/DTLS for Signaling Protection' },
            { id: 'm10t5', title: 'SRTP for Voice Media Encryption' },
        ],
    },
    {
        id: 'm11',
        title: 'Module 11: VoNR Network Planning',
        topics: [
            { id: 'm11t1', title: 'Coverage Planning for VoNR' },
            { id: 'm11t2', title: 'Capacity Dimensioning' },
            { id: 'm11t3', title: 'Latency Optimization Strategies' },
            { id: 'm11t4', title: 'RAN Parameter Configuration' },
            { id: 'm11t5', title: 'End-to-End Network Design' },
        ],
    },
    {
        id: 'm12',
        title: 'Module 12: VoNR Testing and KPIs',
        topics: [
            { id: 'm12t1', title: 'VoNR Test Methodology' },
            { id: 'm12t2', title: 'Key Performance Indicators (KPIs)' },
            { id: 'm12t3', title: 'MOS (Mean Opinion Score) Testing' },
            { id: 'm12t4', title: 'Call Setup Success Rate (CSSR)' },
            { id: 'm12t5', title: 'Troubleshooting Common Issues' },
        ],
    },
    {
        id: 'm13',
        title: 'Module 13: Advanced VoNR Features',
        topics: [
            { id: 'm13t1', title: 'Video over NR (ViNR)' },
            { id: 'm13t2', title: 'Rich Communication Services (RCS)' },
            { id: 'm13t3', title: 'Network Slicing for Voice' },
            { id: 'm13t4', title: 'Edge Computing for Ultra-Low Latency' },
            { id: 'm13t5', title: 'AI/ML in Voice Quality Optimization' },
        ],
    },
    {
        id: 'm14',
        title: 'Module 14: VoNR Deployment Strategies',
        topics: [
            { id: 'm14t1', title: 'Standalone (SA) vs Non-Standalone (NSA) Deployment' },
            { id: 'm14t2', title: 'Migration Path from VoLTE to VoNR' },
            { id: 'm14t3', title: 'Dual Connectivity Considerations' },
            { id: 'm14t4', title: 'Roaming and Interconnection' },
            { id: 'm14t5', title: 'Vendor Ecosystem and Interoperability' },
        ],
    },
    {
        id: 'm15',
        title: 'Module 15: Future of Voice Services',
        topics: [
            { id: 'm15t1', title: 'VoNR in 5G-Advanced (Rel-18+)' },
            { id: 'm15t2', title: 'Immersive Voice and XR Integration' },
            { id: 'm15t3', title: 'Satellite Integration for Voice' },
            { id: 'm15t4', title: 'AI-Powered Voice Assistants over 5G' },
            { id: 'm15t5', title: '6G Vision for Communication Services' },
        ],
    },
];

// Sound effect URLs (using Web Audio API compatible sounds)
export const SOUND_EFFECTS = {
    click: 'click',
    success: 'success',
    hover: 'hover',
    notification: 'notification',
    complete: 'complete',
} as const;

// Animation variants for Framer Motion
export const ANIMATION_VARIANTS = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    },
    slideInLeft: {
        hidden: { x: -100, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    },
    slideInRight: {
        hidden: { x: 100, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    },
    slideInUp: {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    },
    scaleIn: {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200 } },
    },
    staggerContainer: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    },
    pulseGlow: {
        animate: {
            boxShadow: [
                '0 0 0 0 rgba(6, 182, 212, 0)',
                '0 0 20px 10px rgba(6, 182, 212, 0.3)',
                '0 0 0 0 rgba(6, 182, 212, 0)',
            ],
            transition: { duration: 2, repeat: Infinity },
        },
    },
    float: {
        animate: {
            y: [0, -10, 0],
            transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        },
    },
};
