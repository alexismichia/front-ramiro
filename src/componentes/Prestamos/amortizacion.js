import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './amortizacion.css'; // Importa tu archivo de CSS personalizado

function Amortizacion() {
  const { id } = useParams();
  const [amortizacion, setAmortizacion] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Realizar una solicitud GET para obtener la amortización en función del ID del préstamo
    fetch(`https://back-ramiro.onrender.com/amortizacion/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener la amortización');
        }
        return response.json();
      })
      .then((data) => {
        setAmortizacion(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
        <Link to="/Home">Volver a Inicio</Link>
      <Link to="/prestamos">Volver a Prestamos</Link>
      <h1>Detalles de Amortización</h1>
      {amortizacion.map((cuota) => (
        <div key={cuota.numeroCuota} className="cuota-card">
          <p>
            <strong>Fecha de Pago:</strong> {cuota.fechaPago.substring(0, 10)}
          </p>
          <p>
            <strong>Valor de Cuota:</strong> ${cuota.valorCuota}
          </p>
          <p>
            <strong>Estado de Pago:</strong> {cuota.estadoPago}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Amortizacion;
