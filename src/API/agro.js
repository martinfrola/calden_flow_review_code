import axios from "axios";

export const getNotaDeVenta = async (patente) => {
  try {
    const url = `https://api-cn.cngrupo.com.ar/api/getNV?Patente=${patente}`;
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    // Manejar el error, incluido el error de tiempo de espera
    if (error.code === "ECONNABORTED") {
      alert("La petición ha excedido el tiempo de espera.");
    } else {
      alert("Error:", error.message);
    }
    return null; // Opcional: Si quieres devolver algo específico en caso de error
  }
};
