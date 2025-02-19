from flask import Flask, render_template, request, jsonify
import random
import string

app = Flask(__name__)

def generate_password(length, use_digits, use_specials):
    """Genera una contraseña aleatoria según los parámetros proporcionados."""
    characters = string.ascii_letters  # Letras mayúsculas y minúsculas
    if use_digits:
        characters += string.digits
    if use_specials:
        characters += string.punctuation
    
    password = ''.join(random.choice(characters) for _ in range(length))
    return password

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    """Maneja la petición para generar una contraseña."""
    data = request.json

    # Validaciones de seguridad (en caso de que alguien intente hacer una petición directa)
    try:
        length = int(data.get('length', 0))  # Convertir a entero, si falla capturamos error
    except ValueError:
        return jsonify({"error": "La longitud debe ser un número entero válido."}), 400

    if length < 4 or length > 50:
        return jsonify({"error": "La longitud debe estar entre 4 y 50."}), 400

    use_digits = data.get('use_digits', True)
    use_specials = data.get('use_specials', True)

    password = generate_password(length, use_digits, use_specials)
    return jsonify({"password": password})

if __name__ == '__main__':
    app.run(debug=True)
