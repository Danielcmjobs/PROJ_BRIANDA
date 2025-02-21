document.addEventListener("DOMContentLoaded", function () {
  const emailField  = document.getElementById("generated-email");
  const generateBtn = document.getElementById("generate-email-btn");
  
  // Nuevos inputs para personalización
  const namesInput = document.getElementById("custom-names");
  const domainsInput = document.getElementById("custom-domains");
  const extensionsInput = document.getElementById("custom-extensions");

  /**
   * Genera un email basado en las palabras clave ingresadas por el usuario.
   */
  function generarEmailPersonalizado() {
      const names = namesInput.value.trim();
      const domains = domainsInput.value.trim();
      const extensions = extensionsInput.value.trim();

      fetch("/generate_custom_email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ names, domains, extensions })
      })
      .then(response => response.json())
      .then(data => {
          emailField.value = data.email; // Muestra el email generado
      })
      .catch(error => {
          console.error("Error al generar el email:", error);
      });
  }

  // Evento para generar un nuevo email personalizado
  generateBtn.addEventListener("click", generarEmailPersonalizado);
});

  
  