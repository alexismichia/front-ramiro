import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './pagorealizar.css';
import jsPDF from 'jspdf';
const logoURL= process.env.PUBLIC_URL+"/blanco.jpeg"
function PagosRealizar() {
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [fechaPago, setFechaPago] = useState('');
  const [montoRestante, setMontoRestante] = useState('');
  const [valorCuota, setValorCuota] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [cuotasTotales, setCuotasTotales] = useState(0);
  const [cuotaAPagar, setCuotaAPagar] = useState(0);

  const { id } = useParams(); // Obtén el ID del préstamo desde la URL

  useEffect(() => {
    // Realiza una solicitud GET para obtener la información del préstamo por su ID
    fetch(`https://back-ramiro.onrender.com/prestamos/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener la información del préstamo');
        }
        return response.json();
      })
      .then((data) => {
        setSelectedPrestamo(data);
        setMontoRestante(data.montoRestante);
        setValorCuota(data.valorCuota);
        setCuotasTotales(data.numeroCuotas);
        setCuotaAPagar(data.cuotasPagadas + 1);
      })
      .catch((err) => {
        console.error(err);
      });

    // Realiza una solicitud GET para obtener el nombre del cliente
    fetch(`https://back-ramiro.onrender.com/clientes/${selectedPrestamo?.ClienteId}`)
      .then((response) => {
        if (!response.ok) {
          throw Error('Error al obtener el nombre del cliente');
        }
        return response.json();
      })
      .then((data) => {
        setClienteNombre(data.nombre);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id, selectedPrestamo]);

  const generarPDF = () => {
    const doc = new jsPDF();
  
    // Título del comprobante
    doc.text('Comprobante de Pago', 10, 10);
  
    // Datos del cliente y pago
    doc.text('Nombre del Cliente: ' + clienteNombre, 10, 20);
    doc.text('Valor de la Cuota: $' + valorCuota, 10, 40);
    doc.text('Fecha de Pago: ' + fechaPago, 10, 60);
    doc.text('Número de cuota: ' + cuotaAPagar + ' de ' + cuotasTotales, 10, 80);
    if (cuotaAPagar > cuotasTotales) {
      doc.text('Crédito Finalizado', 10, 100);
    }
  
    // Datos de la empresa
    doc.text('Nombre de la Empresa: Acredit', 10, 120);
    doc.text('Email de Contacto: ramiroherrerainversiones@gmail.com', 10, 140);
    doc.text('Teléfono de Contacto: 3471330800', 10, 160);
    doc.addImage(logoURL,"JPEG",75,180,60,60)
  
    doc.save('comprobante_pago.pdf');
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fechaPago) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    try {
      const response = await fetch('https://back-ramiro.onrender.com/pagos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prestamoId: id, // Utiliza el ID del préstamo de la URL
          fechaPago: fechaPago,
        }),
      });

      if (response.ok) {
        generarPDF(); // Genera el PDF al realizar el pago exitosamente
        alert('Pago registrado exitosamente.');
        setFechaPago('');
      } else {
        const data = await response.json();
        alert(`Error al registrar el pago: ${data.error}`);
      }
    } catch (error) {
      alert('Error al registrar el pago.');
    }
  };

  return (
    <div className="container">
      <h1>Realizar Pagos</h1>
      <p>
        <strong>Nombre del Cliente:</strong> {clienteNombre}
      </p>
      <p>
        <strong>Monto Restante:</strong> ${montoRestante}
      </p>
      <p>
        <strong>Valor de la Cuota:</strong> ${valorCuota}
      </p>
      <p>
        <strong>Número de Cuota a Pagar:</strong> {cuotaAPagar} de {cuotasTotales}
        {cuotaAPagar > cuotasTotales && ' - Crédito Finalizado'}
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Fecha de Pago:
          <input
            type="date"
            value={fechaPago}
            onChange={(e) => setFechaPago(e.target.value)}
          />
        </label>
        <button type="submit">Realizar Pago</button>
      </form>
      <Link to="/pagos/registrar" className="link-volver">
        Volver a Pagos
      </Link>
      <Link to="/home" className="link-volver">
        Volver a Inicio
      </Link>
    </div>
  );
}

export default PagosRealizar;
