import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { to: "/", text: "Inicio" },
    { to: "/pacientes", text: "Pacientes y Propietarios" },
    { to: "/cola", text: "Cola de Atención" },
    { to: "/agenda", text: "Agenda y Turnos" },
    { to: "/facturacion", text: "Facturación" },
    { to: "/stock", text: "Stock" },
  ];

  return (
    <div className="w-64 min-h-screen bg-blue-800 text-white flex flex-col">
      <div className="p-6 border-b border-blue-600 flex justify-center items-center">
        <img
          src="/vet-logo.png"
          alt="VetAssistant Logo"
          className="h-32"
        />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded hover:bg-blue-700 ${
                isActive ? "bg-blue-700 font-bold" : ""
              }`
            }
          >
            {link.text}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
