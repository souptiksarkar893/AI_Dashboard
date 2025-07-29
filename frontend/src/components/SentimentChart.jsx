import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const SentimentChart = ({ sentimentData, chartType = 'pie' }) => {
  const { positive, negative, neutral } = sentimentData;

  const pieData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [positive, negative, neutral],
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(231, 76, 60, 0.8)',
          'rgba(243, 156, 18, 0.8)',
        ],
        borderColor: [
          '#2ecc71',
          '#e74c3c',
          '#f39c12',
        ],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        label: 'Number of Posts',
        data: [positive, negative, neutral],
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(231, 76, 60, 0.8)',
          'rgba(243, 156, 18, 0.8)',
        ],
        borderColor: [
          '#2ecc71',
          '#e74c3c',
          '#f39c12',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            family: 'Poppins',
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
      },
    },
    scales: chartType === 'bar' ? {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            family: 'Poppins',
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            family: 'Poppins',
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
    } : {},
  };

  return (
    <div className="chart-container">
      {chartType === 'pie' ? (
        <Pie data={pieData} options={chartOptions} />
      ) : (
        <Bar data={barData} options={chartOptions} />
      )}
    </div>
  );
};

export default SentimentChart;
