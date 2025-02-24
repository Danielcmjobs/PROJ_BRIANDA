document.addEventListener("DOMContentLoaded", function () {
    const emailField = document.getElementById("generated-email");
    const generateBtn = document.getElementById("generate-email-btn");
    const copyBtn = document.getElementById("copy-email-btn");
    const historyList = document.getElementById("email-history");
    const downloadBtn = document.getElementById("download-history-btn");
    const domainSelect = document.getElementById("domain-selection");
    const emailNameInput = document.getElementById("email-name");
    const nameError = document.getElementById("name-error");

    let emailHistory = [];
    const maxHistory = 10; // Límite de historial

    function generarCadenaAleatoria(longitud) {
        const caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
        let resultado = "";
        for (let i = 0; i < longitud; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return resultado;
    }

    function validarNombre(nombre) {
        const regex = /^[a-zA-Z0-9]+$/; // Solo letras y números
        return regex.test(nombre);
    }

    function generarEmail() {
        let nombre = emailNameInput.value.trim(); // Obtiene el nombre del input

        if (nombre !== "" && !validarNombre(nombre)) {
            nameError.classList.remove("d-none"); // Muestra el mensaje de error
            return;
        } else {
            nameError.classList.add("d-none"); // Oculta el mensaje si es válido
        }

        if (nombre === "") {
            // Si el campo está vacío, genera un nombre aleatorio
            const nombres = [
                "juan", "maria", "pedro", "laura", "carlos", "sofia", "diego", "ana",
                "ricardo", "valentina", "daniel", "fernanda", "alex", "camila", "luis", "elena"
            ];
            nombre = nombres[Math.floor(Math.random() * nombres.length)];
        }

        let sufijo = generarCadenaAleatoria(4);
        let dominio = domainSelect.value;
        let email = `${nombre}.${sufijo}@${dominio}`;

        emailField.value = email;
        updateHistory(email);
    }

    function updateHistory(email) {
        // Agregar al inicio del array
        emailHistory.unshift(email);

        // Mantener solo los últimos 10
        if (emailHistory.length > maxHistory) {
            emailHistory.pop();
        }

        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = ""; // Limpiar historial

        emailHistory.forEach(email => {
            let listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.textContent = email;

            let copyIcon = document.createElement("button");
            copyIcon.className = "btn btn-sm btn-outline-secondary";
            copyIcon.innerHTML = '<i class="fa-regular fa-copy"></i>';
            copyIcon.addEventListener("click", function () {
                navigator.clipboard.writeText(email);
                alert("Email copiado: " + email);
            });

            listItem.appendChild(copyIcon);
            historyList.appendChild(listItem);
        });
    }

    function copyEmail() {
        navigator.clipboard.writeText(emailField.value);
        alert("Email copiado: " + emailField.value);
    }

    function downloadHistory() {
        if (emailHistory.length === 0) {
            alert("No hay emails en el historial.");
            return;
        }

        let contenido = emailHistory.join("\n");
        let blob = new Blob([contenido], { type: "text/plain" });
        let enlace = document.createElement("a");

        enlace.href = URL.createObjectURL(blob);
        enlace.download = "historial_emails.txt";
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
    }

    generarEmail();

    generateBtn.addEventListener("click", generarEmail);
    copyBtn.addEventListener("click", copyEmail);
    downloadBtn.addEventListener("click", downloadHistory);
});
