import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import "./manage.css";

const ManageAppliances = () => {
  const [appliances, setAppliances] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { token } = useAuth();
  const [newAppliance, setNewAppliance] = useState({
    name: "",
    type: "hours_per_day",
    kwh: "",
  });

  useEffect(() => {
    fetchAppliances();
  }, [token]);

  const fetchAppliances = async () => {
    try {
      const response = await axios.get("http://localhost:3000/appliances", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliances(response.data);
    } catch (error) {
      console.error("Error fetching appliances:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/appliances", newAppliance, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewAppliance({ name: "", type: "hours_per_day", kwh: "" });
      fetchAppliances();
    } catch (error) {
      console.error("Error creating appliance:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este electrodoméstico?")) {
      try {
        await axios.delete(`http://localhost:3000/appliances/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAppliances();
      } catch (error) {
        console.error("Error deleting appliance:", error);
      }
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:3000/appliances/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      fetchAppliances();
    } catch (error) {
      console.error("Error updating appliance:", error);
    }
  };

  return (
    <div className="manage-container">
      <h1>Gestionar Electrodomésticos</h1>

      <form onSubmit={handleSubmit} className="add-form">
        <h2>Agregar Nuevo Electrodoméstico</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={newAppliance.name}
          onChange={(e) =>
            setNewAppliance({ ...newAppliance, name: e.target.value })
          }
          required
        />
        <select
          value={newAppliance.type}
          onChange={(e) =>
            setNewAppliance({ ...newAppliance, type: e.target.value })
          }
          required
        >
          <option value="hours_per_day">Horas por día</option>
          <option value="times_per_week">Veces por semana</option>
        </select>
        <input
          type="number"
          placeholder="kWh"
          value={newAppliance.kwh}
          onChange={(e) =>
            setNewAppliance({
              ...newAppliance,
              kwh: parseFloat(e.target.value),
            })
          }
          required
          step="0.001"
        />
        <button type="submit">Agregar Electrodoméstico</button>
      </form>

      <table className="manage-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>kWh</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {appliances.map((appliance) => (
            <tr key={appliance.id}>
              <td>
                {editingId === appliance.id ? (
                  <input
                    type="text"
                    defaultValue={appliance.name}
                    onBlur={(e) =>
                      handleUpdate(appliance.id, {
                        ...appliance,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  appliance.name
                )}
              </td>
              <td>
                {editingId === appliance.id ? (
                  <select
                    defaultValue={appliance.type}
                    onBlur={(e) =>
                      handleUpdate(appliance.id, {
                        ...appliance,
                        type: e.target.value,
                      })
                    }
                  >
                    <option value="hours_per_day">Horas por día</option>
                    <option value="times_per_week">Veces por semana</option>
                  </select>
                ) : appliance.type === "hours_per_day" ? (
                  "Horas por día"
                ) : (
                  "Veces por semana"
                )}
              </td>
              <td>
                {editingId === appliance.id ? (
                  <input
                    type="number"
                    defaultValue={appliance.kwh}
                    step="0.001"
                    onBlur={(e) =>
                      handleUpdate(appliance.id, {
                        ...appliance,
                        kwh: parseFloat(e.target.value),
                      })
                    }
                  />
                ) : (
                  appliance.kwh
                )}
              </td>
              <td>
                <button onClick={() => setEditingId(appliance.id)}>
                  Editar
                </button>
                <button onClick={() => handleDelete(appliance.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAppliances;
