document.addEventListener("DOMContentLoaded", function () {
  const emailField  = document.getElementById("generated-email");
  const generateBtn = document.getElementById("generate-email-btn");
  const emailHistory = document.getElementById("email-history");
  const downloadBtn = document.getElementById("download-history-btn");

  let history = []; // Array para almacenar los emails generados

  /**
   * Función para copiar un email al portapapeles
   */
  function copyToClipboard(email) {
      navigator.clipboard.writeText(email).then(() => {
          alert("Correo copiado: " + email);
      }).catch(err => {
          console.error("Error al copiar: ", err);
      });
  }

  /**
   * Actualiza la lista de historial con los emails generados
   */
  function updateHistory(email) {
      if (history.length >= 10) {
          history.shift(); // Elimina el más antiguo si hay más de 10
      }
      history.push(email);

      emailHistory.innerHTML = ""; // Limpia la lista
      history.slice().reverse().forEach(email => {
          const listItem = document.createElement("li");
          listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

          listItem.innerHTML = `
          <span>${email}</span>
          <button class="btn btn-sm btn-outline-secondary copy-btn">
              <i class="fa-solid fa-copy"></i> Copiar
          </button>
      `;

          listItem.querySelector(".copy-btn").addEventListener("click", () => copyToClipboard(email));

          emailHistory.appendChild(listItem);
      });
  }

  /**
   * Envia las palabras clave al backend y recibe un email generado
   */
  function generateEmail() {
      const namesInput = document.getElementById("names").value;
      const domainsInput = document.getElementById("domains").value;
      const extensionsInput = document.getElementById("extensions").value;

      fetch("/generate_custom_email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              names: namesInput,
              domains: domainsInput,
              extensions: extensionsInput
          })
      })
      .then(response => response.json())
      .then(data => {
          emailField.value = data.email;
          updateHistory(data.email);
      })
      .catch(error => console.error("Error al generar email:", error));
  }

  /**
   * Función para descargar el historial como un archivo .txt
   */
  function downloadHistory() {
      const text = history.join("\n");
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "historial_emails.txt";
      link.click();
  }

  generateBtn.addEventListener("click", generateEmail);
  downloadBtn.addEventListener("click", downloadHistory);
});
