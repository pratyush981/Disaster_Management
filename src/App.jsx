import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import DataChart from './components/DataChart';
import DataDisplay from './components/DataDisplay';
import RefreshButton from './components/RefreshButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isDataChanged } from './utils/dataUtils';

const App = () => {
    const [data, setData] = useState([]);
    const [prevData, setPrevData] = useState([]); // Store previous data for comparison
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/data/output.csv');
                if (!response.ok) throw new Error('Network response was not ok.');
                const text = await response.text();

                Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: header => header.trim(),
                    complete: (results) => {
                        // Filter out entries with Rating set to 'False'
                        const newData = results.data.filter(item => item.Rating !== 'False');
                        
                        if (initialized && isDataChanged(prevData, newData)) {
                            toast.info('New disaster data has been added!');
                        }

                        // Update state with new data
                        setPrevData(data);
                        setData(newData);
                        setInitialized(true);
                    },
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data. Please try again later.');
            }
        };

        fetchData();

        // Poll for new data every 30 seconds
        const intervalId = setInterval(fetchData, 30000);

        return () => clearInterval(intervalId);
    }, [initialized, prevData, data]);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
            <ToastContainer />
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Disaster-Sense</h1>
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f0f0f0' }}>
                <DataDisplay data={data} />
            </div>
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Disaster Data Chart</h2>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <DataChart data={data} />
                </div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <RefreshButton />
            </div>
        </div>
    );
};

export default App;
