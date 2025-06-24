import { useState, useEffect } from "react";
import Modal from "react-modal";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

Modal.setAppElement("#root");

const Reporte = ({ isOpen, onRequestClose }) => {
  const [facturas, setFacturas] = useState([]);
  const [criterio, setCriterio] = useState("fecha");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroPropietario, setFiltroPropietario] = useState("");

  useEffect(() => {
    const fetchFacturas = async () => {
      const snapshot = await getDocs(collection(db, "facturas"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFacturas(data);
    };
    if (isOpen) fetchFacturas();
  }, [isOpen]);

  const filtrarFacturas = () => {
    return facturas.filter((factura) => {
      if (criterio === "fecha" && filtroFecha) {
        return factura.fecha === filtroFecha;
      }
      if (criterio === "mes" && filtroMes) {
        return factura.fecha?.startsWith(filtroMes);
      }
      if (criterio === "propietario" && filtroPropietario.trim() !== "") {
        return factura.propietario?.toLowerCase().includes(filtroPropietario.trim().toLowerCase());
      }
      return true;
    });
  };

  const facturasFiltradas = filtrarFacturas();

  const agrupadas = facturasFiltradas.reduce((acc, factura) => {
    let clave;
    switch (criterio) {
      case "fecha":
        clave = factura.fecha;
        break;
      case "mes":
        clave = factura.fecha?.slice(0, 7); // "2025-06"
        break;
      case "propietario":
        clave = factura.propietario;
        break;
      case "estado":
        clave = factura.estado;
        break;
      case "pago":
        clave = factura.pago;
        break;
      case "servicio":
        factura.servicios?.forEach((serv) => {
          acc[serv] = (acc[serv] || 0) + factura.monto;
        });
        return acc;
      default:
        clave = "Otro";
    }
    acc[clave] = (acc[clave] || 0) + factura.monto;
    return acc;
  }, {});

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto mt-24"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start"
    >
      <h2 className="text-2xl font-bold mb-4">Reporte de Facturación</h2>

      {/* Selección de criterio */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
        <label className="font-semibold">Agrupar por:</label>
        <select
          value={criterio}
          onChange={(e) => {
            setCriterio(e.target.value);
            setFiltroFecha("");
            setFiltroMes("");
            setFiltroPropietario("");
          }}
          className="border p-2 rounded"
        >
          <option value="fecha">Fecha específica</option>
          <option value="mes">Mes</option>
          <option value="propietario">Propietario</option>
          <option value="servicio">Servicio</option>
          <option value="estado">Estado</option>
          <option value="pago">Tipo de pago</option>
        </select>

        {/* Filtros dinámicos según criterio */}
        {criterio === "fecha" && (
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="border p-2 rounded"
          />
        )}

        {criterio === "mes" && (
          <input
            type="month"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            className="border p-2 rounded"
          />
        )}

        {criterio === "propietario" && (
          <input
            type="text"
            placeholder="Buscar propietario..."
            value={filtroPropietario}
            onChange={(e) => setFiltroPropietario(e.target.value)}
            className="border p-2 rounded w-full md:w-60"
          />
        )}
      </div>

      {/* Tabla de resultados */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Categoría</th>
            <th className="p-2 text-left">Monto Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(agrupadas).map(([clave, monto]) => (
            <tr key={clave} className="border-t">
              <td className="p-2">{clave}</td>
              <td className="p-2">${monto.toFixed(2)}</td>
            </tr>
          ))}
          {Object.keys(agrupadas).length === 0 && (
            <tr>
              <td colSpan={2} className="text-center text-gray-500 p-4">
                No se encontraron resultados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-6 text-right">
        <button
          onClick={onRequestClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default Reporte;
