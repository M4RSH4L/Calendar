document.addEventListener("DOMContentLoaded", function () {
  // Eventos del calendario
  const events = [
    {
      title: "Día del Niño",
      start: "2025-08-20",
      color: "#FF6384",
      icon: "🎉",
      description: "Celebramos a los más pequeños con promociones especiales."
    },
    {
      title: "Hot Sale",
      start: "2025-11-15",
      color: "#36A2EB",
      icon: "🔥",
      description: "Grandes descuentos online por tiempo limitado."
    },
    {
      title: "Black Friday",
      start: "2025-11-29",
      color: "#000000",
      icon: "🛍️",
      description: "El día de las mejores ofertas del año."
    }
  ];

  // Inicializar FullCalendar
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "es",
    events: events.map(evt => ({
      title: `${evt.icon} ${evt.title}`,
      start: evt.start,
      color: evt.color,
      extendedProps: {
        description: evt.description
      }
    })),
    eventClick: function (info) {
      Swal.fire({
        title: info.event.title,
        text: info.event.extendedProps.description,
        icon: "info"
      });
    }
  });
  calendar.render();

  // Mostrar tip del día
  const tipEl = document.getElementById("daily-tip");
  tipEl.textContent = "💡 Tip del día: Aprovechá las promociones especiales para tu negocio.";

  // --- Registro segmentado con SweetAlert2 y Google Sheets ---

  function showRegistrationForm() {
    Swal.fire({
      title: "Selecciona tu tipo de negocio",
      input: "select",
      inputOptions: {
        ecommerce: "E-commerce / Tienda Online",
        servicios: "Servicios Profesionales",
        retail: "Retail / Comercio tradicional",
        educacion: "Educación / Cursos",
        otros: "Otros"
      },
      inputPlaceholder: "Selecciona una opción",
      showCancelButton: false,
      confirmButtonText: "Siguiente",
      inputValidator: (value) => {
        if (!value) {
          return "Por favor, selecciona una opción";
        }
      }
    }).then((segmentResult) => {
      if (segmentResult.isConfirmed) {
        const segmentType = segmentResult.value;

        Swal.fire({
          title: "Ingresa tu email o teléfono para recibir alertas",
          input: "text",
          inputPlaceholder: "Email o teléfono",
          showCancelButton: false,
          confirmButtonText: "Registrarme",
          inputValidator: (value) => {
            if (!value) {
              return "Necesitamos tu contacto para enviarte las alertas";
            }
          }
        }).then((contactResult) => {
          if (contactResult.isConfirmed) {
            // Guardar en localStorage
            localStorage.setItem("userContact", contactResult.value);
            localStorage.setItem("segmentType", segmentType);

            // Enviar a Google Sheets
            fetch("https://script.google.com/macros/s/AKfycbzKZ3uuISwVorKV19uGhlqnc8I_7ARccGDcbee1de-vqX75V4HhIyDIEqMRYQFtdiDd/exec", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                contacto: contactResult.value,
                segmento: segmentType
              }),
                mode: "no-cors" 
            })
              .then(res => {
                if (res.ok) {
                  console.log("Datos enviados a Google Sheets correctamente");
                } else {
                  console.error("Error al enviar datos a Google Sheets");
                }
              })
              .catch(err => {
                console.error("Error en la petición a Google Sheets:", err);
              });

            Swal.fire("¡Gracias!", "Te mantendremos informado con contenido personalizado.", "success");
          }
        });
      }
    });
  }

  // Mostrar el formulario solo si no está registrado
  if (!localStorage.getItem("userContact")) {
    showRegistrationForm();
  }
});

