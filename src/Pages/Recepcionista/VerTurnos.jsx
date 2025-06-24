import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Asegúrate de importar la configuración de Firebase correctamente

Modal.setAppElement("#root");

const VerTurnos = ({ veterinario, onClose, actualizarTurnos }) => {
  const [semanaActual, setSemanaActual] = useState(0);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(""); // Estado para el bloque seleccionado
  const [diaSeleccionado, setDiaSeleccionado] = useState(""); // Estado para el día seleccionado
  const [horarios, setHorarios] = useState(veterinario.horarios || {}); // Para gestionar los horarios localmente
  const [cambiosPendientes, setCambiosPendientes] = useState(false); // Para detectar cambios no guardados

  // Cargar los horarios del veterinario al abrir el modal
  useEffect(() => {
    if (veterinario.id) {
      const cargarHorarios = async () => {
        const docRef = doc(db, 'veterinarios', veterinario.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHorarios(docSnap.data().horarios || {});
        }
      };
      cargarHorarios();
    }
  }, [veterinario.id]); // Esto asegura que cargue cuando el veterinario cambie

  const obtenerSemana = (semanaOffset) => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + semanaOffset * 7);
    const lunes = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 1));

    return Array.from({ length: 7 }, (_, i) => {
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      return dia;
    });
  };

  const semanaDias = obtenerSemana(semanaActual);
  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const bloquesHorarios = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00",
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const cambiarSemana = (delta) => {
    setSemanaActual(prev => prev + delta);
  };

  // Función para manejar la ocupación de los bloques (Disponible u Ocupado)
  const manejarEstadoBloque = async (dia, hora) => {
    const turnosActualizados = { ...horarios };

    // Asegurarse de que la semana actual esté representada
    const semanaActualizada = `Semana ${semanaActual}`;
    if (!turnosActualizados[semanaActualizada]) {
      turnosActualizados[semanaActualizada] = {};
    }

    // Asegurarse de que el día esté representado
    if (!turnosActualizados[semanaActualizada][dia]) {
      turnosActualizados[semanaActualizada][dia] = {};
    }

    // Obtener el estado actual del bloque
    const estadoActual = turnosActualizados[semanaActualizada][dia][hora];

    // Alternar entre Disponible y Ocupado, solo en la semana actual
    if (estadoActual === "disponible") {
      turnosActualizados[semanaActualizada][dia][hora] = "ocupado";
    } else if (estadoActual === "ocupado") {
      turnosActualizados[semanaActualizada][dia][hora] = "disponible";
    }

    // Marcar cambios pendientes
    setCambiosPendientes(true);

    // Actualizar el estado local
    setHorarios(turnosActualizados);
  };

  // Función para manejar la apertura o cierre de un bloque (Disponible o Cerrado)
  const manejarAbrirCerrar = async (estado) => {
    if (!diaSeleccionado || !bloqueSeleccionado) {
      alert("Por favor, selecciona un día y un bloque de horario.");
      return;
    }
  
    const turnosActualizados = { ...horarios };
    const cantidadSemanas = 50; // Aplica la apertura/cierre en la semana actual + 4 futuras
  
    for (let i = semanaActual; i < semanaActual + cantidadSemanas; i++) {
      const semanaKey = `Semana ${i}`;
  
      // Crear la semana si no existe
      if (!turnosActualizados[semanaKey]) {
        turnosActualizados[semanaKey] = {};
      }
  
      // Crear el día si no existe
      if (!turnosActualizados[semanaKey][diaSeleccionado]) {
        turnosActualizados[semanaKey][diaSeleccionado] = {};
      }
  
      // Asignar el estado deseado
      if (estado === "abrir") {
        turnosActualizados[semanaKey][diaSeleccionado][bloqueSeleccionado] = "disponible";
      } else if (estado === "cerrar") {
        turnosActualizados[semanaKey][diaSeleccionado][bloqueSeleccionado] = "cerrado";
      }
    }
  
    setCambiosPendientes(true);
    setHorarios(turnosActualizados);
  };
  

  // Función para manejar el cierre del modal y confirmar cambios
  const manejarCerrarModal = () => {
    if (cambiosPendientes) {
      // Preguntar si desea guardar los cambios
      const confirmar = window.confirm("¿Desea guardar los cambios realizados?");
      if (confirmar) {
        // Si confirma, guardar los cambios en Firebase
        try {
          setDoc(doc(db, 'veterinarios', veterinario.id), {
            ...veterinario,
            horarios: horarios
          });
          // Limpiar cambios pendientes
          setCambiosPendientes(false);
        } catch (error) {
          console.error("Error al guardar los cambios:", error);
        }
      }
    }
    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={manejarCerrarModal}
      contentLabel="Agenda Turnos Veterinario"
      className="bg-white p-6 max-w-5xl mx-auto mt-20 rounded shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Turnero - {veterinario.nombre}
        </h2>
        <div className="space-x-2">
          <button onClick={() => cambiarSemana(-1)} className="px-3 py-1 bg-gray-300 rounded">← Semana</button>
          <button onClick={() => cambiarSemana(1)} className="px-3 py-1 bg-gray-300 rounded">Semana →</button>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
        <table className="w-full text-center border">
          <thead>
            <tr className="bg-gray-100 sticky top-0">
              <th className="border px-2 py-1">Horario</th>
              {diasSemana.map((dia, i) => (
                <th key={dia} className="border px-2 py-1">
                  {dia} <br />
                  {semanaDias[i].getDate()}/{semanaDias[i].getMonth() + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bloquesHorarios.map((hora) => (
              <tr key={hora}>
                <td className="border px-2 py-1 font-semibold">{hora}</td>
                {diasSemana.map((dia) => {
                  const estadoBloque = horarios?.[`Semana ${semanaActual}`]?.[dia]?.[hora];
                  let clase = "border px-2 py-1 cursor-pointer transition";

                  // Determinar el color según el estado
                  if (estadoBloque === "disponible") {
                    clase += " bg-green-300 hover:bg-green-400";
                  } else if (estadoBloque === "ocupado") {
                    clase += " bg-red-300 hover:bg-red-400";
                  } else if (estadoBloque === "cerrado") {
                    clase += " bg-gray-300 text-gray-400";
                  } else {
                    clase += " bg-gray-100 text-gray-400";
                  }

                  return (
                    <td
                      key={dia + hora}
                      className={clase}
                      onClick={() => manejarEstadoBloque(dia, hora)} // Cambiar estado al hacer clic
                    >
                      {estadoBloque ? estadoBloque.charAt(0).toUpperCase() + estadoBloque.slice(1) : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-x-2">
        {/* Desplegable para seleccionar el día */}
        <select
          value={diaSeleccionado}
          onChange={(e) => setDiaSeleccionado(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">Selecciona el día</option>
          {diasSemana.map((dia, i) => (
            <option key={i} value={dia}>{dia}</option>
          ))}
        </select>

        {/* Desplegable para seleccionar el bloque horario */}
        <select
          value={bloqueSeleccionado}
          onChange={(e) => setBloqueSeleccionado(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">Selecciona el bloque</option>
          {bloquesHorarios.map((hora, i) => (
            <option key={i} value={hora}>{hora}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-x-2">
        {/* Botones para abrir/cerrar bloques */}
        <button
          onClick={() => manejarAbrirCerrar("abrir")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Abrir Bloque
        </button>
        <button
          onClick={() => manejarAbrirCerrar("cerrar")}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Cerrar Bloque
        </button>
      </div>

      <div className="text-right mt-6">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={manejarCerrarModal}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default VerTurnos;
