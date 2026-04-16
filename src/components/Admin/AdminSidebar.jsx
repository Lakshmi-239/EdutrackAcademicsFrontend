import React from 'react';
import { Nav } from 'react-bootstrap';

const AdminSidebar = ({ onSelect, activeView }) => {
    const sidebarStyle = {
        width: '260px',
        height: '100vh',
        background: '#1a1d20',
        color: 'white',
        padding: '20px',
        position: 'sticky',
        top: 0
    };

    const linkStyle = (name) => ({
        padding: '12px 15px',
        cursor: 'pointer',
        borderRadius: '6px',
        marginBottom: '8px',
        // Highlight active button
        background: activeView === name ? '#0d6efd' : 'transparent',
        color: 'white',
        display: 'block',
        transition: '0.3s'
    });

    return (
        <div style={sidebarStyle}>
            <h4 className="text-info mb-4 text-center">Admin Panel</h4>
            <hr />
            <Nav className="flex-column mt-3">
                <div style={linkStyle('qualifications')} onClick={() => onSelect('qualifications')}>
                    🎓 Qualifications
                </div>
                <div style={linkStyle('programs')} onClick={() => onSelect('programs')}>
                    📚 Programs
                </div>
                {/* Academic Year kosam */}
               <div style={linkStyle('academicYears')} onClick={() => onSelect('academicYears')}>
               📅 Academic Years
               </div>
 
                {/* Rules kosam */}
                <div style={linkStyle('academicRules')} onClick={() => onSelect('academicRules')}>
                📜 Academic Rules
                 </div>
            </Nav>
        </div>
    );
};

export default AdminSidebar;
