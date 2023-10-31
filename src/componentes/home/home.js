import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
const Home = () => {
  return (
    <div>
      <h1>Bienvenido al Panel de Control</h1>
      <div>
        <h2>Clientes</h2>
        <Link to="/clientes" className="button">Ver Clientes</Link>
        <Link to="/clientes/crear" className="button">Crear Cliente</Link>
      </div>
      <div>
        <h2>Préstamos</h2>
        <Link to="/prestamos" className="button">Ver Préstamos</Link>
        <Link to="/prestamos/crear" className="button">Crear Préstamo</Link>
      </div>
      <div>
        <h2>Pagos</h2>
        <Link to="/pagos" className="button">Ver Pagos</Link>
        <Link to="/pagos/registrar" className="button">Registrar Pago</Link>
      </div>
      <div>
        <h2>Estadísticas</h2>
        <Link to="/estadisticas/generales" className="button">Ver Estadísticas Generales</Link>
      </div>
    </div>
  );
};

export default Home;
