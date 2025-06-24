// src/pages/recepcionista/AgregarVeterinario.jsx
import React, { useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AgregarVeterinario = ({ isOpen, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const veterinario = {
      nombre,
      especialidad,
      telefono,
      email,
      turnos: {}, // Inicializamos con un objeto vacío para turnos
    };

    try {
      const docRef = await addDoc(collection(db, "veterinarios"), veterinario);
      console.log("Veterinario agregado con ID: ", docRef.id);
      onClose(); // Cierra el modal después de agregar el veterinario
    } catch (e) {
      console.error("Error agregando veterinario: ", e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Agregar Veterinario"
      className="bg-white p-6 max-w-md mx-auto mt-20 rounded shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40"
    >
      <h2 className="text-xl font-bold mb-4">Agregar Veterinario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Especialidad</label>
          <input
            type="text"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Agregar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AgregarVeterinario;
