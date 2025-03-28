import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const {
      nombre,
      cedula,
      contacto,
      direccion,
      codigo_luminaria,
      estado_luminaria,
      coordenadas,
      fotoBase64,
      fotoNombre
    } = req.body;

    console.log("Datos recibidos:", req.body); // 👀 Verifica en logs de Vercel

    // Validación básica
    if (!nombre || !cedula || !contacto || !direccion || !codigo_luminaria || !estado_luminaria || !coordenadas) {
      return res.status(400).json({ error: "Campos obligatorios faltantes" });
    }

    const numeroReporte = Math.floor(1000 + Math.random() * 9000);

    const msg = {
      to: "andaravi4@gmail.com",
      from: "andaravi4@hotmail.com", // debe estar verificado
      subject: `Reporte de Luminaria #${numeroReporte}`,
      html: `
        <h3>Nuevo Reporte de Alumbrado Público</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Cédula:</strong> ${cedula}</p>
        <p><strong>Contacto:</strong> ${contacto}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>
        <p><strong>Código:</strong> ${codigo_luminaria}</p>
        <p><strong>Estado:</strong> ${estado_luminaria}</p>
        <p><strong>Coordenadas:</strong> ${coordenadas}</p>
        <p><strong>Número de reporte:</strong> ${numeroReporte}</p>
      `
    };

    if (fotoBase64 && fotoNombre) {
      msg.attachments = [{
        content: fotoBase64,
        type: "image/jpeg",
        filename: fotoNombre,
        disposition: "attachment"
      }];
    }

    await sendgrid.send(msg);
    console.log("Correo enviado"); // 👀 Debería aparecer en logs
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Error al enviar el correo:", error.response?.body || error.message);
    return res.status(500).json({ error: "Error al enviar el correo" });
  }
}
