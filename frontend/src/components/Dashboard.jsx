import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const [usages, setUsages] = useState([]);
  const [totalUsage, setTotalUsage] = useState(0);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/electric-usage', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsages(response.data);
        calculateTotalUsage(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  const calculateTotalUsage = (usages) => {
    const total = usages.reduce((sum, usage) => sum + usage.monthlyUsage, 0);
    setTotalUsage(total);
    setCarbonFootprint(total * 0.92); // Example conversion factor
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/electric-usage/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsages(usages.filter((usage) => usage.id !== id));
      calculateTotalUsage(usages.filter((usage) => usage.id !== id));
    } catch (error) {
      console.error('Error deleting usage:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Consumo mensual total: {totalUsage.toFixed(2)} kWh</h2>
      <h2>Huella de carbono: {carbonFootprint.toFixed(2)} kg CO2</h2>
      <table>
        <thead>
          <tr>
            <th>Electrodoméstico</th>
            <th>Frecuencia</th>
            <th>Consumo mensual (kWh)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usages.map((usage) => (
            <tr key={usage.id}>
              <td>{usage.applianceName}</td>
              <td>{usage.frequency}</td>
              <td>{usage.monthlyUsage.toFixed(2)}</td>
              <td>
                <button onClick={() => handleDelete(usage.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default Dashboard;