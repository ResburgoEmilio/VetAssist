import { useState } from "react";
import { auth, googleProvider } from "./Assets/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [registro, setRegistro] = useState(false);
  const [recuperar, setRecuperar] = useState(false);
  const [recuperacionEnviada, setRecuperacionEnviada] = useState(false);

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Inicio de sesión con Google exitoso");
    } catch (error) {
      console.error(error);
      setErrorMsg("Error al iniciar sesión con Google");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Inicio de sesión exitoso");
    } catch (error) {
      console.error(error);
      setErrorMsg("Email o contraseña incorrectos");
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Cuenta creada exitosamente");
      setRegistro(false);
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMsg("Ese mail ya está registrado");
          break;
        case "auth/invalid-email":
          setErrorMsg("El mail no es válido");
          break;
        case "auth/weak-password":
          setErrorMsg("La contraseña debe tener al menos 6 caracteres");
          break;
        default:
          setErrorMsg("Error al crear la cuenta");
          break;
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await sendPasswordResetEmail(auth, email);
      setRecuperacionEnviada(true);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error al enviar el mail de recuperación");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-3">
      {/* Imagen izquierda */}
      <div
        className="hidden md:block bg-cover bg-center"
        style={{ backgroundImage: "url('/vet-bg.jpg')" }}
      ></div>

      {/* Centro - Login */}
      <div className="flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Logo centrado */}
          <div className="flex justify-center">
          <img src="/vet-logo.png" alt="VetAssistant logo" className="h-52 mb-2" />
          </div>

          {!registro && !recuperar && (
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Iniciar sesión con Google
            </button>
          )}

          {!recuperar && (
            <div className="text-center text-sm text-gray-500">o</div>
          )}

          <form
            onSubmit={
              registro
                ? handleEmailRegister
                : recuperar
                ? handlePasswordReset
                : handleEmailLogin
            }
            className="space-y-4"
          >
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {!recuperar && (
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              {registro
                ? "Crear cuenta"
                : recuperar
                ? "Enviar código de recuperación"
                : "Iniciar sesión"}
            </button>
          </form>

          {!registro && !recuperar && (
            <div className="text-center">
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setRecuperar(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          {recuperacionEnviada && (
            <p className="text-green-600 text-sm text-center">
              Se envió un código de recuperación a tu correo.
            </p>
          )}

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          <div className="text-center text-sm mt-4">
            {registro ? (
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setRegistro(false)}
              >
                ¿Ya tenés cuenta? Iniciar sesión
              </button>
            ) : (
              !recuperar && (
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setRegistro(true)}
                >
                  Registrarse
                </button>
              )
            )}
            {recuperar && (
              <button
                className="ml-3 text-blue-600 hover:underline"
                onClick={() => {
                  setRecuperar(false);
                  setRecuperacionEnviada(false);
                }}
              >
                Volver
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Imagen derecha */}
      <div
        className="hidden md:block bg-cover bg-center"
        style={{ backgroundImage: "url('/vet-bg2.jpg')" }}
      ></div>
    </div>
  );
}

export default Login;
