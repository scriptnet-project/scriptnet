import React from 'react';

const Navigation = ({ onNavigate }) => {
  return (
    <div style={{ position: 'absolute', top: 0, right: 0 }}>
      <div className="clickable" onClick={() => onNavigate('default')}>Welcome</div>
      <div className="clickable" onClick={() => onNavigate('visualisation')}>Go to visualisation</div>
    </div>
  );
};

export default Navigation;
