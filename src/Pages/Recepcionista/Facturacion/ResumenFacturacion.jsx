// src/pages/recepcionista/facturacion/ResumenFacturacion.jsx
import React from "react";

const ResumenFacturacion = ({ facturas }) => {
  const total = facturas.reduce((sum, factura) => sum + factura.monto, 0);

  // Agrupar por medio de pago
  const pagos = facturas.reduce((acc, factura) => {
    if (!acc[factura.pago]) {
      acc[factura.pago] = 0;
    }
    acc[factura.pago] += factura.monto;
    return acc;
  }, {});

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-sm mb-4">
      <h3 className="text-lg font-semibold">Resumen de Facturación</h3>
      <p>Total Facturado: ${total}</p>

      <h4 className="mt-4 text-md font-semibold">Agrupado por Medio de Pago:</h4>
      <ul>
        {Object.keys(pagos).map((medio) => (
          <li key={medio}>
            {medio.charAt(0).toUpperCase() + medio.slice(1)}: ${pagos[medio]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumenFacturacion;
