import React from 'react';

const AppTest: React.FC = () => {
  console.log('📱 AppTest component loaded');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#2563eb', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          ✅ React fonctionne !
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          RestauConnect Test Page
        </p>
        <p>Backend: http://localhost:5000/health</p>
        <p>Frontend: http://localhost:5173</p>
      </div>
    </div>
  );
};

export default AppTest;