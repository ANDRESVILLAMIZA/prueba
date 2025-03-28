import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

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

  if (!nombre || !cedula || !contacto || !direccion || !codigo_luminaria || !estado_luminaria || !coordenadas) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // Generar número de reporte (aleatorio simple)
  const numeroReporte = Math.floor(1000 + Math.random() * 9000);

  try {
    const email = {
      to: "andaravi4@gmail.com", // Cambia a tu correo real
      from: "andaravi4@hotmail.com",   // Debe estar verificado en SendGrid
      subject: `Reporte de Luminaria #${numeroReporte}`,
      templateId: "d-62ce1b996a0c4227be037c689d93cd62", // Tu ID de plantilla
      dynamic_template_data: {
        nombre,
        cedula,
        contacto,
        direccion,
        codigo_luminaria,
        estado_luminaria,
        coordenadas,
        numero_reporte: numeroReporte
      }
    };

    if (fotoBase64 && fotoNombre) {
      email.attachments = [{
        content: fotoBase64,
        type: "image/jpeg",
        filename: fotoNombre,
        disposition: "attachment"
      }];
    }

    await sendgrid.send(email);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error al enviar:", error.response?.body || error.message);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
}
