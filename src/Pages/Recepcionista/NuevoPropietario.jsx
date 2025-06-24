// src/pages/recepcionista/NuevoPropietario.jsx
import { useState } from "react";
import { db } from "../../firebase";  // Firebase configurado para obtener datos
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";  // Funciones para agregar y buscar en Firestore

function NuevoPropietario() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [dni, setDni] = useState("");
  const [errorDni, setErrorDni] = useState("");  // Estado para el error del DNI

  // Función para verificar si el DNI ya existe
  const verificarDniUnico = async () => {
    const q = query(collection(db, "propietarios"), where("dni", "==", dni));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;  // Si está vacío, el DNI es único
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorDni("");  // Limpiar el error antes de verificar

    // Verificamos si el DNI ya existe
    const isDniUnique = await verificarDniUnico();
    if (!isDniUnique) {
      setErrorDni("El DNI ingresado ya existe.");
      return;
    }

    // Guardar propietario en Firestore si el DNI es único
    try {
      await addDoc(collection(db, "propietarios"), {
        nombre,
        email,
        telefono,
        direccion,
        dni,
      });

      // Limpiar los campos después de guardar
      setNombre("");
      setEmail("");
      setTelefono("");
      setDireccion("");
      setDni("");

      alert("Propietario agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar propietario:", error);
      alert("Hubo un error al agregar el propietario");
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Nuevo Propietario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          className="w-full p-3 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          required
        />
        {errorDni && <p className="text-red-500">{errorDni}</p>}  {/* Mostrar error si el DNI ya existe */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar Propietario
        </button>
      </form>
    </div>
  );
}

export default NuevoPropietario;
