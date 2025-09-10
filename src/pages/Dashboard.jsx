import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Principal</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total kWh</h2>
          <p className="text-3xl font-bold text-green-500">1,234,567</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
