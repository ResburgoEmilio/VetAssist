import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import Modal from "react-modal";

Modal.setAppElement("#root");

function Stock() {
  const [busquedaStock, setBusquedaStock] = useState("");
  const [insumos, setInsumos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalMasivoAbierto, setModalMasivoAbierto] = useState(false);
  const [esEdicion, setEsEdicion] = useState(false);
  const [insumoAEditarId, setInsumoAEditarId] = useState(null);
  const [filtroMasivo, setFiltroMasivo] = useState("");
  const [campoMasivo, setCampoMasivo] = useState("precioVenta");
  const [porcentajeMasivo, setPorcentajeMasivo] = useState(0);
  const [tipoFiltro, setTipoFiltro] = useState("laboratorio");
  const [nuevoInsumo, setNuevoInsumo] = useState({
    nombre: "",
    cantidad: "",
    precioVenta: "",
    precioCompra: "",
    laboratorio: "",
    proveedor: "",
  });

  const location = useLocation();

  useEffect(() => {
    cargarInsumos();
  }, []);

  const cargarInsumos = async () => {
    const snapshot = await getDocs(collection(db, "insumos"));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setInsumos(lista);
  };

  const abrirModal = (insumo = null) => {
    if (insumo) {
      setEsEdicion(true);
      setInsumoAEditarId(insumo.id);
      setNuevoInsumo({ ...insumo });
    } else {
      setEsEdicion(false);
      setNuevoInsumo({
        nombre: "",
        cantidad: "",
        precioVenta: "",
        precioCompra: "",
        laboratorio: "",
        proveedor: "",
      });
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);
  const abrirModalMasivo = () => setModalMasivoAbierto(true);
  const cerrarModalMasivo = () => setModalMasivoAbierto(false);

  const handleInputChange = (e) => {
    setNuevoInsumo({
      ...nuevoInsumo,
      [e.target.name]: e.target.value,
    });
  };

  const guardarInsumo = async () => {
    const datos = {
      ...nuevoInsumo,
      cantidad: Number(nuevoInsumo.cantidad),
      precioVenta: Number(nuevoInsumo.precioVenta),
      precioCompra: Number(nuevoInsumo.precioCompra),
    };

    if (esEdicion) {
      await updateDoc(doc(db, "insumos", insumoAEditarId), datos);
    } else {
      const docRef = await addDoc(collection(db, "insumos"), datos);
      datos.id = docRef.id;
    }

    await cargarInsumos();
    cerrarModal();
  };

  const eliminarInsumo = async (id) => {
    await deleteDoc(doc(db, "insumos", id));
    await cargarInsumos();
  };

  const aplicarModificacionMasiva = async () => {
    const q = query(collection(db, "insumos"), where(tipoFiltro, "==", filtroMasivo));
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const nuevoValor = data[campoMasivo] * (1 + porcentajeMasivo / 100);
      return updateDoc(doc(db, "insumos", docSnap.id), {
        [campoMasivo]: Math.round(nuevoValor),
      });
    });

    await Promise.all(updates);
    await cargarInsumos();
    cerrarModalMasivo();
  };

  const resultadosStock = insumos.filter((s) =>
    s.nombre.toLowerCase().includes(busquedaStock.toLowerCase())
  );

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Stock</h2>
        <div className="flex gap-2">
          <button
            onClick={() => abrirModal()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Agregar Insumo
          </button>
          <button
            onClick={abrirModalMasivo}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Modificación Masiva
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar insumo por nombre"
        value={busquedaStock}
        onChange={(e) => setBusquedaStock(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
      />

      <table className="w-full bg-white shadow-md rounded mt-6">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Nombre</th>
            <th className="p-2">Cantidad</th>
            <th className="p-2">Precio Venta</th>
            <th className="p-2">Precio Compra</th>
            <th className="p-2">Laboratorio</th>
            <th className="p-2">Proveedor</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resultadosStock.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.nombre}</td>
              <td className="p-2">{item.cantidad}</td>
              <td className="p-2">${item.precioVenta}</td>
              <td className="p-2">${item.precioCompra}</td>
              <td className="p-2">{item.laboratorio}</td>
              <td className="p-2">{item.proveedor}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => abrirModal(item)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    const confirmacion = window.confirm(`¿Estás seguro que deseas eliminar "${item.nombre}"?`);
                    if (confirmacion) eliminarInsumo(item.id);
                  }}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Agregar / Modificar */}
      <Modal
        isOpen={modalAbierto}
        onRequestClose={cerrarModal}
        className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40"
      >
        <h2 className="text-xl font-bold mb-4">{esEdicion ? "Editar" : "Nuevo"} Insumo</h2>
        {["nombre", "cantidad", "precioVenta", "precioCompra", "laboratorio", "proveedor"].map(
          (campo) => (
            <input
              key={campo}
              name={campo}
              value={nuevoInsumo[campo]}
              onChange={handleInputChange}
              type={["cantidad", "precioVenta", "precioCompra"].includes(campo) ? "number" : "text"}
              placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
              className="w-full p-2 border rounded mb-3"
            />
          )
        )}
        <div className="flex justify-end gap-2">
          <button onClick={cerrarModal} className="px-4 py-2 bg-gray-400 rounded text-white">
            Cancelar
          </button>
          <button
            onClick={guardarInsumo}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
          >
            Guardar
          </button>
        </div>
      </Modal>

      {/* Modal de Modificación Masiva */}
      <Modal
        isOpen={modalMasivoAbierto}
        onRequestClose={cerrarModalMasivo}
        className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40"
      >
        <h2 className="text-xl font-bold mb-4">Modificación Masiva</h2>
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="laboratorio">Filtrar por Laboratorio</option>
          <option value="proveedor">Filtrar por Proveedor</option>
        </select>
        <input
          type="text"
          placeholder={`Nombre del ${tipoFiltro}`}
          value={filtroMasivo}
          onChange={(e) => setFiltroMasivo(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <select
          value={campoMasivo}
          onChange={(e) => setCampoMasivo(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="precioVenta">Precio de Venta</option>
          <option value="precioCompra">Precio de Compra</option>
        </select>
        <input
          type="number"
          placeholder="Porcentaje de aumento o descuento (ej: 20 o -10)"
          value={porcentajeMasivo}
          onChange={(e) => setPorcentajeMasivo(Number(e.target.value))}
          className="w-full p-2 border rounded mb-3"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={cerrarModalMasivo}
            className="px-4 py-2 bg-gray-400 rounded text-white"
          >
            Cancelar
          </button>
          <button
            onClick={aplicarModificacionMasiva}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white"
          >
            Aplicar Cambios
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Stock;
