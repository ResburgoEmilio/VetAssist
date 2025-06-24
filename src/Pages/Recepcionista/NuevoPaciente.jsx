// src/pages/recepcionista/NuevoPaciente.jsx
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

function NuevoPaciente() {
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [tipo, setTipo] = useState("");  // Estado para el tipo (perro, gato, otro)
  const [propietarioId, setPropietarioId] = useState("");  // Estado para el propietario seleccionado
  const [color, setColor] = useState("");  // Nuevo campo para el color de la mascota
  const [propietarios, setPropietarios] = useState([]);  // Estado para los propietarios
  const [filtroPropietarios, setFiltroPropietarios] = useState("");  // Filtro de búsqueda
  const [resultadosPropietarios, setResultadosPropietarios] = useState([]);
  const [errorPropietario, setErrorPropietario] = useState("");  // Estado para el error de propietario

  // Obtener propietarios desde Firestore
  useEffect(() => {
    const obtenerPropietarios = async () => {
      const propietariosSnapshot = await getDocs(collection(db, "propietarios"));
      const propietariosData = propietariosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPropietarios(propietariosData);
    };

    obtenerPropietarios();
  }, []);

  // Filtrar propietarios según la búsqueda (por nombre o DNI)
  useEffect(() => {
    if (filtroPropietarios) {
      const resultados = propietarios.filter((propietario) =>
        propietario.nombre.toLowerCase().includes(filtroPropietarios.toLowerCase()) ||
        propietario.dni.includes(filtroPropietarios)
      );
      setResultadosPropietarios(resultados);
    } else {
      setResultadosPropietarios([]);
    }
  }, [filtroPropietarios, propietarios]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si se seleccionó un propietario
    if (!propietarioId) {
      setErrorPropietario("Debe seleccionar un propietario.");
      return;
    }

    try {
      await addDoc(collection(db, "pacientes"), {
        nombre,
        raza,
        edad,
        tipo,  // Guardamos el tipo de mascota
        propietarioId,  // Vinculamos la mascota con el propietario
        color,  // Guardamos el color de la mascota
      });

      // Limpiar los campos después de guardar
      setNombre("");
      setRaza("");
      setEdad("");
      setTipo("");
      setColor("");  // Limpiamos el campo color
      setPropietarioId("");
      setErrorPropietario("");  // Limpiamos el error

      alert("Paciente agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar paciente:", error);
      alert("Hubo un error al agregar el paciente");
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Nuevo Paciente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nombre */}
        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Nombre de la mascota"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        
        {/* Campo Tipo (picklist) */}
        <select
          className="w-full p-3 border rounded"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
        >
          <option value="">Seleccionar tipo</option>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
        </select>

        {/* Campo Raza */}
        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Raza"
          value={raza}
          onChange={(e) => setRaza(e.target.value)}
        />
        
        {/* Campo Color */}
        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Color de la mascota"
          value={color}
          onChange={(e) => setColor(e.target.value)}  // Actualiza el valor del color
        />
        
        {/* Campo Edad */}
        <input
          type="number"
          className="w-full p-3 border rounded"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />

        {/* Campo Propietario (búsqueda en Firebase) */}
        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Buscar propietario por nombre o DNI"
          value={filtroPropietarios}
          onChange={(e) => setFiltroPropietarios(e.target.value)}  // Actualiza el filtro
        />
        {resultadosPropietarios.length > 0 && (
          <ul className="bg-white border border-gray-300 mt-2 max-h-40 overflow-y-auto">
            {resultadosPropietarios.map((prop) => (
              <li
                key={prop.id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => setPropietarioId(prop.id)}  // Establece el propietario seleccionado
              >
                {prop.nombre} - DNI: {prop.dni}
              </li>
            ))}
          </ul>
        )}

        {errorPropietario && <p className="text-red-500">{errorPropietario}</p>}  {/* Mostrar error si no se seleccionó propietario */}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar Paciente
        </button>
      </form>
    </div>
  );
}

export default NuevoPaciente;