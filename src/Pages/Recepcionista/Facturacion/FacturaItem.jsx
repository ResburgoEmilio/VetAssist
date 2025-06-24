// src/pages/recepcionista/facturacion/FacturaItem.jsx
import React, { useState } from "react";

const FacturaItem = ({ factura, onGuardarCambios }) => {
  // Estado local para controlar los valores editables
  const [editableFactura, setEditableFactura] = useState({ ...factura });

  // Manejar cambios en los campos
  const manejarCambio = (campo, valor) => {
    setEditableFactura({
      ...editableFactura,
      [campo]: valor,
    });
  };

  const manejarGuardar = () => {
    onGuardarCambios(editableFactura); // Llamar a la función de guardado con la factura modificada
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <h3 className="text-xl font-semibold">Detalles de la Factura</h3>

      <div className="mb-2">
        <label className="block">Servicios</label>
        <input
          type="text"
          value={editableFactura.servicios.join(", ")}
          onChange={(e) => manejarCambio("servicios", e.target.value.split(",").map(s => s.trim()))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block">Monto</label>
        <input
          type="number"
          value={editableFactura.monto}
          onChange={(e) => manejarCambio("monto", parseFloat(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block">Fecha de Facturación</label>
        <input
          type="date"
          value={editableFactura.fecha}
          onChange={(e) => manejarCambio("fecha", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block">Estado de Pago</label>
        <select
          value={editableFactura.estado}
          onChange={(e) => manejarCambio("estado", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block">Forma de Pago</label>
        <select
          value={editableFactura.pago}
          onChange={(e) => manejarCambio("pago", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="mercadoPago">Mercado Pago</option>
        </select>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={manejarGuardar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default FacturaItem;
