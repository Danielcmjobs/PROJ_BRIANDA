document.addEventListener("DOMContentLoaded", function () {
    const emailField = document.getElementById("generated-email");
    const generateBtn = document.getElementById("generate-email-btn");
    const copyBtn = document.getElementById("copy-email-btn");
    const historyList = document.getElementById("email-history");
    const downloadBtn = document.getElementById("download-history-btn");
    const prevPageBtn = document.getElementById("prev-page-btn");
    const nextPageBtn = document.getElementById("next-page-btn");
    const domainSelect = document.getElementById("domain-selection");
    const nameInput = document.getElementById("email-name");
    const errorMessage = document.getElementById("error-message");

    let emailHistory = [];
    let currentPage = 1;
    const emailsPerPage = 5;

    function generarCadenaAleatoria(longitud) {
        const caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
        let resultado = "";
        for (let i = 0; i < longitud; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return resultado;
    }

    // Función para validar el nombre (solo letras y números)
    function validarNombre(nombre) {
        const regex = /^[a-zA-Z0-9]+$/; // Solo letras y números
        return regex.test(nombre);
    }

    // Función para generar el email
    function generarEmail() {
        const nombres = [
            "juan", "maria", "pedro", "laura", "carlos", "sofia", "diego", "ana",
            "ricardo", "valentina", "daniel", "fernanda", "alex", "camila", "luis", "elena"
        ];

        let nombre = nameInput.value.trim();

        // Validar el nombre usando la función validarNombre
        if (nombre && !validarNombre(nombre)) {
            errorMessage.textContent = "El nombre solo puede contener letras y números.";
            errorMessage.style.color = "red";
            return; // No generar el email si el nombre no es válido
        }

        // Limpiar el mensaje de error si el nombre es válido
        errorMessage.textContent = "";

        if (!nombre) {
            nombre = nombres[Math.floor(Math.random() * nombres.length)]; // Usa uno aleatorio si está vacío
        }

        let sufijo = generarCadenaAleatoria(4);
        let dominio = domainSelect.value;
        let email = `${nombre}.${sufijo}@${dominio}`;
        
        emailField.value = email;
        updateHistory(email);
    }

    function updateHistory(email) {
        if (!emailHistory.includes(email)) {
            emailHistory.unshift(email);
            renderHistory();
        }
    }

    function renderHistory() {
        historyList.innerHTML = "";
    
        let start = (currentPage - 1) * emailsPerPage;
        let end = start + emailsPerPage;
        let paginatedEmails = emailHistory.slice(start, end);
    
        paginatedEmails.forEach((email) => {
            let listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
    
            // Texto del email a la izquierda
            let emailText = document.createElement("span");
            emailText.textContent = email;
    
            // Contenedor de botones (alineados a la derecha)
            let buttonContainer = document.createElement("div");
            buttonContainer.className = "d-flex gap-2"; // Espaciado entre botones
    
            // Botón de copiar
            let copyIcon = document.createElement("button");
            copyIcon.className = "btn btn-sm btn-light border shadow-sm rounded";
            copyIcon.innerHTML = '<i class="fa-solid fa-copy"></i>';
            copyIcon.setAttribute("data-bs-toggle", "tooltip");
            copyIcon.setAttribute("title", "Copiar email");
            copyIcon.addEventListener("click", function () {
                navigator.clipboard.writeText(email);
                alert("Email copiado: " + email);
            });
    
            // Botón de eliminar
            let deleteIcon = document.createElement("button");
            deleteIcon.className = "btn btn-sm btn-danger text-white shadow-sm rounded";
            deleteIcon.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteIcon.setAttribute("data-bs-toggle", "tooltip");
            deleteIcon.setAttribute("title", "Eliminar email");

            // Inicializar el tooltip para este botón
            let tooltip = new bootstrap.Tooltip(deleteIcon);

            deleteIcon.addEventListener("click", function () {
                // Obtener la instancia del tooltip y ocultarlo antes de eliminar el email
                let tooltipInstance = bootstrap.Tooltip.getInstance(deleteIcon);
                if (tooltipInstance) {
                    tooltipInstance.hide();
                }

                // Eliminar el email de la lista y volver a renderizar
                emailHistory.splice(emailHistory.indexOf(email), 1);
                renderHistory();
            });
    
            // Botón de descargar
            let downloadIcon = document.createElement("button");
            downloadIcon.className = "btn btn-sm btn-light border shadow-sm rounded";
            downloadIcon.innerHTML = '<i class="fa-solid fa-download"></i>';
            downloadIcon.setAttribute("data-bs-toggle", "tooltip");
            downloadIcon.setAttribute("title", "Descargar email");
            downloadIcon.addEventListener("click", function () {
                let blob = new Blob([email], { type: "text/plain" });
                let enlace = document.createElement("a");
                enlace.href = URL.createObjectURL(blob);
                enlace.download = `${email}.txt`;
                document.body.appendChild(enlace);
                enlace.click();
                document.body.removeChild(enlace);
            });
    
            // Agregar botones al contenedor
            buttonContainer.appendChild(copyIcon);
            buttonContainer.appendChild(deleteIcon);
            buttonContainer.appendChild(downloadIcon);
    
            // Agregar elementos a la lista
            listItem.appendChild(emailText);
            listItem.appendChild(buttonContainer);
            historyList.appendChild(listItem);
        });
    
        updatePaginationButtons();
        activateTooltips();
    }

    function updatePaginationButtons() {
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = (currentPage * emailsPerPage) >= emailHistory.length;
    }

    function activateTooltips() {
        let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    prevPageBtn.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            renderHistory();
        }
    });

    nextPageBtn.addEventListener("click", function () {
        if (currentPage * emailsPerPage < emailHistory.length) {
            currentPage++;
            renderHistory();
        }
    });

    generateBtn.addEventListener("click", generarEmail);
    copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(emailField.value);
        alert("Email copiado: " + emailField.value);
    });
    downloadBtn.addEventListener("click", function () {
        let contenido = emailHistory.join("\n");
        let blob = new Blob([contenido], { type: "text/plain" });
        let enlace = document.createElement("a");

        enlace.href = URL.createObjectURL(blob);
        enlace.download = "historial_emails.txt";
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
    });

    // 🟢 Eliminar este evento para evitar que el email se genere al escribir
    // nameInput.addEventListener("input", generarEmail);

    // 🟢 Generar un email al cargar la página
    generarEmail();
});