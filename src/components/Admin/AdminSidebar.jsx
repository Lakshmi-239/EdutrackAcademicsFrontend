import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
    FiGrid, 
    FiAward, 
    FiBookOpen, 
    FiCalendar, 
    FiFileText, 
    FiBell, 
    FiShield,
    FiLogOut // Added Logout Icon
} from 'react-icons/fi';

const AdminSidebar = ({ onSelect, activeView }) => {
    const navigate = useNavigate();

    // Mock logout function - replace with your actual auth logic
    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        // Add any other cleanup needed
    };

    const sidebarStyle = {
        width: '260px',
        height: '100vh',
        background: '#020617',
        color: '#94a3b8',
        padding: '24px 16px',
        position: 'sticky',
        top: 0,
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column'
    };

    const linkStyle = (name) => ({
        padding: '12px 16px',
        cursor: 'pointer',
        borderRadius: '12px',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '500',
        background: activeView === name ? 'rgba(20, 184, 166, 0.1)' : 'transparent',
        color: activeView === name ? '#14b8a6' : '#94a3b8',
    });

    const handleNav = (view, path) => {
        if(path) navigate(path);
        onSelect(view);
    };

    return (
        <div style={sidebarStyle} className="admin-sidebar">
            {/* --- HEADER --- */}
            <div className="d-flex align-items-center gap-2 px-3 mb-4">
                <div style={{ 
                    background: '#14b8a6', 
                    padding: '8px', 
                    borderRadius: '8px',
                    color: 'white'
                }}>
                    <FiShield size={20} />
                </div>
                <h5 className="mb-0 fw-bold text-white tracking-tight">Admin <span className="text-teal">Portal</span></h5>
            </div>

            <hr style={{ borderColor: '#1e293b', opacity: 1, margin: '0 0 20px 0' }} />

            {/* --- MAIN NAVIGATION --- */}
            <Nav className="flex-column flex-grow-1">
                <div style={linkStyle('dashboard')} onClick={() => handleNav('dashboard', '/admin/dashboard')}>
                    <FiGrid size={18} /> Dashboard
                </div>

                <div style={linkStyle('qualifications')} onClick={() => handleNav('qualifications')}>
                    <FiAward size={18} /> Qualifications
                </div>

                <div style={linkStyle('programs')} onClick={() => handleNav('programs')}>
                    <FiBookOpen size={18} /> Programs
                </div>

                <div style={linkStyle('academicYears')} onClick={() => handleNav('academicYears')}>
                    <FiCalendar size={18} /> Academic Years
                </div>

                <div style={linkStyle('academicRules')} onClick={() => handleNav('academicRules')}>
                    <FiShield size={18} /> Academic Rules
                </div>

                <div className="mt-4 mb-2 px-3">
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Insights & Alerts
                    </span>
                </div>

                <div style={linkStyle('reports')} onClick={() => handleNav('reports')}>
                    <FiFileText size={18} /> Reports
                </div>

                <div style={linkStyle('notifications')} onClick={() => handleNav('notifications')}>
                    <div className="position-relative">
                        <FiBell size={18} />
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                    </div>
                    Notifications
                </div>
            </Nav>

            {/* --- FOOTER / LOGOUT --- */}
            <div className="pt-3 mt-auto border-top border-slate-800" style={{ borderColor: '#1e293b' }}>
                <button
                    onClick={() => { logout(); navigate("/login"); }}
                    className="logout-btn w-100 rounded-3 d-flex align-items-center justify-content-center py-2 border-0 fw-bold"
                    style={{ 
                        background: 'rgba(244, 63, 94, 0.1)', 
                        color: '#fb7185',
                        transition: '0.3s'
                    }}
                >
                    <FiLogOut className="me-2" /> Sign Out
                </button>
            </div>

            <style>{`
                .admin-sidebar div:hover:not(.pt-3) {
                    color: #14b8a6 !important;
                    background: rgba(20, 184, 166, 0.05) !important;
                }
                .logout-btn:hover {
                    background: #f43f5e !important;
                    color: white !important;
                    transform: translateY(-1px);
                }
                .text-teal { color: #14b8a6; }
                .border-slate-800 { border-color: #1e293b !important; }
            `}</style>
        </div>
    );
};

export default AdminSidebar;