import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ColaDeAtencion = () => {
  const [turnos, setTurnos] = useState([
    {
      id: 1,
      servicio: "Consulta",
      mascota: "Simba",
      propietario: "Carlos Pérez",
      hora: "10:00",
    },
    {
      id: 2,
      servicio: "Consulta",
      mascota: "Luna",
      propietario: "Laura Fernández",
      hora: "10:20",
    },
    {
      id: 3,
      servicio: "Cirugía",
      mascota: "Rocky",
      propietario: "Ana García",
      hora: "11:00",
    },
  ]);

  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoTurno, setNuevoTurno] = useState({
    servicio: "",
    mascota: "",
    propietario: "",
    hora: "",
  });
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

  const handleSeleccionar = (turno) => {
    // Seleccionamos el turno pero no abrimos el modal de modificación automáticamente
    setTurnoSeleccionado(turno);
  };

  const abrirModalNuevo = () => {
    // Abrimos el modal con campos vacíos para agregar un nuevo turno
    setNuevoTurno({
      servicio: "",
      mascota: "",
      propietario: "",
      hora: "",
    });
    setModalAbierto(true);  // Abrir el modal para "Nuevo Turno"
  };

  const abrirModalModificar = () => {
    if (turnoSeleccionado) {
      // Si hay un turno seleccionado, llenamos el modal con los datos del turno
      setNuevoTurno({
        servicio: turnoSeleccionado.servicio,
        mascota: turnoSeleccionado.mascota,
        propietario: turnoSeleccionado.propietario,
        hora: turnoSeleccionado.hora,
      });
      setModalAbierto(true);  // Abrir el modal de "Modificar"
    } else {
      alert("Selecciona un turno para modificar.");
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const handleGuardar = () => {
    if (!nuevoTurno.servicio || !nuevoTurno.mascota || !nuevoTurno.propietario || !nuevoTurno.hora) {
      alert("Por favor complete todos los campos.");
      return;
    }

    // Si estamos modificando un turno existente
    if (turnoSeleccionado) {
      const turnosActualizados = turnos.map((turno) =>
        turno.id === turnoSeleccionado.id
          ? { ...turno, ...nuevoTurno }
          : turno
      );
      setTurnos(turnosActualizados);
    } else {
      // Si estamos agregando un nuevo turno
      const nuevo = {
        ...nuevoTurno,
        id: Date.now(),
      };

      // Agregar el nuevo turno y ordenar por hora
      const turnosActualizados = [...turnos, nuevo].sort((a, b) => {
        return a.hora.localeCompare(b.hora);  // Ordenamos los turnos por hora
      });

      setTurnos(turnosActualizados);
    }
    cerrarModal();
  };

  const handleEliminar = () => {
    if (!turnoSeleccionado) return;
    setTurnos(turnos.filter((turno) => turno.id !== turnoSeleccionado.id));
    setTurnoSeleccionado(null);
    setConfirmarEliminacion(false);
  };

  const handleCancelarEliminacion = () => {
    setConfirmarEliminacion(false);
  };

  const turnosPorServicio = turnos.reduce((acc, turno) => {
    if (!acc[turno.servicio]) acc[turno.servicio] = [];
    acc[turno.servicio].push(turno);
    return acc;
  }, {});

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Cola de Atención</h2>

      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={abrirModalNuevo}  // Abrir el modal para nuevo turno
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nuevo
        </button>
        <button
          disabled={!turnoSeleccionado}
          onClick={abrirModalModificar} // Abrir el modal para modificar el turno seleccionado
          className={`px-4 py-2 rounded ${
            turnoSeleccionado
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-yellow-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Modificar
        </button>
        <button
          disabled={!turnoSeleccionado}
          onClick={() => setConfirmarEliminacion(true)} // Activar confirmación de eliminación
          className={`px-4 py-2 rounded ${
            turnoSeleccionado
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-red-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Eliminar
        </button>
      </div>

      {Object.entries(turnosPorServicio).map(([servicio, turnosFiltrados]) => (
        <div key={servicio} className="mb-8">
          <h3 className="text-xl font-semibold mb-2">{servicio}</h3>
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 text-center w-16">Orden</th>
                <th className="p-2 text-left w-1/3">Mascota</th>
                <th className="p-2 text-left w-1/3">Propietario</th>
                <th className="p-2 text-center w-24">Hora</th>
              </tr>
            </thead>
            <tbody>
              {turnosFiltrados.map((turno, idx) => (
                <tr
                  key={turno.id}
                  onClick={() => handleSeleccionar(turno)}  // Selección del turno
                  className={`cursor-pointer ${
                    turnoSeleccionado?.id === turno.id
                      ? "bg-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <td className="p-2 text-center">{idx + 1}</td>
                  <td className="p-2 text-left">{turno.mascota}</td>
                  <td className="p-2 text-left">{turno.propietario}</td>
                  <td className="p-2 text-center">{turno.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Modal para nuevo o modificar turno */}
      <Modal
        isOpen={modalAbierto}
        onRequestClose={cerrarModal}
        className="bg-white p-6 max-w-md mx-auto mt-20 rounded shadow"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">{turnoSeleccionado ? "Modificar Turno" : "Nuevo Turno"}</h2>
        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Servicio</label>
            <input
              type="text"
              value={nuevoTurno.servicio}
              onChange={(e) =>
                setNuevoTurno({ ...nuevoTurno, servicio: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Ej: Consulta, Cirugía"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Mascota</label>
            <input
              type="text"
              value={nuevoTurno.mascota}
              onChange={(e) =>
                setNuevoTurno({ ...nuevoTurno, mascota: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Propietario</label>
            <input
              type="text"
              value={nuevoTurno.propietario}
              onChange={(e) =>
                setNuevoTurno({ ...nuevoTurno, propietario: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Hora</label>
            <input
              type="time"
              value={nuevoTurno.hora}
              onChange={(e) =>
                setNuevoTurno({ ...nuevoTurno, hora: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </form>
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={cerrarModal}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </Modal>

      {/* Confirmación de eliminación de turno */}
      {confirmarEliminacion && (
        <Modal
          isOpen={confirmarEliminacion}
          onRequestClose={handleCancelarEliminacion}
          className="bg-white p-6 max-w-md mx-auto mt-20 rounded shadow"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
        >
          <h2 className="text-xl font-bold mb-4">¿Eliminar este turno?</h2>
          <p>¿Estás seguro de que deseas eliminar este turno?</p>
          <div className="flex justify-end mt-6 space-x-2">
            <button
              onClick={handleCancelarEliminacion}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={handleEliminar}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ColaDeAtencion;
