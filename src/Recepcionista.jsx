
import React from "react";

function Recepcionista() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Panel de Recepcionista</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Buscar Propietario o Mascota</h2>
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, teléfono o nombre de mascota"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Cola de Espera</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Firulais - Consulta general</li>
          <li>Michi - Vacuna</li>
          <li>Roco - Cirugía (especialista)</li>
        </ul>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Calendario de Veterinarios</h2>
        <p className="text-gray-600">(Aquí irá el calendario tipo Google Calendar en el futuro)</p>
      </div>
    </div>
  );
}

export default Recepcionista;
