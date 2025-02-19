document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generate-btn");
    const passwordField = document.getElementById("password-field");
    const copyBtn = document.getElementById("copy-btn");
    const passwordStrength = document.getElementById("password-strength");
    const toggleVisibility = document.getElementById("toggle-visibility");
    const lengthInput = document.getElementById("length");
    const errorMessage = document.getElementById("error-message");

    function validateInput() {
        const length = lengthInput.value.trim();

        // Verifica que el valor sea un número entero válido y esté en el rango
        if (!/^\d+$/.test(length) || length < 4 || length > 50) {
            errorMessage.textContent = "Ingrese un número entre 4 y 50.";
            generateBtn.disabled = true;
        } else {
            errorMessage.textContent = "";
            generateBtn.disabled = false;
        }
    }

    function updateStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        let strengthPercent = (strength / 5) * 100;
        passwordStrength.style.width = strengthPercent + "%";
        passwordStrength.style.backgroundColor = strengthPercent < 40 ? "red" : strengthPercent < 70 ? "orange" : "green";
    }
    
    function saveToFile(password) {
        const blob = new Blob([password], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "password.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    function generatePassword() {
        if (generateBtn.disabled) {
            return; // Evita generar la contraseña si la longitud es inválida
        }

        const length = parseInt(lengthInput.value);
        const useDigits = document.getElementById("use-digits").checked;
        const useSpecials = document.getElementById("use-specials").checked;
        
        fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                length: length,
                use_digits: useDigits,
                use_specials: useSpecials
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                errorMessage.textContent = data.error; // Muestra el error si lo hay
                passwordField.value = "";
            } else {
                passwordField.value = data.password;
                updateStrength(data.password);
                saveToFile(data.password);
            }
        })
        .catch(error => console.error("Error al generar la contraseña:", error));
    }

    lengthInput.addEventListener("input", validateInput);
    generateBtn.addEventListener("click", generatePassword);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !generateBtn.disabled) {
            generatePassword();
        }
    });

    copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(passwordField.value);
    });

    toggleVisibility.addEventListener("click", function () {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            toggleVisibility.textContent = "🙈";
        } else {
            passwordField.type = "password";
            toggleVisibility.textContent = "👁";
        }
    });
});
