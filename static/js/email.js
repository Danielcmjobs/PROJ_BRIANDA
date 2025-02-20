document.addEventListener("DOMContentLoaded", function () {
    const emailField  = document.getElementById("generated-email");
    const generateBtn = document.getElementById("generate-email-btn");
  
    /**
     * Función para generar una cadena aleatoria
     */
    function generarCadenaAleatoria(longitud) {
      const caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
      let resultado = "";
      for (let i = 0; i < longitud; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      }
      return resultado;
    }
  
    /**
     * Genera un email aleatorio con más variabilidad
     */
    function generarEmail() {
      const nombres = [
        "juan", "maria", "pedro", "laura", "carlos", "sofia", "diego", "ana",
        "ricardo", "valentina", "daniel", "fernanda", "alex", "camila", "luis", "elena"
      ];
      const dominios = [
        "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com",
        "mail.com", "protonmail.com", "fastmail.com", "zohomail.com", "empresa.com"
      ];
  
      let nombre = nombres[Math.floor(Math.random() * nombres.length)];
      let sufijo = generarCadenaAleatoria(4); // Genera 4 caracteres aleatorios
      let dominio = dominios[Math.floor(Math.random() * dominios.length)];
  
      let email = `${nombre}.${sufijo}@${dominio}`;
      emailField.value = email;
    }
  
    // Generar un email inicial al cargar la página
    generarEmail();
  
    // Evento para generar un nuevo email cuando se hace clic en el botón
    generateBtn.addEventListener("click", generarEmail);
  });
  
  
  