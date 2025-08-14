
import type { Module } from './types';

export const COURSE_OUTLINE: Module[] = [
    {
        id: 'm1',
        title: 'Module 1: Introduction and Fundamentals',
        topics: [
            { id: 'm1t1', title: 'Evolution from 2G/3G to LTE' },
            { id: 'm1t2', title: 'LTE objectives and key requirements' },
            { id: 'm1t3', title: '3GPP standards and release evolution' },
            { id: 'm1t4', title: 'LTE vs LTE-Advanced vs 5G positioning' },
            { id: 'm1t5', title: 'Market drivers and deployment scenarios' },
        ],
    },
    {
        id: 'm2',
        title: 'Module 2: LTE Network Architecture',
        topics: [
            { id: 'm2t1', title: 'Evolved Packet System (EPS) overview' },
            { id: 'm2t2', title: 'Evolved UTRAN (E-UTRAN) architecture' },
            { id: 'm2t3', title: 'Evolved Packet Core (EPC) components' },
            { id: 'm2t4', title: 'Network interfaces and reference points' },
            { id: 'm2t5', title: 'Protocol stack architecture' },
        ],
    },
    {
        id: 'm3',
        title: 'Module 3: Core Network Elements',
        topics: [
            { id: 'm3t1', title: 'Mobility Management Entity (MME)' },
            { id: 'm3t2', title: 'Serving Gateway (S-GW)' },
            { id: 'm3t3', title: 'PDN Gateway (P-GW)' },
            { id: 'm3t4', title: 'Home Subscriber Server (HSS)' },
            { id: 'm3t5', title: 'Policy and Charging Rules Function (PCRF)' },
        ],
    },
    {
        id: 'm4',
        title: 'Module 4: Radio Access Network (E-UTRAN)',
        topics: [
            { id: 'm4t1', title: 'eNodeB functionality and architecture' },
            { id: 'm4t2', title: 'X2 interface and inter-eNB communication' },
            { id: 'm4t3', title: 'S1 interface to EPC' },
            { id: 'm4t4', title: 'Self-Organizing Networks (SON) basics' },
        ],
    },
    {
        id: 'm5',
        title: 'Module 5: LTE Air Interface and Physical Layer',
        topics: [
            { id: 'm5t1', title: 'OFDMA downlink principles' },
            { id: 'm5t2', title: 'SC-FDMA uplink principles' },
            { id: 'm5t3', title: 'Frame structure and resource allocation' },
            { id: 'm5t4', title: 'Physical channels and signals' },
            { id: 'm5t5', title: 'MIMO technology and antenna configurations' },
            { id: 'm5t6', title: 'Channel coding and modulation schemes' },
        ],
    },
    {
        id: 'm6',
        title: 'Module 6: LTE Protocol Stack',
        topics: [
            { id: 'm6t1', title: 'Layer 1 (Physical Layer)' },
            { id: 'm6t2', title: 'Layer 2: MAC, RLC, and PDCP' },
            { id: 'm6t3', title: 'Layer 3: RRC protocol' },
            { id: 'm6t4', title: 'Non-Access Stratum (NAS) protocols' },
            { id: 'm6t5', title: 'Quality of Service (QoS) framework' },
        ],
    },
    {
        id: 'm7',
        title: 'Module 7: LTE Procedures',
        topics: [
            { id: 'm7t1', title: 'Initial attach and registration' },
            { id: 'm7t2', title: 'Bearer establishment and management' },
            { id: 'm7t3', title: 'Handover procedures (intra/inter-frequency/inter-RAT)' },
            { id: 'm7t4', title: 'Paging and idle mode procedures' },
            { id: 'm7t5', title: 'Security procedures and authentication' },
        ],
    },
    {
        id: 'm8',
        title: 'Module 8: Radio Resource Management',
        topics: [
            { id: 'm8t1', title: 'Power control mechanisms' },
            { id: 'm8t2', title: 'Scheduling algorithms' },
            { id: 'm8t3', title: 'Load balancing and admission control' },
            { id: 'm8t4', title: 'Interference coordination techniques' },
            { id: 'm8t5', title: 'Carrier aggregation principles' },
        ],
    },
    {
        id: 'm9',
        title: 'Module 9: LTE Planning and Optimization',
        topics: [
            { id: 'm9t1', title: 'Coverage and capacity planning' },
            { id: 'm9t2', title: 'Link budget calculations' },
            { id: 'm9t3', title: 'Frequency planning considerations' },
            { id: 'm9t4', title: 'Parameter optimization strategies' },
            { id: 'm9t5', title: 'KPI monitoring and troubleshooting' },
        ],
    },
    {
        id: 'm10',
        title: 'Module 10: LTE Advanced Features',
        topics: [
            { id: 'm10t1', title: 'Carrier Aggregation (CA)' },
            { id: 'm10t2', title: 'Enhanced MIMO (8x8, MU-MIMO)' },
            { id: 'm10t3', title: 'Coordinated Multi-Point (CoMP)' },
            { id: 'm10t4', title: 'Relay nodes and heterogeneous networks' },
            { id: 'm10t5', title: 'Enhanced Inter-Cell Interference Coordination (eICIC)' },
        ],
    },
    {
        id: 'm11',
        title: 'Module 11: Voice over LTE (VoLTE)',
        topics: [
            { id: 'm11t1', title: 'IMS architecture for VoLTE' },
            { id: 'm11t2', title: 'VoLTE call flow procedures' },
            { id: 'm11t3', title: 'QoS requirements for voice services' },
            { id: 'm11t4', title: 'SRVCC (Single Radio Voice Call Continuity)' },
            { id: 'm11t5', title: 'VoLTE deployment considerations' },
        ],
    },
    {
        id: 'm12',
        title: 'Module 12: Measurement and Testing',
        topics: [
            { id: 'm12t1', title: 'Drive test procedures and tools' },
            { id: 'm12t2', title: 'Key performance indicators (KPIs)' },
            { id: 'm12t3', title: 'Troubleshooting methodologies' },
            { id: 'm12t4', title: 'Network optimization techniques' },
            { id: 'm12t5', title: 'Benchmarking and competitive analysis' },
        ],
    },
    {
        id: 'm13',
        title: 'Module 13: Security in LTE',
        topics: [
            { id: 'm13t1', title: 'Authentication and key agreement (AKA)' },
            { id: 'm13t2', title: 'Encryption and integrity protection' },
            { id: 'm13t3', title: 'Security architecture and protocols' },
            { id: 'm13t4', title: 'Lawful interception requirements' },
            { id: 'm13t5', title: 'Security threats and countermeasures' },
        ],
    },
    {
        id: 'm14',
        title: 'Module 14: LTE Deployment Scenarios',
        topics: [
            { id: 'm14t1', title: 'Macro cell deployments' },
            { id: 'm14t2', title: 'Small cell and femtocell solutions' },
            { id: 'm14t3', title: 'Indoor coverage solutions' },
            { id: 'm14t4', title: 'Rural and suburban deployment strategies' },
            { id: 'm14t5', title: 'Migration strategies from 3G to LTE' },
        ],
    },
    {
        id: 'm15',
        title: 'Module 15: Future Evolution and 5G Migration',
        topics: [
            { id: 'm15t1', title: 'LTE-Advanced Pro features' },
            { id: 'm15t2', title: 'IoT support (Cat-M1, NB-IoT)' },
            { id: 'm15t3', title: '5G NSA (Non-Standalone) architecture' },
            { id: 'm15t4', title: 'LTE and 5G coexistence strategies' },
            { id: 'm15t5', title: 'Evolution roadmap and timeline' },
        ],
    },
];
