import React, { useState, useEffect } from 'react';
import './estadisticas.css';

function EstadisticasGenerales() {
  const [estadisticas, setEstadisticas] = useState(null);

  useEffect(() => {
    // Realizar una solicitud POST para obtener las estadísticas generales
    fetch('https://back-ramiro.onrender.com/estadisticas', {
      method: 'POST',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las estadísticas generales');
        }
        return response.json();
      })
      .then((data) => {
        setEstadisticas(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="container">
      <h1>Estadísticas Generales</h1>
      {estadisticas ? (
        <div>
          <p>Total Prestado: ${estadisticas.totalPrestado}</p>
          <p>Intereses Totales: ${estadisticas.interesesTotales}</p>
          <p>Monto Pendiente de Cobro: ${estadisticas.pendienteCobro}</p>
          <p>Cobrado Total: ${estadisticas.cobradoTotal}</p>
        </div>
      ) : (
        <p>Cargando estadísticas...</p>
      )}
      <button onClick={() => window.location.href = '/home'}>Volver a Inicio</button>
    </div>
  );
}

export default EstadisticasGenerales;
