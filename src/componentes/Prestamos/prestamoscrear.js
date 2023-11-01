import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CrearPrestamo() {
  const [selectedCliente, setSelectedCliente] = useState('');
  const [numeroCuotas, setNumeroCuotas] = useState(0);
  const [tasaInteres, setTasaInteres] = useState(0);
  const [frecuenciaPago, setFrecuenciaPago] = useState(0);
  const [capitalInicial, setCapitalInicial] = useState(0);
  const [duracionPrestamo, setDuracionPrestamo] = useState(0);
  const [fechainicio, setFechaPago] = useState('');

  const [clientes, setClientes] = useState([]);
  const [resultadoPrestamo, setResultadoPrestamo] = useState(null);

  useEffect(() => {
    // Realiza una solicitud GET para obtener la lista de clientes
    fetch('https://back-ramiro.onrender.com/clientes')
      .then((response) => {
        if (!response.ok) {
          throw  Error('Error al obtener la lista de clientes');
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

  const calcularPrestamo = () => {
    // Convierte los valores ingresados en números
    const numeroCuotasNumerico = parseInt(numeroCuotas, 10);
    const tasaInteresNumerico = parseFloat(tasaInteres);
    const capitalInicialNumerico = parseFloat(capitalInicial);
  
    if (isNaN(numeroCuotasNumerico) || isNaN(tasaInteresNumerico) || isNaN(capitalInicialNumerico)) {
      // Maneja el caso en el que los valores no sean numéricos
      alert('Por favor, asegúrate de ingresar valores numéricos válidos.');
      return;
    }
  
    // Realiza el cálculo del préstamo aquí
    const tasaInteresMensual = tasaInteresNumerico / 100;
    const montoTotal = capitalInicialNumerico + (capitalInicialNumerico * tasaInteresMensual * numeroCuotasNumerico);
    const cuota = montoTotal / numeroCuotasNumerico;
  
    // Actualiza el estado para mostrar el resultado
    setResultadoPrestamo({
      cuota: cuota.toFixed(2), // Formatea a dos decimales
      montoTotal: montoTotal.toFixed(2), // Formatea a dos decimales
    });
  };
  

  const crearPrestamo = async () => {
    if (!selectedCliente) {
      alert('Por favor, selecciona un cliente antes de crear el préstamo.');
      return;
    }

    const prestamoData = {
      ClienteId: selectedCliente,
      numeroCuotas: parseInt(numeroCuotas, 10),
      tasaInteres: parseFloat(tasaInteres),
      fechainicio,
      frecuenciaPago: parseInt(frecuenciaPago, 10),
      capitalInicial: parseFloat(capitalInicial),
      duracionPrestamo: parseInt(duracionPrestamo, 10),
    };

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
        setNumeroCuotas(0);
        setTasaInteres(0);
        setFrecuenciaPago(0);
        setCapitalInicial(0);
        setDuracionPrestamo(0);
        setResultadoPrestamo(null); // Limpia los resultados
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
        <input type="date" value={fechainicio} onChange={(e) => setFechaPago(e.target.value)} />
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
      <button onClick={calcularPrestamo}>Calcular</button>
      {resultadoPrestamo && (
        <div>
          <p>Cuota Mensual: ${resultadoPrestamo.cuota}</p>
          <p>Monto Total a Pagar: ${resultadoPrestamo.montoTotal}</p>
        </div>
      )}
      <button onClick={crearPrestamo}>Crear Préstamo</button>
      <Link to="/home">Volver a Inicio</Link>
    </div>
  );
}

export default CrearPrestamo;
