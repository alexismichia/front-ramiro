import React, { useState, useEffect } from 'react';
import './prestamoslista.css';
import { Link } from 'react-router-dom'; // Importa Link para manejar las rutas

function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [filteredPrestamos, setFilteredPrestamos] = useState([]); // Lista filtrada de préstamos
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Realizar una solicitud GET para obtener la lista de préstamos
    fetch('https://back-ramiro.onrender.com/prestamos')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener la lista de préstamos');
        }
        return response.json();
      })
      .then((data) => {
        // Obtener los nombres de los clientes basados en el ID del cliente en cada préstamo
        const promises = data.map((prestamo) => {
          if (prestamo.ClienteId) {
            return fetch(`https://back-ramiro.onrender.com/clientes/${prestamo.ClienteId}`)
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Error al obtener los datos del cliente');
                }
                return response.json();
              });
          }
          return null;
        });
  
        Promise.all(promises).then((clientesNombres) => {
          // Asociar los nombres de los clientes a cada préstamo
          const prestamosConNombres = data.map((prestamo, index) => ({
            ...prestamo,
            cliente: clientesNombres[index],
          }));
          
          setPrestamos(prestamosConNombres);
          setFilteredPrestamos(prestamosConNombres);
        });
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);
  

  const eliminarPrestamo = async (id) => {
    try {
      // Realizar una solicitud DELETE para eliminar el préstamo por su ID
      const response = await fetch(`https://back-ramiro.onrender.com/prestamos/eliminar/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Si la eliminación fue exitosa, actualiza la lista de préstamos
        setPrestamos((prevPrestamos) => prevPrestamos.filter((prestamo) => prestamo.id !== id));
        setFilteredPrestamos((prevPrestamos) => prevPrestamos.filter((prestamo) => prestamo.id !== id));
      } else {
        throw new Error('Error al eliminar el préstamo');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Filtrar préstamos basados en la búsqueda
  const filterPrestamos = prestamos.filter((prestamo) => {
    if (searchQuery === '') {
      return true; // Si no hay consulta de búsqueda, mostrar todos los préstamos
    }
  
    const clienteNombre = prestamo.cliente && prestamo.cliente.nombre || '';
    
    // Asegúrate de que clienteNombre no sea undefined antes de aplicar toLowerCase
    return clienteNombre.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Lista de Préstamos</h1>
      <Link to={`/home`}>Volver a Inicio</Link>
      <input
        type="text"
        placeholder="Buscar cliente por nombre"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {filterPrestamos.map((prestamo) => (
          <li key={prestamo.id}>
             {prestamo.ClienteId && <ClienteDetails ClienteId={prestamo.ClienteId} />}
            <strong>Capital Inicial:</strong> ${prestamo.capitalInicial}<br />
            <strong>Tasa de Interes:</strong> {prestamo.tasaInteres}%<br />
            <strong>Monto Prestado:</strong> ${prestamo.montoTotal}<br />
            <strong>Monto Restante:</strong> ${prestamo.montoRestante}<br />
            <strong>Valor de la Cuota:</strong> ${prestamo.valorCuota}<br />
            <strong>Numero de Cuotas:</strong> {prestamo.numeroCuotas}<br />
            <strong>Cuotas Pagadas:</strong> {prestamo.cuotasPagadas}<br />
            {/* Botón para eliminar el préstamo */}
            <button onClick={() => eliminarPrestamo(prestamo.id)}>Eliminar</button>
            <Link to={`/prestamos/amortizaciones/${prestamo.id}`}>Ver Amortización</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}




// Componente para mostrar detalles del cliente
function ClienteDetails({ ClienteId }) {
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    // Realiza una solicitud GET para obtener los datos del cliente por su ID
    fetch(`https://back-ramiro.onrender.com/clientes/${ClienteId}`)
      .then((response) => {
        if (!response.ok) {
          throw  Error('Error al obtener los datos del cliente');
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
      <strong>Dirección del Cliente:</strong> {cliente.direccion}<br />
    </div>
  );
}

export default Prestamos;
