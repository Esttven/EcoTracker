import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import "./dashboard.css";

const Dashboard = () => {
  const [appliances, setAppliances] = useState([]);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  const [frequency, setFrequency] = useState("");
  const [totalUsage, setTotalUsage] = useState(0);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [consumptionRecords, setConsumptionRecords] = useState([]);
  const { token, userId } = useAuth();

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/appliances", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppliances(response.data);
      } catch (error) {
        console.error("Error en fetchData:", error.response?.data || error.message);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (!token || !userId) return;
    const fetchConsumptionRecords = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/electric-usages/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const records = response.data;
        setConsumptionRecords(records);

        const totalUsage = records.reduce(
          (sum, record) => sum + record.monthlyUsage,
          0
        );
        setTotalUsage(totalUsage);
        setCarbonFootprint(totalUsage * 0.92);
      } catch (error) {
        console.error("Error al obtener historial de consumo:", error.response?.data || error.message);
      }
    };
    fetchConsumptionRecords();
  }, [token, userId]);

  const handleSelectAppliance = (event) => {
    const selected = appliances.find(
      (appliance) => appliance.id === parseInt(event.target.value)
    );
    setSelectedAppliance(selected);
    setFrequency("");
  };

  const handleCalculate = async () => {
    if (!userId) {
      alert("Error: No se pudo obtener el ID del usuario. Intenta iniciar sesión nuevamente.");
      return;
    }
    if (!selectedAppliance) {
      alert("Por favor, selecciona un electrodoméstico.");
      return;
    }
    if (!frequency || parseInt(frequency, 10) <= 0) {
      alert("Ingresa una frecuencia válida.");
      return;
    }

    const newRecord = {
      applianceId: selectedAppliance.id,
      frequency: parseInt(frequency, 10),
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/electric-usages",
        newRecord,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 201) {
        const updatedRecords = [...consumptionRecords, response.data];
        setConsumptionRecords(updatedRecords);

        const totalUsage = updatedRecords.reduce(
          (sum, record) => sum + record.monthlyUsage,
          0
        );
        setTotalUsage(totalUsage);
        setCarbonFootprint(totalUsage * 0.92);
      }
    } catch (error) {
      alert("No se pudo guardar el registro en la base de datos.");
    }
  };

  const handleEdit = (id) => {
    alert(`Editar registro con ID: ${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este registro?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/electric-usages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsumptionRecords(consumptionRecords.filter((record) => record.id !== id));
    } catch (error) {
      alert("No se pudo eliminar el registro.");
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard de Consumo Energético</h1>
      <div className="dashboard-metrics">
        <p>
          <strong>Consumo mensual total:</strong> {totalUsage.toFixed(2)} kWh
        </p>
        <p>
          <strong>Huella de carbono:</strong> {carbonFootprint.toFixed(2)} kg CO2
        </p>
      </div>

      <div className="appliance-dropdown">
        <h2>Selecciona un electrodoméstico</h2>
        <select
          className="styled-dropdown"
          onChange={handleSelectAppliance}
          value={selectedAppliance?.id || ""}
        >
          <option value="" disabled>
            Elige un electrodoméstico
          </option>
          {appliances.length > 0 ? (
            appliances.map((appliance) => (
              <option key={appliance.id} value={appliance.id}>
                {appliance.name}
              </option>
            ))
          ) : (
            <option disabled>No hay electrodomésticos disponibles</option>
          )}
        </select>
      </div>

      {selectedAppliance && (
        <div className="input-section">
          <h3>
            Frecuencia de uso ({selectedAppliance.type === "hours_per_day" ? "Horas por día" : "Veces por semana"})
          </h3>
          <input
            type="number"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="Ingresa la cantidad"
          />
          <button className="calculate-btn" onClick={handleCalculate}>
            Calcular Consumo
          </button>
        </div>
      )}

      {/* Tabla de registros de consumo eléctrico */}
      <div className="consumption-table">
        <h2>Historial de Consumo</h2>
        <table>
          <thead>
            <tr>
              <th>Electrodoméstico</th>
              <th>Consumo Mensual (kWh)</th>
              <th>Huella de Carbono (kg CO2)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {consumptionRecords.length > 0 ? (
              consumptionRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.applianceName}</td>
                  <td>{record.monthlyUsage.toFixed(2)}</td>
                  <td>{(record.monthlyUsage * 0.92).toFixed(2)}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(record.id)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleDelete(record.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay registros de consumo</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
