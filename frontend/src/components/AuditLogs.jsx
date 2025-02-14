import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import "./auditlogs.css";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auditlogs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(response.data);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      }
    };

    fetchLogs();
  }, [token]);

  return (
    <div className="auditlogs-container">
      <h1>Audit Logs</h1>
      <table className="auditlogs-table">
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Operation</th>
            <th>Record ID</th>
            <th>Old Data</th>
            <th>New Data</th>
            <th>Changed At</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.table_name}</td>
              <td>{log.operation}</td>
              <td>{log.record_id}</td>
              <td>
                <pre>{JSON.stringify(log.old_data, null, 2)}</pre>
              </td>
              <td>
                <pre>{JSON.stringify(log.new_data, null, 2)}</pre>
              </td>
              <td>{new Date(log.changed_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;
