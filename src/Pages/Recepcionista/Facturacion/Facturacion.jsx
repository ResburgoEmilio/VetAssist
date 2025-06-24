// src/pages/recepcionista/facturacion/Facturacion.jsx
import { useState, useEffect, Fragment } from "react";
import Modal from "react-modal";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import FacturaItem from "./FacturaItem";
import ResumenFacturacion from "./ResumenFacturacion";
import NuevaFactura from "../NuevaFactura";
import Reporte from "../Reporte";

Modal.setAppElement("#root");

const Facturacion = () => {
  const [filtro, setFiltro] = useState("dia");
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [modalNuevaFactura, setModalNuevaFactura] = useState(false);
  const [modalReporte, setModalReporte] = useState(false);

  const cargarFacturas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "facturas"));
      const datos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFacturas(datos);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las facturas:", error);
    }
  };

  useEffect(() => {
    cargarFacturas();
  }, []);

  const facturasFiltradas = facturas
    .filter((factura) => {
      const facturaFecha = new Date(factura.fecha);
      const hoy = new Date();

      if (filtro === "dia") {
        const hoyISO = hoy.toISOString().split("T")[0];
        return factura.fecha === hoyISO;
      } else if (filtro === "semana") {
        const primerDia = new Date(hoy);
        primerDia.setDate(hoy.getDate() - hoy.getDay());
        const ultimoDia = new Date(primerDia);
        ultimoDia.setDate(primerDia.getDate() + 6);
        return facturaFecha >= primerDia && facturaFecha <= ultimoDia;
      } else if (filtro === "mes") {
        return (
          facturaFecha.getMonth() === hoy.getMonth() &&
          facturaFecha.getFullYear() === hoy.getFullYear()
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const manejarExpandirFactura = (id) => {
    setFacturaSeleccionada(facturaSeleccionada === id ? null : id);
  };

  const manejarGuardarCambios = async (facturaModificada) => {
    try {
      await updateDoc(doc(db, "facturas", facturaModificada.id), facturaModificada);
      setFacturas((prev) =>
        prev.map((f) => (f.id === facturaModificada.id ? facturaModificada : f))
      );
      setFacturaSeleccionada(null);
    } catch (error) {
      console.error("Error al guardar la factura:", error);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Facturación</h2>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            onClick={() => setFiltro("dia")}
            className={`mr-2 px-3 py-1 rounded ${filtro === "dia" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Hoy
          </button>
          <button
            onClick={() => setFiltro("semana")}
            className={`mr-2 px-3 py-1 rounded ${filtro === "semana" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setFiltro("mes")}
            className={`mr-2 px-3 py-1 rounded ${filtro === "mes" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Este Mes
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setModalNuevaFactura(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Nueva Factura
          </button>
          <button
            onClick={() => setModalReporte(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            📊 Reporte
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando facturas...</p>
      ) : (
        <>
          <ResumenFacturacion facturas={facturasFiltradas} />

          <table className="w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Propietario</th>
                <th className="p-2">Monto</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Servicios</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Pago</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturasFiltradas.map((factura) => (
                <Fragment key={factura.id}>
                  <tr className="border-t">
                    <td className="p-2">{factura.propietario}</td>
                    <td className="p-2">${factura.monto}</td>
                    <td className="p-2">{factura.fecha}</td>
                    <td className="p-2">{factura.servicios?.join(", ")}</td>
                    <td className="p-2">
                      <span className={factura.estado === "pendiente" ? "text-red-500" : "text-green-500"}>
                        {factura.estado}
                      </span>
                    </td>
                    <td className="p-2">{factura.pago}</td>
                    <td className="p-2">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => manejarExpandirFactura(factura.id)}
                      >
                        {facturaSeleccionada === factura.id ? "Colapsar" : "Ver Detalles"}
                      </button>
                    </td>
                  </tr>

                  {facturaSeleccionada === factura.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="p-4">
                        <FacturaItem factura={factura} onGuardarCambios={manejarGuardarCambios} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </>
      )}

      <NuevaFactura
        isOpen={modalNuevaFactura}
        onRequestClose={() => setModalNuevaFactura(false)}
        onFacturaCreada={cargarFacturas}
      />
      <Reporte
        isOpen={modalReporte}
        onRequestClose={() => setModalReporte(false)}
      />
    </div>
  );
};

export default Facturacion;