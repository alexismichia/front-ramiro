import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './pagosregistrar.css';

function RealizarPagos() {
  const [prestamos, setPrestamos] = useState([]);
  const [error, setError] = useState(null);
  const [clientesNombres, setClientesNombres] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const response = await fetch('https://back-ramiro.onrender.com/prestamos');
        if (!response.ok) {
          throw new Error('Error al obtener la lista de préstamos');
        }
        const data = await response.json();
        setPrestamos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await fetch('https://back-ramiro.onrender.com/clientes');
        if (!response.ok) {
          throw new Error('Error al obtener la lista de clientes');
        }
        const data = await response.json();
        const nombres = {};
        data.forEach((cliente) => {
          nombres[cliente.id] = cliente.nombre;
        });
        setClientesNombres(nombres);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPrestamos();
    fetchClientes();
  }, []);

  const filteredPrestamos = prestamos.filter((prestamo) => {
    const clienteNombre = clientesNombres[prestamo.ClienteId] || '';
    return clienteNombre.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Realizar Pagos</h1>
      <Link to="/home">Volver a Inicio</Link>
      <input
        type="text"
        placeholder="Buscar cliente por nombre"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {filteredPrestamos.map((prestamo) => (
          <li key={prestamo.id}>
            <strong>Monto Prestado:</strong> ${prestamo.capitalInicial}<br />
            <strong>Tasa de Interés:</strong> {prestamo.tasaInteres}%<br />
            <strong>Monto total:</strong> ${prestamo.montoTotal}<br />
            <strong>Monto Restante:</strong> ${prestamo.montoRestante}<br />
            <strong>Valor de la Cuota:</strong> ${prestamo.valorCuota}<br />
            <strong>Numero de Cuotas:</strong> {prestamo.numeroCuotas}<br />
            <strong>Cuotas Pagadas:</strong> {prestamo.cuotasPagadas}<br />
            {prestamo.ClienteId && <ClienteDetails ClienteId={prestamo.ClienteId} />}
            <br />
            <Link to={`/realizar-pago/${prestamo.id}`}>Realizar Pago</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClienteDetails({ ClienteId }) {
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    // Realiza una solicitud GET para obtener los datos del cliente por su ID
    fetch(`https://back-ramiro.onrender.com/clientes/${ClienteId}`)
      .then((response) => {
        if (!response.ok) {
          throw Error('Error al obtener los datos del cliente');
        }
        return response.json();
      })
      .then((data) => {
        setCliente(data);
      });
  }, [ClienteId]);

  if (!cliente) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <strong>Nombre del Cliente:</strong> {cliente.nombre}<br />
    </div>
  );
}

export default RealizarPagos;
