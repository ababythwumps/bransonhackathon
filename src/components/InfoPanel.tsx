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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid #ffffff',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        color: '#ffffff',
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
          color: '#ffffff',
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: '5px',
        }}
      >
        ×
      </button>
      
      <h2 style={{ 
        color: '#ffffff',
        borderBottom: '1px solid #ffffff', 
        paddingBottom: '0.5rem',
        marginTop: 0,
        fontWeight: 200,
        letterSpacing: '0.1em',
      }}>
        CLIMATE CRISIS
      </h2>
      
      <p style={{ lineHeight: 1.6, margin: '1rem 0' }}>
        The Earth's temperature has risen by approximately 1.1°C since pre-industrial times,
        primarily due to human activities like burning fossil fuels and deforestation.
      </p>
      
      <p style={{ lineHeight: 1.6, margin: '1rem 0' }}>
        The goal of this hackathon is to develop innovative technological solutions
        that can help combat climate change and create a more sustainable future.
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
        paddingTop: '1rem',
      }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 200, color: '#ffffff' }}>CO₂ LEVELS</h3>
          <p style={{ margin: 0 }}>417.57 ppm</p>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Pre-industrial: ~280 ppm</p>
        </div>
        
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 200, color: '#ffffff' }}>GLOBAL TEMP</h3>
          <p style={{ margin: 0 }}>+1.1°C</p>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Since pre-industrial era</p>
        </div>
        
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 200, color: '#ffffff' }}>SEA LEVEL</h3>
          <p style={{ margin: 0 }}>+3.6 mm/yr</p>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Annual rise rate</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;