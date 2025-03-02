import React from "react";
import Head from "next/head";
import Link from "next/link";

const TakeAction: React.FC = () => {
  return (
    <>
      <Head>
        <title>Take Action - Chicago Climate Change</title>
        <meta name="description" content="Take action against climate change in Chicago" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        color: '#ffffff',
        backgroundColor: '#000000',
        minHeight: '100vh',
        fontFamily: 'CaskaydiaMono, monospace',
        fontWeight: 200,
        letterSpacing: '0.05em'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '1rem'
        }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            margin: 0, 
            textTransform: 'uppercase',
            fontWeight: 200,
            letterSpacing: '0.15em'
          }}>
            Take Action for Chicago
          </h1>
          <Link href="/Chicago">
            <button style={{
              padding: '10px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0',
              cursor: 'pointer',
              fontFamily: 'CaskaydiaMono, monospace',
              fontWeight: 200,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            >
              Back to Chicago
            </button>
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{
                fontWeight: 200,
                fontSize: '1.5rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: '0'
              }}>
                Calculate Your Impact
              </h2>
              <p style={{ lineHeight: '1.6', opacity: '0.8' }}>
                Take our carbon footprint survey to understand your personal impact on climate change and get personalized recommendations for Chicago.
              </p>
            </div>
            <Link href="/action/Chicago">
              <button style={{
                padding: '16px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 200,
                fontFamily: 'CaskaydiaMono, monospace',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                marginTop: '1.5rem',
                width: '100%'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                Start Carbon Survey
                <span style={{ marginLeft: '8px' }}>→</span>
              </button>
            </Link>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{
                fontWeight: 200,
                fontSize: '1.5rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: '0'
              }}>
                Join Local Initiatives
              </h2>
              <p style={{ lineHeight: '1.6', opacity: '0.8' }}>
                Connect with local organizations and community projects working to address climate change in Chicago.
              </p>
            </div>
            <a 
              href="https://sfenvironment.org/get-involved"
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                padding: '16px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 200,
                fontFamily: 'CaskaydiaMono, monospace',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                marginTop: '1.5rem',
                textDecoration: 'none',
                display: 'inline-block',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Explore Local Groups
              <span style={{ marginLeft: '8px' }}>→</span>
            </a>
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <h2 style={{
            fontWeight: 200,
            fontSize: '1.5rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: '0'
          }}>
            Key Action Areas for Chicago
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '2rem',
            marginTop: '1.5rem'
          }}>
            <div>
              <h3 style={{
                fontWeight: 200,
                fontSize: '1.1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginTop: '0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '0.5rem'
              }}>
                Transportation
              </h3>
              <ul style={{ 
                paddingLeft: '1.2rem',
                lineHeight: '1.6',
                opacity: '0.8',
                fontSize: '0.95rem'
              }}>
                <li>Use MUNI or BART for daily commutes</li>
                <li>Join the Bay Area bike share program</li>
                <li>Consider an electric vehicle for your next car</li>
                <li>Walk whenever possible for short trips</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{
                fontWeight: 200,
                fontSize: '1.1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginTop: '0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '0.5rem'
              }}>
                Energy & Housing
              </h3>
              <ul style={{ 
                paddingLeft: '1.2rem',
                lineHeight: '1.6',
                opacity: '0.8',
                fontSize: '0.95rem'
              }}>
                <li>Switch to CleanPowerSF renewable energy</li>
                <li>Get a free home energy assessment</li>
                <li>Install low-flow water fixtures</li>
                <li>Upgrade to energy-efficient appliances</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{
                fontWeight: 200,
                fontSize: '1.1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginTop: '0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '0.5rem'
              }}>
                Food & Waste
              </h3>
              <ul style={{ 
                paddingLeft: '1.2rem',
                lineHeight: '1.6',
                opacity: '0.8',
                fontSize: '0.95rem'
              }}>
                <li>Shop at local farmers markets</li>
                <li>Participate in composting programs</li>
                <li>Reduce single-use plastics</li>
                <li>Support local food initiatives</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '2rem'
        }}>
          <h2 style={{
            fontWeight: 200,
            fontSize: '1.3rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            Ready to make a difference?
          </h2>
          <p style={{ lineHeight: '1.6', opacity: '0.8', marginBottom: '1.5rem' }}>
            Start with our carbon footprint survey to get personalized recommendations.
          </p>
          
          <Link href="/action/Chicago">
            <button style={{
              padding: '16px 32px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: 200,
              fontFamily: 'CaskaydiaMono, monospace',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              Take the Survey
              <span style={{ marginLeft: '10px' }}>→</span>
            </button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default TakeAction;
