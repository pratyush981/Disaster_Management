import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DataChart = ({ data }) => {
    // Process data for disaster type counts
    const disasters = data.map(item => item.predicted_disaster).filter(Boolean);
    const dates = data.map(item => item.Date).filter(Boolean);

    // Count disaster occurrences by type
    const disasterCounts = disasters.reduce((acc, disaster) => {
        acc[disaster] = (acc[disaster] || 0) + 1;
        return acc;
    }, {});

    // Count occurrences by month-year
    const monthCounts = dates.reduce((acc, date) => {
        const month = new Date(date).toLocaleString('default', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    // Sort monthCounts by month-year
    const sortedMonthCounts = Object.entries(monthCounts).sort(([a], [b]) => new Date(a) - new Date(b));
    const monthLabels = sortedMonthCounts.map(([month]) => month);
    const monthData = sortedMonthCounts.map(([_, count]) => count);

    const disasterData = {
        labels: Object.keys(disasterCounts),
        datasets: [{
            label: 'Number of Occurrences by Disaster Type',
            data: Object.values(disasterCounts),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    const monthDataChart = {
        labels: monthLabels,
        datasets: [{
            label: 'Number of Occurrences by Month',
            data: monthData,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        }],
    };

    return (
        <div>
            <h2>Disaster Type Occurrences</h2>
            <Bar data={disasterData} />
            <h2>Occurrences by Month</h2>
            <Bar data={monthDataChart} />
        </div>
    );
};

export default DataChart;
