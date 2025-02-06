import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/register', { email, password, username });
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error al registrarse');
    }
  };

  return (
    <div>
      <h1>Registrarse</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de usuario:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Correo electrónico:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;