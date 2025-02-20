from flask import Flask, render_template, request, jsonify
import random
import string

app = Flask(__name__)

def generate_password(length=12, use_digits=True, use_specials=True):
    """Genera una contraseña aleatoria según los parámetros proporcionados."""
    characters = string.ascii_letters  # Letras mayúsculas y minúsculas
    if use_digits:
        characters += string.digits
    if use_specials:
        characters += string.punctuation
    
    password = ''.join(random.choice(characters) for _ in range(length))
    return password

def generate_email():
    """Genera un correo electrónico aleatorio."""
    names = ["user", "test", "random", "guest", "member"]
    domains = ["gmail", "yahoo", "outlook", "hotmail", "protonmail"]
    extensions = [".com", ".net", ".org", ".io"]

    username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    domain = random.choice(domains)
    extension = random.choice(extensions)

    email = f"{username}@{domain}{extension}"
    return email


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/email')
def email():
    return render_template('/email.html')

@app.route('/genuser')
def genuser():
    return render_template('/genuser.html')

@app.route('/generate', methods=['POST'])
def generate():
    """Maneja la petición para generar una contraseña."""
    data = request.json
    length = data.get('length', 12)
    use_digits = data.get('use_digits', True)
    use_specials = data.get('use_specials', True)
    
    password = generate_password(length, use_digits, use_specials)
    return jsonify({"password": password})

@app.route('/generate_email', methods=['GET'])
def generate_random_email():
    """Genera y devuelve un email aleatorio."""
    email = generate_email()
    return jsonify({"email": email})

def generate_username():
    """Genera un nombre de usuario aleatorio."""
    prefixes = ["Dark", "Shadow", "Fire", "Crystal", "Magic", "Silver", "Golden"]
    suffixes = ["Wolf", "Fox", "Gamer", "Dragon", "Phantom", "Hunter", "Knight"]
    random_prefix = random.choice(prefixes)
    random_suffix = random.choice(suffixes)
    random_num = random.randint(0, 99)
    return f"{random_prefix}{random_suffix}{random_num}"[:20]

@app.route('/generate_username', methods=['GET'])
def generate_random_username():
    """Genera y devuelve un nombre de usuario aleatorio."""
    username = generate_username()
    return jsonify({"username": username})

if __name__ == '__main__':
    app.run(debug=True)
