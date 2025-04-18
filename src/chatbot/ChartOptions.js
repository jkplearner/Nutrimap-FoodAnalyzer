// Common chart options and configurations
export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#fff',
        padding: 20,
        font: {
          size: 14,
          weight: 'bold',
        },
      },
    },
  },
};

export const radarOptions = {
  ...commonChartOptions,
  scales: {
    r: {
      min: 0,
      max: 100, // Set a fixed maximum
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      angleLines: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      pointLabels: {
        color: '#fff',
        font: {
          size: 14,
          weight: 'bold',
        },
      },
      ticks: {
        stepSize: 20,
        color: 'rgba(255, 255, 255, 0.7)',
        backdropColor: 'transparent',
      },
    },
  },
};

export const barOptions = {
  ...commonChartOptions,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#fff',
        font: {
          size: 12,
        },
        // Add max value to prevent infinite scaling
        max: 1000, // Adjust this based on your data range
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#fff',
        font: {
          size: 12,
        },
      },
    },
  },
};
