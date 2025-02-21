document.addEventListener("DOMContentLoaded", function () {
    // Referencias a elementos del DOM
    const usernameField = document.getElementById("username-field");
    const generateBtn = document.getElementById("generate-btn");
    const copyBtn = document.getElementById("copy-btn");
    const historyList = document.getElementById("history-list");
    const downloadAllBtn = document.getElementById("download-all-btn");

    const history = new Set(); // Usamos un Set para evitar duplicados

    function generateUsername() {
        fetch('/generate_username')
            .then(response => response.json())
            .then(data => {
                if (!history.has(data.username)) { 
                    usernameField.value = data.username;
                    addToHistory(data.username);
                } else {
                    generateUsername(); // Si el nombre ya existe, generamos otro
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function addToHistory(username) {
        if (!history.has(username)) {
            history.add(username);
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.textContent = username;

            const downloadBtn = document.createElement("button");
            downloadBtn.className = "btn btn-sm btn-grey";
            downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>';
            downloadBtn.onclick = () => downloadSingle(username);

            listItem.appendChild(downloadBtn);
            historyList.appendChild(listItem);
        }
    }

    function copyToClipboard() {
        const copyText = usernameField.value;
        if (copyText.trim() === "") {
            alert("No hay nombre de usuario para copiar.");
            return;
        }
        navigator.clipboard.writeText(copyText).then(() => {
            alert("¡Nombre copiado!");
        }).catch(err => {
            console.error("Error al copiar:", err);
        });
    }

    function downloadSingle(username) {
        const blob = new Blob([username], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${username}.txt`;
        link.click();
    }

    function downloadAll() {
        if (history.size === 0) return;
        const blob = new Blob([Array.from(history).join("\n")], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "historial_usuarios.txt";
        link.click();
    }

    generateBtn.addEventListener("click", generateUsername);
    copyBtn.addEventListener("click", copyToClipboard);
    downloadAllBtn.addEventListener("click", downloadAll);
});
