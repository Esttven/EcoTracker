import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import "./manage.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:3000/users/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="manage-container">
      <h1>Gestionar Usuarios</h1>

      <table className="manage-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol Admin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    defaultValue={user.username}
                    onBlur={(e) =>
                      handleUpdate(user.id, {
                        ...user,
                        username: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>{user.email}</td>
              <td>
                {editingId === user.id ? (
                  <select
                    defaultValue={user.adminId}
                    onBlur={(e) =>
                      handleUpdate(user.id, {
                        ...user,
                        adminId: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="0">Usuario</option>
                    <option value="1">Admin</option>
                  </select>
                ) : user.adminId === 1 ? (
                  "Admin"
                ) : (
                  "Usuario"
                )}
              </td>
              <td>
                <button onClick={() => setEditingId(user.id)}>Editar</button>
                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
