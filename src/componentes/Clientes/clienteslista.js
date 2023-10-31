import React, { useState, useEffect } from 'react';
import './clienteslista.css';
import { Link } from 'react-router-dom';

function ClientesLista() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Realizar una solicitud GET para obtener la lista de clientes
    fetch('https://back-ramiro.onrender.com/clientes')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener la lista de clientes');
        }
        return response.json();
      })
      .then((data) => {
        // Comprobar si data es un array o un objeto
        if (Array.isArray(data)) {
          setClientes(data);
        } else {
          // Si data no es un array, crea un array con un solo elemento
          setClientes(data ? [data] : []);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const eliminarCliente = async (id) => {
    try {
      // Realizar una solicitud DELETE para eliminar el préstamo por su ID
      const response = await fetch(`https://back-ramiro.onrender.com/clientes/eliminar/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Si la eliminación fue exitosa, actualiza la lista de préstamos
        setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.id !== id));
      } else {
        throw new Error('Error al eliminar el cliente');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = () => {
    // Realizar una solicitud GET para buscar clientes por nombre
    fetch(`https://back-ramiro.onrender.com/clientes/buscar/${searchTerm}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al buscar clientes');
        }
        return response.json();
      })
      .then((data) => {
        // Comprobar si data es un array o un objeto
        if (Array.isArray(data)) {
          setClientes(data);
        } else {
          // Si data no es un array, crea un array con un solo elemento
          setClientes(data ? [data] : []);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Lista de Clientes</h1>
      <Link to="/home" className="back-button">
        Volver a Inicio
      </Link>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            <strong>Nombre:</strong> {cliente.nombre}<br />
            <strong>Correo:</strong> {cliente.correo}<br />
            <strong>Identificación:</strong> {cliente.identificacion}<br />
            <strong>Dirección:</strong> {cliente.direccion}<br />
            <strong>Referencia Personal:</strong> {cliente.referenciaPersonal}
            <button onClick={() => eliminarCliente(cliente.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientesLista;
