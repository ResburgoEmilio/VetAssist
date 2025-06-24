// src/pages/recepcionista/facturacion/NuevaFactura.jsx
import { useState } from "react";
import Modal from "react-modal";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";


const NuevaFactura = ({ isOpen, onRequestClose, onFacturaCreada }) => {
  const [formulario, setFormulario] = useState({
    propietario: "",
    monto: "",
    fecha: new Date().toISOString().split("T")[0], // formato YYYY-MM-DD
    servicios: "",
    estado: "pendiente",
    pago: "efectivo",
  });

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevaFactura = {
        ...formulario,
        monto: parseFloat(formulario.monto),
        servicios: formulario.servicios.split(",").map((s) => s.trim()),
      };
      await addDoc(collection(db, "facturas"), nuevaFactura);
      onFacturaCreada(); // Para refrescar la lista de facturas
      onRequestClose();
    } catch (error) {
      console.error("Error al crear factura:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mt-24 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
    >
      <h2 className="text-xl font-bold mb-4">Nueva Factura</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="propietario"
          placeholder="Nombre del propietario"
          value={formulario.propietario}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="monto"
          placeholder="Monto total"
          value={formulario.monto}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="fecha"
          value={formulario.fecha}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="servicios"
          placeholder="Servicios (separados por coma)"
          value={formulario.servicios}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <select name="estado" value={formulario.estado} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
        </select>
        <select name="pago" value={formulario.pago} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="Mercado Pago">Mercado Pago</option>
          <option value="transferencia">Transferencia</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onRequestClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NuevaFactura;
