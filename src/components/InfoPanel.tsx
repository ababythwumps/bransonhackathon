import { useState } from 'react';

interface InfoPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(20, 15, 10, 0.85)',
        border: '1px solid #d9b382',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        color: '#f0e0b6',
        zIndex: 100,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(5px)',
        fontFamily: 'CaskaydiaMono, monospace',
        fontWeight: 200,
      }}
    >
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          color: '#d9b382',
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: '5px',
        }}
      >
        ×
      </button>
      
      <h2 style={{ 
        color: '#f0e0b6', 
        borderBottom: '1px solid #d9b382', 
        paddingBottom: '0.5rem',
        marginTop: 0,
        fontWeight: 300,
        letterSpacing: '0.1em',
      }}>
        climate change or smth
      </h2>
      
      <p style={{ lineHeight: 1.6, margin: '1rem 0' }}>
        bla bla bla boilerplate
      </p>
      
      <p style={{ lineHeight: 1.6, margin: '1rem 0' }}>
          bla bla bla boilerplate
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginTop: '1.5rem',
        borderTop: '1px solid rgba(217, 179, 130, 0.3)',
        paddingTop: '1rem',
      }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 300, color: '#d9b382' }}>CO₂ LEVELS</h3>
          <p style={{ margin: 0 }}>417.57 ppm</p>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Pre-industrial: ~280 ppm</p>
        </div>
        
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 300, color: '#d9b382' }}>GLOBAL TEMP</h3>
          <p style={{ margin: 0 }}>+1.1°C</p>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Since pre-industrial era</p>
        </div>
        
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 300, color: '#d9b382' }}>SEA LEVEL</h3>
          <p style={{ margin: 0 }}>+3.6 mm/yr</p>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Annual rise rate</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;