import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './pagoslista.css'

function ListaPagos() {
  const [pagos, setPagos] = useState([]);
  const [datosAdicionales, setDatosAdicionales] = useState([]);

  const cargarPagos = async () => {
    try {
      const response = await fetch('https://back-ramiro.onrender.com/pagos');
      if (response.ok) {
        const pagosData = await response.json();
        setPagos(pagosData);
      }
    } catch (error) {
      console.error('Error al cargar la lista de pagos: ', error);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return '';
    }
    return fecha.slice(0, 10);
  };
  
  

  const cargarDatosAdicionales = async (pago) => {
    const prestamoResponse = await fetch(`https://back-ramiro.onrender.com/prestamos/${pago.prestamoId}`);
    const prestamoData = await prestamoResponse.json();

    const clienteResponse = await fetch(`https://back-ramiro.onrender.com/clientes/${prestamoData.ClienteId}`);
    const clienteData = await clienteResponse.json();

    return (
      <li key={pago.id}>
        <strong>Número de Cuota:</strong> {prestamoData.cuotasPagadas}/{prestamoData.numeroCuotas}
        <br />
        <strong>Valor de la Cuota Pagada:</strong> ${pago.monto}
        <br />
        <strong>Cliente:</strong> {clienteData.nombre}
        <br />
        <strong>Monto Restante:</strong> ${prestamoData.montoRestante}
        <br />
        <strong>Fecha del Pago:</strong> {formatearFecha(pago.fechaPago)}
      </li>
    );
  };

  useEffect(() => {
    cargarPagos();
  }, []);

  useEffect(() => {
    const promesasDatosAdicionales = pagos.map(pago => cargarDatosAdicionales(pago));

    Promise.all(promesasDatosAdicionales)
      .then(elementosRenderizables => setDatosAdicionales(elementosRenderizables));
  }, [pagos]);

  return (
    <div>
      <h1>Lista de Pagos</h1>
      <Link to="/home" className="volver-inicio">Volver a Inicio</Link>
      <ul>
        {datosAdicionales}
      </ul>
      
 {/* Agrega el botón de volver a inicio */}
    </div>
  );
}

export default ListaPagos;
