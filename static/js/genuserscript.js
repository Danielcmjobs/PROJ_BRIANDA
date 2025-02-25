document.addEventListener("DOMContentLoaded", function () {
    const usernameField = document.getElementById("username-field");
    const generateBtn = document.getElementById("generate-btn");
    const copyBtn = document.getElementById("copy-btn");
    const historyList = document.getElementById("history-list");
    const downloadAllBtn = document.getElementById("download-all-btn");
    const paginationContainer = document.createElement("div");
    paginationContainer.className = "d-flex gap-2 mt-3 justify-content-center";
    
    let history = []; // Historial de nombres
    let currentPage = 1;
    const itemsPerPage = 5;
    const maxPages = 15; // Límite de paginación reducido a 15 páginas
    let limitMessageShown = false; // Bandera para mostrar el mensaje solo una vez

    function generateUsername() {
        fetch('/generate_username')
            .then(response => response.json())
            .then(data => {
                usernameField.value = data.username;
                addToHistory(data.username);
                copyBtn.disabled = false;
            })
            .catch(error => console.error('Error:', error));
    }

    function addToHistory(username) {
        if (!history.includes(username)) {
            history.unshift(username);
            // Si se excede el límite máximo (15 páginas x 5 elementos = 75 nombres), se elimina el último
            if (history.length > itemsPerPage * maxPages) {
                history.pop();
                if (!limitMessageShown) {
                    Swal.fire({
                        icon: "info",
                        title: "Atención",
                        text: "Los nombres que se generen a partir de ahora sobreescribirán los primeros que se generaron."
                    });
                    limitMessageShown = true;
                }
            }
            updateHistoryList();
        }
    }

    function updateHistoryList() {
        historyList.innerHTML = '';
        paginationContainer.innerHTML = '';
        
        const start = (currentPage - 1) * itemsPerPage;
        const paginatedItems = history.slice(start, start + itemsPerPage);

        paginatedItems.forEach(username => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.textContent = username;

            const buttonContainer = document.createElement("div");
            buttonContainer.className = "d-flex gap-2";

            const copyBtnItem = document.createElement("button");
            copyBtnItem.className = "btn btn-sm btn-grey";
            copyBtnItem.innerHTML = '<i class="fa-solid fa-copy"></i>';
            copyBtnItem.title = "Copiar nombre de usuario";
            copyBtnItem.onclick = () => copySelected(username);

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-sm btn-danger";
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteBtn.title = "Eliminar este nombre de usuario";
            deleteBtn.onclick = () => deleteFromHistory(username);

            const downloadBtn = document.createElement("button");
            downloadBtn.className = "btn btn-sm btn-grey";
            downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>';
            downloadBtn.title = "Descargar este nombre de usuario";
            downloadBtn.onclick = () => downloadSingle(username);

            buttonContainer.append(copyBtnItem, deleteBtn, downloadBtn);
            listItem.appendChild(buttonContainer);
            historyList.appendChild(listItem);
        });
        
        createPaginationButtons();
        downloadAllBtn.disabled = history.length === 0;
    }

    function createPaginationButtons() {
        const totalPages = Math.min(Math.ceil(history.length / itemsPerPage), maxPages);
        if (totalPages <= 1) return;
        
        const visiblePages = 5; // Mostrar solo 5 números de página a la vez
        let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
        let endPage = startPage + visiblePages - 1;
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - visiblePages + 1);
        }
        
        const paginationWrapper = document.createElement("div");
        paginationWrapper.className = "d-flex gap-2 justify-content-center";
        
        // Botón de retroceso
        const prevButton = document.createElement("button");
        prevButton.className = "btn btn-sm btn-grey";
        prevButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        prevButton.title = "Página anterior";
        prevButton.disabled = currentPage === 1;
        prevButton.onclick = () => {
            currentPage = currentPage - 1;
            updateHistoryList();
        };
        paginationWrapper.appendChild(prevButton);
        
        // Botones con números de página
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement("button");
            pageButton.className = `btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-grey'}`;
            pageButton.textContent = i;
            pageButton.title = `Ir a la página ${i}`;
            pageButton.onclick = () => {
                currentPage = i;
                updateHistoryList();
            };
            paginationWrapper.appendChild(pageButton);
        }
        
        // Botón de avance
        const nextButton = document.createElement("button");
        nextButton.className = "btn btn-sm btn-grey";
        nextButton.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        nextButton.title = "Página siguiente";
        nextButton.disabled = currentPage === totalPages;
        nextButton.onclick = () => {
            currentPage = currentPage + 1;
            updateHistoryList();
        };
        paginationWrapper.appendChild(nextButton);
        
        paginationContainer.appendChild(paginationWrapper);
        historyList.parentElement.appendChild(paginationContainer);
    }

    function copySelected(username) {
        navigator.clipboard.writeText(username)
            .then(() => Swal.fire("Nombre copiado"))
            .catch(err => console.error("Error al copiar:", err));
    }

    function deleteFromHistory(username) {
        history = history.filter(user => user !== username);
        updateHistoryList();
    }

    function copyToClipboard() {
        const copyText = usernameField.value;
        if (copyText.trim() === "") return;
        navigator.clipboard.writeText(copyText)
            .then(() => Swal.fire("¡Nombre copiado!"))
            .catch(err => console.error("Error al copiar:", err));
    }

    function downloadSingle(username) {
        const blob = new Blob([username], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${username}.txt`;
        link.click();
    }

    function downloadAll() {
        if (history.length === 0) return;
        const blob = new Blob([history.join("\n")], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "historial_usuarios.txt";
        link.click();
    }

    generateBtn.addEventListener("click", generateUsername);
    generateBtn.title = "Generar un nuevo nombre de usuario";   

    copyBtn.addEventListener("click", copyToClipboard);
    copyBtn.title = "Copiar el nombre de usuario generado";
    
    downloadAllBtn.addEventListener("click", downloadAll);
    downloadAllBtn.title = "Descargar todo el historial de nombres de usuario";

    // Crear usuario automáticamente al abrir la pestaña
    generateUsername();

    fetch('/get_history')
    .then(response => response.json())
    .then(data => {
        history = data.history;
        updateHistoryList();
        
        // Generar un nuevo usuario solo si el historial está vacío
        if (history.length === 0) {
            generateUsername();
        }
    })
    .catch(error => {
        console.error("Error al obtener el historial:", error);
        generateUsername(); // En caso de error, generar usuario de todos modos
    });
});
