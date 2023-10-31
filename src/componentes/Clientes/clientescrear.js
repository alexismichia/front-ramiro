import React, { useState } from 'react';
import './clientescrear.css';
import { useNavigate } from 'react-router-dom';
function ClientesCrear() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [referenciaPersonal, setReferenciaPersonal] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const crearCliente = async () => {
    try {
      const response = await fetch('https://back-ramiro.onrender.com/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          correo,
          identificacion,
          direccion,
          referenciaPersonal,
        }),
      });

      if (response.ok) {
        setMensaje('Cliente creado con éxito');
        // Limpia los campos después de la creación exitosa
        setNombre('');
        setCorreo('');
        setIdentificacion('');
        setDireccion('');
        setReferenciaPersonal('');
      } else {
        setMensaje('Error al crear el cliente. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al crear el cliente:', error);
      setMensaje('Error al crear el cliente. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="container">
      <h1>Crear Cliente</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Identificación"
          value={identificacion}
          onChange={(e) => setIdentificacion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Referencia Personal"
          value={referenciaPersonal}
          onChange={(e) => setReferenciaPersonal(e.target.value)}
        />
        <button onClick={crearCliente}>Crear Cliente</button>
        <button onClick={() => navigate('/clientes')}>Ir a la lista de clientes</button>
        <button onClick={() => navigate('/home')}>Ir a la página de inicio</button>
      </div>
      <p className="message">{mensaje}</p>
    </div>
  );
}

export default ClientesCrear;
