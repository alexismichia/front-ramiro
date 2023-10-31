import React, { useState } from 'react';
import './landing.css';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [mostrarFormularioCambioContrasena, setMostrarFormularioCambioContrasena] = useState(false);
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [usuario, setUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const iniciarSesion = async () => {
    try {
      const response = await fetch(`https://back-ramiro.onrender.com/usuarios?name=${usuario}&contrasena=${contrasenaActual}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setMensaje('Inicio de sesión exitoso. Redirigiendo...');
        setMostrarFormularioCambioContrasena(false);
        navigate('/home');
        setUsuario('');
        setContrasenaActual('');
        setNuevaContrasena('');
      } else {
        setMensaje('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMensaje('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    }
  };
  

  const cambiarContrasena = async () => {
    try {
      const response = await fetch('https://back-ramiro.onrender.com/usuarios', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contrasenaActual, nuevaContrasena }),
      });

      if (response.ok) {
        setMensaje('Contraseña cambiada con éxito.');
        setContrasenaActual('');
      } else {
        setMensaje('La contraseña actual es incorrecta. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setMensaje('Error al cambiar la contraseña. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="container">
      <h1>Landing Page</h1>
      <div className="form-container">
        <div className="login-form">
          <h2>Iniciar Sesión</h2>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasenaActual}
            onChange={(e) => setContrasenaActual(e.target.value)}
            autoComplete="off"
          />
          <button onClick={iniciarSesion}>Iniciar Sesión</button>
        </div>
        <div className="cambiar-contrasena-form">
          <button onClick={() => setMostrarFormularioCambioContrasena(!mostrarFormularioCambioContrasena)}>
            Cambiar Contraseña
          </button>
          {mostrarFormularioCambioContrasena && (
            <div>
              <h2>Cambio de Contraseña</h2>
              <input
                type="password"
                placeholder="Contraseña Actual"
                value={contrasenaActual}
                onChange={(e) => setContrasenaActual(e.target.value)}
              />
              <input
                type="password"
                placeholder="Nueva Contraseña"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
              />
              <button onClick={cambiarContrasena}>Cambiar Contraseña</button>
            </div>
          )}
        </div>
      </div>
      <p className="message">{mensaje}</p>
    </div>
  );
}

export default LandingPage;
