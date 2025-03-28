// 📷 Preview de imagen
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').innerHTML = `
                <img src="${e.target.result}" alt="Foto de la luminaria" class="img-fluid" style="max-height: 100px;">
                <button type="button" class="btn btn-danger btn-sm mt-2" onclick="resetImage()">Eliminar</button>
            `;
        };
        reader.readAsDataURL(file);
    }
});

function resetImage() {
    document.getElementById('imagePreview').innerHTML = '<p>Seleccione una imagen</p>';
    document.getElementById('fileInput').value = '';
}

// 🗺 Abrir Google Maps
function abrirGoogleMaps() {
    window.location.href = "https://www.google.com/maps";
}

// ✅ Enviar formulario por fetch a la API de Vercel
document.getElementById("luminariaForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const jsonData = {};

    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    const file = form.foto.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            jsonData.fotoBase64 = e.target.result.split(',')[1]; // base64 sin metadata
            jsonData.fotoNombre = file.name;
            await enviarFormulario(jsonData, form);
        };
        reader.readAsDataURL(file);
    } else {
        await enviarFormulario(jsonData, form);
    }
});

async function enviarFormulario(data, form) {
    try {
        const response = await fetch("api/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert("¡Reporte enviado correctamente!");
            form.reset();
            resetImage();
        } else {
            const result = await response.json();
            alert("Error al enviar el correo: " + result.error);
        }
    } catch (error) {
        console.error("Error al enviar:", error);
        alert("Ocurrió un error al enviar el reporte.");
    }
}