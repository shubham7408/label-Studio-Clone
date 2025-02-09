import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; 

const TestStats = ({tasks}) => {
  
  const taskData = tasks?.map((task) => task.AcceptanceRate? task.AcceptanceRate : 0);
  
  const data = {
    labels: tasks?.map((task) => task.QuestionId), // Labels is  task id 
    datasets: [
      {
        label: 'Tasks', 
        data: taskData, 
        backgroundColor: [
          '#007bff', '#28a745', '#dc3545', '#ffb22b', '#6f42c1',
          '#17a2b8', '#ffc107', '#6610f2', '#e83e8c', '#20c997',
        ], 
      },
    ],
  };

  // console.log(taskData);

 
  const average = taskData.reduce((sum, value) => sum + value, 0) / taskData.length;
  const highestAccuracy = Math.max(...taskData); 
  const lowestAccuracy = Math.min(...taskData);  

  
  const options = {
    responsive: true, 
    plugins: {
      legend: {
        display: true, 
        position: 'bottom', 
      },
      tooltip: {
        enabled: true, 
        backgroundColor: '#ffffff', // Tooltip background color
        titleColor: '#000000', // Tooltip title color
        bodyColor: '#333333', // Tooltip body text color
        borderWidth: 1, // Tooltip border width
        borderColor: '#007bff', // Tooltip border color
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Disable grid lines on x-axis
        },
        ticks: {
          color: '#000000', // Hardcoded x-axis tick color
        },
      },
      y: {
        beginAtZero: true, // Start y-axis at 0
        max: 100, // Max value for y-axis is now 100 to match task data
        ticks: {
          stepSize: 10, // Hardcoded step size for y-axis ticks
          color: '#000000', // Hardcoded y-axis tick color
        },
        grid: {
          color: '#e0e0e0', // Hardcoded grid line color for y-axis
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center  bg-blue-50 p-6">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-5xl">
        {/* Chart Section */}
        <div className="flex justify-between items-start">
          <div className="w-2/3 p-4">
            <h2 className="text-center text-xl font-semibold mb-4">Project Task Statistics</h2>
            <Bar data={data} options={options} /> 
            {/* Display average below the chart */}
          </div>

          {/* Sidebar Statistics */}
          <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-md ml-6">
            <div className="mb-4">
              <p className="text-lg font-semibold">Average Acceptance Rate:</p>
              <p className="text-4xl text-red-500 font-bold">{average.toFixed(2)}%</p>
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold">Highest Accuracy:</p>
              <p className="text-4xl text-green-500 font-bold">{highestAccuracy}%</p> {/* Calculated highest accuracy */}
            </div>
            <div>
              <p className="text-lg font-semibold">Lowest Accuracy:</p>
              <p className="text-4xl text-red-500 font-bold">{lowestAccuracy}%</p> {/* Calculated lowest accuracy */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestStats;
