document.addEventListener("DOMContentLoaded", function () {
    const emailField = document.getElementById("generated-email");
    const generateBtn = document.getElementById("generate-email-btn");
    const copyBtn = document.getElementById("copy-email-btn");
    const historyList = document.getElementById("email-history");
    const downloadBtn = document.getElementById("download-history-btn");
    const domainSelect = document.getElementById("domain-selection");
    const nameInput = document.getElementById("email-name");
    const errorMessage = document.getElementById("error-message");

    let emailHistory = [];
    let currentPage = 1;
    const emailsPerPage = 5;
    const maxPagesVisible = 5; // Máximo de páginas visibles en la paginación

    function generarCadenaAleatoria(longitud) {
        const caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
        let resultado = "";
        for (let i = 0; i < longitud; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return resultado;
    }

    function validarNombre(nombre) {
        const regex = /^[a-zA-Z0-9]+$/;
        return regex.test(nombre);
    }

    function generarEmail() {
        const nombres = [
            "juan", "maria", "pedro", "laura", "carlos", "sofia", "diego", "ana",
            "ricardo", "valentina", "daniel", "fernanda", "alex", "camila", "luis", "elena"
        ];

        let nombre = nameInput.value.trim();

        if (nombre && !validarNombre(nombre)) {
            errorMessage.textContent = "El nombre solo puede contener letras y números.";
            errorMessage.style.color = "red";
            return;
        }

        errorMessage.textContent = "";

        if (!nombre) {
            nombre = nombres[Math.floor(Math.random() * nombres.length)];
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

            let emailText = document.createElement("span");
            emailText.textContent = email;

            let buttonContainer = document.createElement("div");
            buttonContainer.className = "d-flex gap-2";

            let copyIcon = document.createElement("button");
            copyIcon.className = "btn btn-sm btn-light border shadow-sm rounded";
            copyIcon.innerHTML = '<i class="fa-solid fa-copy"></i>';
            copyIcon.setAttribute("data-bs-toggle", "tooltip");
            copyIcon.setAttribute("title", "Copiar email");
            copyIcon.addEventListener("click", function () {
                copiarEmail(email);
            });

            let deleteIcon = document.createElement("button");
            deleteIcon.className = "btn btn-sm btn-danger text-white shadow-sm rounded";
            deleteIcon.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteIcon.setAttribute("data-bs-toggle", "tooltip");
            deleteIcon.setAttribute("title", "Eliminar email");

            let tooltip = new bootstrap.Tooltip(deleteIcon);

            deleteIcon.addEventListener("click", function () {
                let tooltipInstance = bootstrap.Tooltip.getInstance(deleteIcon);
                if (tooltipInstance) {
                    tooltipInstance.hide();
                }

                emailHistory.splice(emailHistory.indexOf(email), 1);
                renderHistory();
            });

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

            buttonContainer.appendChild(copyIcon);
            buttonContainer.appendChild(deleteIcon);
            buttonContainer.appendChild(downloadIcon);

            listItem.appendChild(emailText);
            listItem.appendChild(buttonContainer);
            historyList.appendChild(listItem);
        });

        renderPagination();
        activateTooltips();
    }

    function renderPagination() {
        const paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(emailHistory.length / emailsPerPage);
        if (totalPages <= 1) return;

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesVisible - 1);

        if (endPage - startPage + 1 < maxPagesVisible) {
            startPage = Math.max(1, endPage - maxPagesVisible + 1);
        }

        const prevButton = document.createElement("li");
        prevButton.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
        prevButton.innerHTML = `<a class="page-link" href="#">&#8592;</a>`;
        prevButton.addEventListener("click", function () {
            if (currentPage > 1) {
                currentPage--;
                renderHistory();
            }
        });
        paginationContainer.appendChild(prevButton);

        for (let i = startPage; i <= endPage; i++) {
            let pageItem = document.createElement("li");
            pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageItem.addEventListener("click", function () {
                currentPage = i;
                renderHistory();
            });
            paginationContainer.appendChild(pageItem);
        }

        const nextButton = document.createElement("li");
        nextButton.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
        nextButton.innerHTML = `<a class="page-link" href="#">&#8594;</a>`;
        nextButton.addEventListener("click", function () {
            if (currentPage < totalPages) {
                currentPage++;
                renderHistory();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    function activateTooltips() {
        let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    generateBtn.addEventListener("click", generarEmail);
    copyBtn.addEventListener("click", function () {
        copiarEmail(emailField.value);
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

    function copiarEmail(email) {
        navigator.clipboard.writeText(email).then(() => {
            Swal.fire({
                title: "📋 Copiado",
                text: `Email copiado: ${email}`,
                icon: "success",
                confirmButtonColor: "#6c5ce7",
                confirmButtonText: "Aceptar",
                timer: 2000,
                timerProgressBar: true
            });
        }).catch(err => {
            console.error("Error al copiar: ", err);
        });
    }

    generarEmail();
});

