import React from 'react';
import { Outlet } from 'react-router-dom';

const TVLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Outlet />
    </div>
  );
};

export default TVLayout;