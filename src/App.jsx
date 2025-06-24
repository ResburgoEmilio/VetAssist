// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import RecepcionistaHome from "./pages/recepcionista/RecepcionistaHome";
import PacientesYPropietarios from "./pages/recepcionista/PacientesYPropietarios";
import ColaDeAtencion from "./pages/recepcionista/ColaDeAtencion";
import AgendaYTurnos from "./pages/recepcionista/AgendaYTurnos";
import Facturacion from "./pages/recepcionista/facturacion/Facturacion"; 
import Stock from "./pages/recepcionista/Stock";
import NuevoPropietario from "./pages/recepcionista/NuevoPropietario";  // Nueva ruta
import NuevoPaciente from "./pages/recepcionista/NuevoPaciente";  // Nueva ruta

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-6">
          <Routes>
            <Route path="/" element={<RecepcionistaHome />} />
            <Route path="/pacientes" element={<PacientesYPropietarios />} />
            <Route path="/cola" element={<ColaDeAtencion />} />
            <Route path="/agenda" element={<AgendaYTurnos />} />
            <Route path="/facturacion" element={<Facturacion />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/nuevo-propietario" element={<NuevoPropietario />} />  {/* Nueva ruta */}
            <Route path="/nuevo-paciente" element={<NuevoPaciente />} />  {/* Nueva ruta */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
