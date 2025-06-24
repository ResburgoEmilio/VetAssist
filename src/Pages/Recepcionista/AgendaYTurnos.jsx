import { useState, useEffect, useMemo } from "react";
import { db } from "../../firebase"; // Firebase configuration
import { getDocs, collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import AgregarVeterinario from "./AgregarVeterinario"; // Importar el componente AgregarVeterinario
import VerTurnos from "./VerTurnos"; // Importar el componente VerTurnos

const VeterinariosPage = () => {
  const [busqueda, setBusqueda] = useState("");
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [veterinarioSeleccionado, setVeterinarioSeleccionado] = useState(null);
  const [mostrarAgenda, setMostrarAgenda] = useState(false); // Controlar si se debe mostrar la agenda
  const [mostrarAgregarVeterinario, setMostrarAgregarVeterinario] = useState(false); // Nuevo estado para mostrar el componente de agregar veterinario
  const [modalInfo, setModalInfo] = useState({ show: false, type: "" }); // Controlar el estado de los modales
  const [veterinarioModificado, setVeterinarioModificado] = useState({
    nombre: "",
    especialidad: "",
    telefono: "",
    email: ""
  });

  // Obtener veterinarios desde Firestore
  useEffect(() => {
    const obtenerVeterinarios = async () => {
      const veterinariosSnapshot = await getDocs(collection(db, "veterinarios"));
      const veterinariosData = veterinariosSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setVeterinarios(veterinariosData);
      setLoading(false);
    };

    obtenerVeterinarios();
  }, []);

  // Filtrar veterinarios por búsqueda
  const filtrarVeterinarios = useMemo(() => {
    return veterinarios.filter((vet) =>
      (vet.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
       vet.especialidad?.toLowerCase().includes(busqueda.toLowerCase()))
    );
  }, [busqueda, veterinarios]);

  // Función para manejar la selección de un veterinario
  const seleccionarVeterinario = (vet) => {
    setVeterinarioSeleccionado(vet); // Solo selecciona el veterinario
    setMostrarAgenda(false); // No mostrar la agenda al seleccionar la fila
  };

  // Abrir el modal para modificar veterinario
  const abrirModalModificar = () => {
    if (veterinarioSeleccionado) {
      setVeterinarioModificado({
        nombre: veterinarioSeleccionado.nombre,
        especialidad: veterinarioSeleccionado.especialidad,
        telefono: veterinarioSeleccionado.telefono,
        email: veterinarioSeleccionado.email
      });
      setModalInfo({ show: true, type: "modificar" });
    }
  };

  // Función para guardar los cambios
  const guardarCambios = async () => {
    if (veterinarioSeleccionado) {
      const { id } = veterinarioSeleccionado;
      const { nombre, especialidad, telefono, email } = veterinarioModificado;

      // Validar campos
      if (!nombre || !especialidad || !telefono || !email) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      // Guardar cambios en Firestore
      const veterinarioRef = doc(db, "veterinarios", id);
      await updateDoc(veterinarioRef, { nombre, especialidad, telefono, email });

      // Actualizar la lista de veterinarios en el estado
      setVeterinarios((prev) =>
        prev.map((vet) =>
          vet.id === id ? { ...vet, nombre, especialidad, telefono, email } : vet
        )
      );

      // Cerrar el modal
      setModalInfo({ show: false, type: "" });
    }
  };

  // Función para eliminar veterinario
  const eliminarVeterinario = async () => {
    if (veterinarioSeleccionado) {
      const confirmDelete = window.confirm("¿Estás seguro que deseas eliminar este veterinario?");
      if (confirmDelete) {
        await deleteDoc(doc(db, "veterinarios", veterinarioSeleccionado.id));
        setVeterinarios((prev) => prev.filter((vet) => vet.id !== veterinarioSeleccionado.id));
      }
    }
  };

  // Función para manejar la acción de ver la agenda
  const verAgenda = () => {
    if (veterinarioSeleccionado) {
      setMostrarAgenda(true); // Muestra la agenda si hay un veterinario seleccionado
    }
  };

  // Función para cerrar la agenda
  const cerrarAgenda = () => {
    setMostrarAgenda(false); // Esto cierra el modal de la agenda
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Veterinarios</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o especialidad"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full mb-6 p-3 border rounded"
      />

      {/* Botón para mostrar el componente AgregarVeterinario */}
      <button 
        onClick={() => setMostrarAgregarVeterinario(true)} // Cambiar estado para mostrar el componente
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        Agregar Veterinario
      </button>

      <button
        onClick={abrirModalModificar}
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 mb-4 ml-2"
        disabled={!veterinarioSeleccionado} // Deshabilitar si no hay un veterinario seleccionado
      >
        Modificar Veterinario
      </button>

      <button
        onClick={eliminarVeterinario}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mb-4 ml-2"
        disabled={!veterinarioSeleccionado} // Deshabilitar si no hay un veterinario seleccionado
      >
        Eliminar Veterinario
      </button>

      <button
        onClick={verAgenda} // Solo abre la agenda cuando se hace clic en este botón
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 ml-2"
        disabled={!veterinarioSeleccionado}
      >
        Ver Agenda
      </button>

      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Nombre</th>
            <th className="p-2">Especialidad</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {filtrarVeterinarios.map((vet) => (
            <tr
              key={vet.id}
              className={`border-t cursor-pointer ${veterinarioSeleccionado?.id === vet.id ? 'bg-blue-100' : ''}`}
              onClick={() => seleccionarVeterinario(vet)} // Solo selecciona el veterinario, sin abrir la agenda
            >
              <td className="p-2">{vet.nombre}</td>
              <td className="p-2">{vet.especialidad}</td>
              <td className="p-2">{vet.telefono}</td>
              <td className="p-2">{vet.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mostrar el componente AgregarVeterinario cuando se presiona el botón */}
      {mostrarAgregarVeterinario && (
        <AgregarVeterinario
          isOpen={mostrarAgregarVeterinario} // Pasa el estado para que el modal se controle
          onClose={() => setMostrarAgregarVeterinario(false)} // Función para cerrar el modal
        />
      )}

      {/* Mostrar el componente VerTurnos si un veterinario está seleccionado y se desea ver la agenda */}
      {mostrarAgenda && veterinarioSeleccionado && (
        <VerTurnos veterinario={veterinarioSeleccionado} onClose={cerrarAgenda} />
      )}

      {/* Modal de Modificar Veterinario */}
      {modalInfo.type === "modificar" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 max-w-sm w-full rounded shadow-lg">
            <h3 className="text-lg font-bold">Modificar Veterinario</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1">Nombre</label>
                <input
                  type="text"
                  value={veterinarioModificado.nombre}
                  onChange={(e) => setVeterinarioModificado({ ...veterinarioModificado, nombre: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Especialidad</label>
                <input
                  type="text"
                  value={veterinarioModificado.especialidad}
                  onChange={(e) => setVeterinarioModificado({ ...veterinarioModificado, especialidad: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Teléfono</label>
                <input
                  type="text"
                  value={veterinarioModificado.telefono}
                  onChange={(e) => setVeterinarioModificado({ ...veterinarioModificado, telefono: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={veterinarioModificado.email}
                  onChange={(e) => setVeterinarioModificado({ ...veterinarioModificado, email: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setModalInfo({ show: false, type: "" })} // Cerrar el modal sin guardar
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={guardarCambios} // Guardar cambios
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VeterinariosPage;
