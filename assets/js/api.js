const mockData = {
    teams: [
        { id: 'GEM-001', name: 'John Doe', team: 'GEM', role: 'Cybersecurity Director', status: 'Active', clearance: 'L4' },
        { id: 'GEM-002', name: 'Victor Chinemelomu', team: 'GEM', role: 'Chief Compliance & Intelligence Officer', status: 'Active', clearance: 'L5' },
        { id: 'GEM-003', name: 'Sophia Martinez', team: 'GEM', role: 'Director of Financial Recovery Operations', status: 'Active', clearance: 'L3' },
        { id: 'GEM-004', name: 'Eric Lin', team: 'GEM', role: 'AI Systems Architect', status: 'Active', clearance: 'L4' },
        { id: 'GEM-005', name: 'James Carter', team: 'GEM', role: 'Threat Intelligence Analyst', status: 'Active', clearance: 'L2' },
        { id: 'GEM-006', name: 'Rachel Adams', team: 'GEM', role: 'Digital Forensics Analyst', status: 'Active', clearance: 'L2' },
        { id: 'GEM-007', name: 'Michael Brown', team: 'GEM', role: 'Network Defense Engineer', status: 'Active', clearance: 'L2' },
        { id: 'GEM-008', name: 'Olivia Chen', team: 'GEM', role: 'Cryptography Specialist', status: 'Active', clearance: 'L3' },
        { id: 'GEM-009', name: 'Daniel White', team: 'GEM', role: 'Incident Response Lead', status: 'Active', clearance: 'L3' },
        { id: 'GEM-010', name: 'Laura Green', team: 'GEM', role: 'Fraud Detection Analyst', status: 'Active', clearance: 'L2' },
        { id: 'ATR-001', name: 'Jane Smith', team: 'Alliance', role: 'Real Estate Consultant', status: 'Active', clearance: 'RE-LIC' },
        { id: 'ATR-002', name: 'Angela Robinson', team: 'Alliance', role: 'Legal & Regulatory Liaison Officer', status: 'Active', clearance: 'BAR-221' },
        { id: 'ATR-003', name: 'Mark Thompson', team: 'Alliance', role: 'Investment Manager', status: 'Active', clearance: 'FIN-LIC' },
        { id: 'ATR-004', name: 'Susan Wright', team: 'Alliance', role: 'Property Manager', status: 'Active', clearance: 'PM-LIC' },
        { id: 'ATR-005', name: 'Kevin Lee', team: 'Alliance', role: 'Asset Manager', status: 'Active', clearance: 'FIN-LIC' },
        { id: 'ATR-006', name: 'Emily Johnson', team: 'Alliance', role: 'Recovery Specialist', status: 'Active', clearance: 'OPS' },
        { id: 'ATR-007', name: 'Robert King', team: 'Alliance', role: 'Client Portfolio Advisor', status: 'Active', clearance: 'FIN-LIC' },
        { id: 'ATR-008', name: 'Natalie Perez', team: 'Alliance', role: 'Financial Operations Manager', status: 'Active', clearance: 'FIN' },
        { id: 'ATR-009', name: 'Thomas Scott', team: 'Alliance', role: 'Contract Administrator', status: 'Active', clearance: 'OPS' },
        { id: 'ATR-010', name: 'Maria Torres', team: 'Alliance', role: 'Compliance & Regulatory Liaison', status: 'Active', clearance: 'BAR-445' }
    ],
    tenants: [
        { id: 'T-001', name: 'Global Tech Corp', status: 'Healthy', users: 124, revenue: '$1.2M' },
        { id: 'T-002', name: 'Nexus Financial', status: 'Healthy', users: 89, revenue: '$850K' },
        { id: 'T-003', name: 'Cyberdyne Systems', status: 'Warning', users: 45, revenue: '$320K' },
        { id: 'T-004', name: 'Wayne Enterprises', status: 'Healthy', users: 210, revenue: '$2.4M' }
    ],
    portfolios: [
        { id: 'P-001', client: 'John Doe', value: '$124,500', change: '+5.2%', status: 'Active' },
        { id: 'P-002', client: 'Alice Smith', value: '$89,200', change: '-1.4%', status: 'Active' },
        { id: 'P-003', client: 'Bob Johnson', value: '$450,000', change: '+12.8%', status: 'Active' }
    ],
    logs: [
        { time: '2026-02-07 10:15:22', user: 'superadmin@gem.com', action: 'Tenant "Global Tech Corp" updated', type: 'INFO' },
        { time: '2026-02-07 10:12:05', user: 'admin@gem.com', action: 'New user "sarah.j" added', type: 'SUCCESS' },
        { time: '2026-02-07 10:10:45', user: 'system', action: 'Automated backup completed', type: 'INFO' },
        { time: '2026-02-07 10:05:12', user: 'client@gem.com', action: 'Failed login attempt', type: 'WARNING' }
    ]
};

const API = {
    getTeams: () => new Promise(resolve => setTimeout(() => resolve(mockData.teams), 300)),
    getTenants: () => new Promise(resolve => setTimeout(() => resolve(mockData.tenants), 400)),
    getPortfolios: () => new Promise(resolve => setTimeout(() => resolve(mockData.portfolios), 300)),
    getLogs: () => new Promise(resolve => setTimeout(() => resolve(mockData.logs), 500)),
    getStats: () => new Promise(resolve => setTimeout(() => resolve({
        corePages: 7,
        portals: 6,
        userRoles: 4,
        functional: '100%'
    }), 200))
};

window.API = API;
