import React from 'react';

const RefreshButton = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <button onClick={handleRefresh} style={{ padding: '10px', fontSize: '16px' }}>
      Refresh Data
    </button>
  );
};

export default RefreshButton;
