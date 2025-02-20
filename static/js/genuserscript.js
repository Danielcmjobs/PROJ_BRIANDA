document.addEventListener("DOMContentLoaded", function () {
    // Referencias a elementos del DOM
    const usernameField = document.getElementById("username-field");
    const generateBtn = document.getElementById("generate-btn");
    const copyBtn = document.getElementById("copy-btn");
    const historyList = document.getElementById("history-list");
    const downloadAllBtn = document.getElementById("download-all-btn");
    
    const history = [];

    function generateUsername() {
        fetch('/generate_username')
            .then(response => response.json())
            .then(data => {
                usernameField.value = data.username;
                addToHistory(data.username);
            })
            .catch(error => console.error('Error:', error));
    }

    function addToHistory(username) {
        if (!history.includes(username)) {
            history.push(username);
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
});