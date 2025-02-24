document.addEventListener("DOMContentLoaded", function () {
    const usernameField = document.getElementById("username-field");
    const generateBtn = document.getElementById("generate-btn");
    const copyBtn = document.getElementById("copy-btn");
    const historyList = document.getElementById("history-list");
    const downloadAllBtn = document.getElementById("download-all-btn");

    let history = []; // Historial de nombres

    function generateUsername() {
        fetch('/generate_username')
            .then(response => response.json())
            .then(data => {
                usernameField.value = data.username;
                addToHistory(data.username);
                // Habilitar botón de copiar al generar un nombre
                copyBtn.disabled = false;
            })
            .catch(error => console.error('Error:', error));
    }

    function addToHistory(username) {
        if (!history.includes(username)) {
            history.unshift(username); // Añadir al principio para invertir el orden

            if (history.length > 10) {
                history.pop(); // Limitar a 10 elementos
            }

            // Actualizar el historial en la interfaz
            updateHistoryList();
        }
    }

    function updateHistoryList() {
        historyList.innerHTML = ''; // Limpiar la lista actual

        history.forEach(username => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.setAttribute("data-username", username);
            listItem.textContent = username;

            // Contenedor de botones
            const buttonContainer = document.createElement("div");
            buttonContainer.className = "d-flex gap-2";

            // Botón de copiar
            const copyBtnItem = document.createElement("button");
            copyBtnItem.className = "btn btn-sm btn-grey";
            copyBtnItem.innerHTML = '<i class="fa-solid fa-copy"></i>';
            copyBtnItem.onclick = () => copySelected(username);

            // Botón de eliminar
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-sm btn-danger";
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteBtn.onclick = () => deleteFromHistory(username);

            // Botón de descargar
            const downloadBtn = document.createElement("button");
            downloadBtn.className = "btn btn-sm btn-grey";
            downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>';
            downloadBtn.onclick = () => downloadSingle(username);

            // Agregar botones al contenedor
            buttonContainer.appendChild(copyBtnItem);
            buttonContainer.appendChild(deleteBtn);
            buttonContainer.appendChild(downloadBtn);

            // Agregar contenedor al elemento de historial
            listItem.appendChild(buttonContainer);
            historyList.appendChild(listItem);
        });

        // Actualizar estado del botón "Descargar Todos" según el historial
        downloadAllBtn.disabled = history.length === 0;
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
        if (copyText.trim() === "") {
            // Si no hay nombre generado, no se procede a copiar.
            return;
        }
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
    copyBtn.addEventListener("click", copyToClipboard);
    downloadAllBtn.addEventListener("click", downloadAll);

    // Cargar historial al inicio
    fetch('/get_history')
        .then(response => response.json())
        .then(data => {
            history = data.history;
            updateHistoryList();
        });
});
