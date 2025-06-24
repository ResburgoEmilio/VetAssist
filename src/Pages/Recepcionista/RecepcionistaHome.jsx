import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

function RecepcionistaHome() {
  const [busquedaPaciente, setBusquedaPaciente] = useState("");
  const [busquedaStock, setBusquedaStock] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [stock, setStock] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      const pacientesSnap = await getDocs(collection(db, "pacientes"));
      const pacientesData = pacientesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPacientes(pacientesData);

      const propietariosSnap = await getDocs(collection(db, "propietarios"));
      const propietariosData = propietariosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPropietarios(propietariosData);

      const stockSnap = await getDocs(collection(db, "insumos"));
      const stockData = stockSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStock(stockData);
    };

    cargarDatos();
  }, []);

  const resultadosPacientes = pacientes.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
      p.raza?.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
      p.tipo?.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
      p.color?.toLowerCase().includes(busquedaPaciente.toLowerCase())
  );

  const resultadosPropietarios = propietarios.filter(
    (prop) =>
      prop.nombre?.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
      prop.dni?.includes(busquedaPaciente)
  );

  const resultadosStock = stock.filter((s) =>
    s.nombre.toLowerCase().includes(busquedaStock.toLowerCase())
  );

  const handleSeleccionPaciente = () => {
    navigate("/pacientes", { state: { busqueda: busquedaPaciente } });
  };

  const handleSeleccionStock = (articuloId) => {
    navigate("/stock", { state: { articuloId } });
  };

  return (
    <div className="p-6 w-full space-y-12">
      {/* Buscador de Pacientes y Propietarios */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Buscador de Pacientes</h1>
        <input
          type="text"
          placeholder="Buscar por mascota, propietario, DNI, raza, tipo o color"
          value={busquedaPaciente}
          onChange={(e) => setBusquedaPaciente(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />
        {busquedaPaciente && (
          <ul className="space-y-2">
            {resultadosPacientes.map((p) => (
              <li
                key={p.id}
                onClick={handleSeleccionPaciente}
                className="cursor-pointer bg-white p-3 rounded shadow hover:bg-gray-100 transition"
              >
                <p><strong>{p.nombre}</strong> ({p.tipo})</p>
                <p>Raza: {p.raza} | Color: {p.color}</p>
              </li>
            ))}
            {resultadosPropietarios.map((prop) => (
              <li
                key={prop.id}
                onClick={handleSeleccionPaciente}
                className="cursor-pointer bg-white p-3 rounded shadow hover:bg-gray-100 transition"
              >
                <p><strong>{prop.nombre}</strong></p>
                <p>DNI: {prop.dni}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Buscador de Stock */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Buscador de Insumos</h1>
        <input
          type="text"
          placeholder="Buscar insumo por nombre"
          value={busquedaStock}
          onChange={(e) => setBusquedaStock(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />
        {busquedaStock && (
          <ul className="space-y-2">
            {resultadosStock.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSeleccionStock(item.id)}
                className="cursor-pointer bg-white p-3 rounded shadow hover:bg-gray-100 transition"
              >
                <p><strong>{item.nombre}</strong></p>
                <p>💵 Precio de Venta: ${item.precioVenta}</p>
                <p>📦 Precio de Compra: ${item.precioCompra}</p>
                <p>📊 Cantidad Disponible: {item.cantidad}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RecepcionistaHome;
