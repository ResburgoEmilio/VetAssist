import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Modal from "react-modal";

Modal.setAppElement("#root");

function PacientesYPropietarios() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
  const [modalModificarAbierto, setModalModificarAbierto] = useState(false);
  const [formDatos, setFormDatos] = useState({});

  const obtenerDatos = async () => {
    try {
      const pacientesSnapshot = await getDocs(collection(db, "pacientes"));
      const pacientesData = pacientesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPacientes(pacientesData);

      const propietariosSnapshot = await getDocs(collection(db, "propietarios"));
      const propietariosData = propietariosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPropietarios(propietariosData);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const buscarEnFirebase = async (busqueda) => {
    try {
      const pacientesSnapshot = await getDocs(collection(db, "pacientes"));
      const pacientesData = pacientesSnapshot.docs.filter((doc) => {
        const paciente = doc.data();
        return (
          paciente.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
          paciente.raza?.toLowerCase().includes(busqueda.toLowerCase()) ||
          paciente.tipo?.toLowerCase().includes(busqueda.toLowerCase()) ||
          paciente.color?.toLowerCase().includes(busqueda.toLowerCase())
        );
      });
      setPacientes(pacientesData.map((doc) => ({ id: doc.id, ...doc.data() })));

      const propietariosSnapshot = await getDocs(collection(db, "propietarios"));
      const propietariosData = propietariosSnapshot.docs.filter((doc) => {
        const propietario = doc.data();
        return (
          propietario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
          propietario.dni?.includes(busqueda)
        );
      });
      setPropietarios(propietariosData.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    }
  };

  useEffect(() => {
    if (busqueda.length >= 3) {
      buscarEnFirebase(busqueda.toLowerCase());
    } else {
      setPacientes([]);
      setPropietarios([]);
    }
  }, [busqueda]);

  const handleSeleccion = (ficha) => {
    setFichaSeleccionada(ficha);
  };

  const handleNuevoPropietario = () => {
    navigate("/nuevo-propietario");
  };

  const handleNuevoPaciente = () => {
    navigate("/nuevo-paciente");
  };

  const eliminarFicha = async () => {
    if (!fichaSeleccionada) return;
    const esPaciente = fichaSeleccionada?.raza !== undefined;
    const confirmacion = window.confirm(
      `¿Seguro que querés eliminar este ${esPaciente ? "paciente" : "propietario"}?`
    );
    if (!confirmacion) return;

    try {
      const coleccion = esPaciente ? "pacientes" : "propietarios";
      await deleteDoc(doc(db, coleccion, fichaSeleccionada.id));
      setFichaSeleccionada(null);
      await obtenerDatos();
      alert("Eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Ocurrió un error al eliminar.");
    }
  };

  const abrirModalModificar = () => {
    setFormDatos(fichaSeleccionada);
    setModalModificarAbierto(true);
  };

  const guardarCambios = async () => {
    if (!formDatos.id) return;
    const esPaciente = formDatos?.raza !== undefined;
    const coleccion = esPaciente ? "pacientes" : "propietarios";

    const { nuevaEntrada, ...datosActualizados } = formDatos;

    try {
      await updateDoc(doc(db, coleccion, formDatos.id), datosActualizados);
      setModalModificarAbierto(false);
      setFichaSeleccionada(null);
      await obtenerDatos();
      alert("Modificado correctamente.");
    } catch (error) {
      console.error("Error al modificar:", error);
      alert("Error al modificar los datos.");
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pacientes y Propietarios</h2>
        <div className="space-x-2">
          <button
            onClick={handleNuevoPropietario}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Nuevo Propietario
          </button>
          <button
            onClick={handleNuevoPaciente}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Nuevo Paciente
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            fichaSeleccionada
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-300 cursor-not-allowed"
          } text-white`}
          disabled={!fichaSeleccionada}
          onClick={abrirModalModificar}
        >
          Modificar
        </button>
        <button
          className={`px-4 py-2 rounded ${
            fichaSeleccionada
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-300 cursor-not-allowed"
          } text-white`}
          disabled={!fichaSeleccionada}
          onClick={eliminarFicha}
        >
          Eliminar
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por mascota, propietario, DNI, raza, tipo o color"
        className="w-full mb-6 p-3 border border-gray-300 rounded"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {pacientes.length === 0 && propietarios.length === 0 && busqueda.length >= 3 && (
        <p>No se encontraron resultados.</p>
      )}

      {pacientes.map((p) => (
        <div
          key={p.id}
          className={`bg-white p-4 rounded shadow mb-4 cursor-pointer ${
            fichaSeleccionada?.id === p.id ? "border-2 border-blue-600" : ""
          }`}
          onClick={() => handleSeleccion(p)}
        >
          <h3 className="text-lg font-bold mb-2">{p.nombre || "Sin nombre"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <p>
              <strong>Propietario:</strong> {p.propietario?.nombre || "Sin propietario"}
            </p>
            <p>
              <strong>Edad:</strong> {p.edad || "N/A"}
            </p>
            <p>
              <strong>Tipo:</strong> {p.tipo || "N/A"}
            </p>
            <p>
              <strong>Raza:</strong> {p.raza || "N/A"}
            </p>
            <p>
              <strong>Color:</strong> {p.color || "N/A"}
            </p>
          </div>

          {Array.isArray(p.historiaClinica) && p.historiaClinica.length > 0 && (
            <div className="mt-3 bg-gray-100 p-3 rounded">
              <h4 className="font-semibold mb-2">Historia Clínica:</h4>
              <ul className="text-sm space-y-2">
                {p.historiaClinica.map((entry, idx) => (
                  <li key={idx}>
                    <strong>{entry.fecha}:</strong> {entry.nota}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {propietarios.map((prop) => (
        <div
          key={prop.id}
          className={`bg-white p-4 rounded shadow mb-4 cursor-pointer ${
            fichaSeleccionada?.id === prop.id ? "border-2 border-blue-600" : ""
          }`}
          onClick={() => handleSeleccion(prop)}
        >
          <h3 className="text-lg font-bold">{prop.nombre || "Sin nombre"}</h3>
          <p>
            <strong>DNI:</strong> {prop.dni || "Sin DNI"}
          </p>
          <p>
            <strong>Email:</strong> {prop.email || "N/A"} | {" "}
            <strong>Teléfono:</strong> {prop.telefono || "N/A"} | {" "}
            <strong>Dirección:</strong> {prop.direccion || "N/A"}
          </p>
        </div>
      ))}
            <Modal
        isOpen={modalModificarAbierto}
        onRequestClose={() => setModalModificarAbierto(false)}
        className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto mt-20 max-h-[90vh] overflow-y-auto p-6"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50"
      >
        <h2 className="text-xl font-bold mb-4">
          Modificar {formDatos?.raza ? "Paciente" : "Propietario"}
        </h2>

        {formDatos?.raza ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {["nombre", "edad", "tipo", "raza", "color"].map((key) => (
              <div key={key}>
                <label className="block font-semibold mb-1 capitalize">{key}</label>
                <input
                  type="text"
                  value={formDatos[key] || ""}
                  onChange={(e) =>
                    setFormDatos({ ...formDatos, [key]: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        ) : (
          Object.entries(formDatos).map(([key, value]) =>
            key !== "id" && key !== "historiaClinica" && key !== "nuevaEntrada" ? (
              <div key={key} className="mb-3">
                <label className="block font-semibold mb-1 capitalize">{key}</label>
                <input
                  type="text"
                  value={formDatos[key] || ""}
                  onChange={(e) =>
                    setFormDatos({ ...formDatos, [key]: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ) : null
          )
        )}

        {formDatos?.raza && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Historia Clínica</h3>

            {Array.isArray(formDatos.historiaClinica) &&
              formDatos.historiaClinica.map((entrada, idx) => (
                <div key={idx} className="mb-4 border p-3 rounded relative bg-gray-50">
                  <label className="block text-sm font-semibold mb-1">Fecha</label>
                  <input
                    type="date"
                    value={entrada.fecha}
                    onChange={(e) => {
                      const nuevaHistoria = [...formDatos.historiaClinica];
                      nuevaHistoria[idx].fecha = e.target.value;
                      setFormDatos({ ...formDatos, historiaClinica: nuevaHistoria });
                    }}
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                  />
                  <label className="block text-sm font-semibold mb-1">Nota</label>
                  <textarea
                    rows="2"
                    value={entrada.nota}
                    onChange={(e) => {
                      const nuevaHistoria = [...formDatos.historiaClinica];
                      nuevaHistoria[idx].nota = e.target.value;
                      setFormDatos({ ...formDatos, historiaClinica: nuevaHistoria });
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    className="absolute top-2 right-2 text-red-600 text-sm"
                    onClick={() => {
                      const nuevaHistoria = formDatos.historiaClinica.filter((_, i) => i !== idx);
                      setFormDatos({ ...formDatos, historiaClinica: nuevaHistoria });
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}

            <label className="block font-semibold mt-4 mb-1">Nueva entrada</label>
            <textarea
              rows="3"
              placeholder="Escribí una nueva nota clínica..."
              className="w-full p-2 border border-gray-300 rounded mb-2"
              value={formDatos.nuevaEntrada || ""}
              onChange={(e) =>
                setFormDatos({ ...formDatos, nuevaEntrada: e.target.value })
              }
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => {
                if (!formDatos.nuevaEntrada?.trim()) return;

                const nuevaEntrada = {
                  fecha: new Date().toISOString().slice(0, 10),
                  nota: formDatos.nuevaEntrada.trim(),
                };

                const historiaActual = Array.isArray(formDatos.historiaClinica)
                  ? [...formDatos.historiaClinica]
                  : [];

                setFormDatos({
                  ...formDatos,
                  historiaClinica: [nuevaEntrada, ...historiaActual],
                  nuevaEntrada: "",
                });
              }}
            >
              Agregar Nota
            </button>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={() => setModalModificarAbierto(false)}
            className="px-4 py-2 rounded bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={guardarCambios}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default PacientesYPropietarios;
