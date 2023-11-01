// app.js o donde configures tu enrutamiento
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './componentes/home/home';
import LandingPage from './componentes/Landingpage/landing';
import ClientesLista from './componentes/Clientes/clienteslista';
import ClientesCrear from './componentes/Clientes/clientescrear';
import Prestamos from './componentes/Prestamos/prestamoslista';
import EstadisticasGenerales from './componentes/estadisticas/estadisticas';
import ListaPagos from './componentes/Pagos/pagoslista';
import RealizarPagos from './componentes/Pagos/pagosregistrar';
import PagosRealizar from './componentes/Pagos/pagorealizar';
import CrearPrestamo from './componentes/Prestamos/prestamoscrear';
import Amortizacion from './componentes/Prestamos/amortizacion';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/clientes" element={<ClientesLista />} />
        <Route path="/clientes/crear" element={<ClientesCrear />} />
        <Route path="/prestamos" element={<Prestamos />} />
        <Route path="/prestamos/crear" element={<CrearPrestamo />} />
        <Route path="/estadisticas/generales" element={<EstadisticasGenerales />} />
        <Route path="/pagos" element={<ListaPagos />} />
        <Route path="/pagos/registrar" element={<RealizarPagos />} />
        <Route path="/realizar-pago/:id" element={<PagosRealizar />} />
        <Route path="/prestamos/amortizaciones/:id" element={<Amortizacion />} />
        {/* Define más rutas según tus necesidades */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
