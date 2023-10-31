import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CrearPrestamo() {
  const [selectedCliente, setSelectedCliente] = useState('');
  const [numeroCuotas, setNumeroCuotas] = useState(0); // Inicializa con 0
  const [tasaInteres, setTasaInteres] = useState(0); // Inicializa con 0
  const [frecuenciaPago, setFrecuenciaPago] = useState(0); // Inicializa con 0
  const [capitalInicial, setCapitalInicial] = useState(0); // Inicializa con 0
  const [duracionPrestamo, setDuracionPrestamo] = useState(0); // Inicializa con 0
  const [fechainicio, setFechaPago] = useState('');

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Realiza una solicitud GET para obtener la lista de clientes
    fetch('https://back-ramiro.onrender.com/clientes')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener la lista de clientes');
        }
        return response.json();
      })
      .then((data) => {
        setClientes(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const crearPrestamo = async () => {
    if (!selectedCliente) {
      alert('Por favor, selecciona un cliente antes de crear el préstamo.');
      return;
    }

    const prestamoData = {
      ClienteId: selectedCliente,
      numeroCuotas: parseInt(numeroCuotas, 10), // Convierte a número entero
      tasaInteres: parseFloat(tasaInteres), // Convierte a número decimal
      fechainicio,
      frecuenciaPago: parseInt(frecuenciaPago, 10), // Convierte a número entero
      capitalInicial: parseFloat(capitalInicial), // Convierte a número decimal
      duracionPrestamo: parseInt(duracionPrestamo, 10), // Convierte a número entero
    };
    console.log("hola",prestamoData);
    try {
      const response = await fetch('https://back-ramiro.onrender.com/prestamos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prestamoData),
      });

      if (response.ok) {
        alert('Préstamo creado exitosamente');

        setSelectedCliente('');
        setNumeroCuotas(0); // Reinicia con 0
        setTasaInteres(0); // Reinicia con 0
        setFrecuenciaPago(0); // Reinicia con 0
        setCapitalInicial(0); // Reinicia con 0
        setDuracionPrestamo(0); // Reinicia con 0
      } else {
        const data = await response.json();
        alert(`Error al crear el préstamo: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error al crear el préstamo');
    }
  };

  return (
    <div className="container">
      <h1>Crear Préstamo</h1>
      <label>
        Cliente:
        <select value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)}>
          <option value="">Selecciona un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Número de Cuotas:
        <input type="number" value={numeroCuotas} onChange={(e) => setNumeroCuotas(e.target.value)} />
      </label>
      <label>
        Tasa de Interés (%):
        <input type="number" value={tasaInteres} onChange={(e) => setTasaInteres(e.target.value)} />
      </label>
      <label>
        Fecha de Inicio:
        <input
          type="date"
          value={fechainicio}
          onChange={(e) => setFechaPago(e.target.value)}
        />
      </label>
      <label>
        Frecuencia de Pago:
        <input type="number" value={frecuenciaPago} onChange={(e) => setFrecuenciaPago(e.target.value)} />
      </label>
      <label>
        Capital Inicial:
        <input type="number" value={capitalInicial} onChange={(e) => setCapitalInicial(e.target.value)} />
      </label>
      <label>
        Duración del Préstamo (meses):
        <input type="number" value={duracionPrestamo} onChange={(e) => setDuracionPrestamo(e.target.value)} />
      </label>
      <button onClick={crearPrestamo}>Crear Préstamo</button>
      <Link to="/home">Volver a Inicio</Link>
    </div>
  );
}


export default CrearPrestamo;
