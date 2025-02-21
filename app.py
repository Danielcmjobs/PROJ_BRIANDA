from flask import Flask, render_template, request, jsonify 
import random
import string

app = Flask(__name__)

existing_usernames = set()
history = []  # Historial de usuarios

MAX_HISTORY = 15  # Límite del historial

def generate_password(length=12, use_digits=True, use_specials=True):
    """Genera una contraseña aleatoria según los parámetros proporcionados."""
    characters = string.ascii_letters  # Letras mayúsculas y minúsculas
    if use_digits:
        characters += string.digits
    if use_specials:
        characters += string.punctuation
    
    password = ''.join(random.choice(characters) for _ in range(length))
    return password

def generate_email(names=None, domains=None, extensions=None):
    """Genera un correo electrónico basado en palabras clave del usuario."""
    default_names = ["user", "test", "random", "guest", "member"]
    default_domains = ["gmail", "yahoo", "outlook", "hotmail", "protonmail"]
    default_extensions = [".com", ".net", ".org", ".io"]

    # Si el usuario proporciona valores, los usamos; si no, usamos los predeterminados
    names = names if names else default_names
    domains = domains if domains else default_domains
    extensions = extensions if extensions else default_extensions

    username = random.choice(names) + ''.join(random.choices(string.digits, k=4))
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

def generate_username():
    """Genera un nombre de usuario aleatorio sin repetir."""
    prefixes = [
    "Dark", "Shadow", "Fire", "Crystal", "Magic", "Silver", "Golden",
    "Storm", "Lunar", "Mystic", "Iron", "Thunder", "Frozen", "Phantom", 
    "Light", "Wild", "Steel", "Inferno", "Venom", "Echo", "Obsidian", 
    "Blaze", "Silver", "Raven", "Wraith", "Sun", "Night", "Azure", 
    "Violet", "Emerald", "Ruby", "Cobalt", "Abyss", "Titan"
]

    suffixes = [
    "Wolf", "Fox", "Gamer", "Dragon", "Phantom", "Hunter", "Knight",
    "Viper", "Falcon", "Bear", "Tiger", "Lion", "Reaper", "Ninja", 
    "Knight", "Mage", "Wizard", "Shaman", "Gladiator", "Sorcerer", 
    "Warrior", "Titan", "Champion", "Assassin", "Baron", "Ranger", 
    "Sage", "Barbarian", "Samurai", "Guardian", "Overlord", "Knightmare"
]

    
    while True:
        random_prefix = random.choice(prefixes)
        random_suffix = random.choice(suffixes)
        random_num = random.randint(0, 99)
        username = f"{random_prefix}{random_suffix}{random_num}"[:20]
        
        if username not in existing_usernames:
            existing_usernames.add(username)
            return username

@app.route('/generate_username', methods=['GET'])
def generate_random_username():
    """Genera y devuelve un nombre de usuario aleatorio único."""
    username = generate_username()
    return jsonify({"username": username})

@app.route('/generate_custom_email', methods=['POST'])
def generate_custom_email():
    """Recibe las palabras clave y genera un email personalizado."""
    data = request.json
    names = [name.strip() for name in data.get('names', '').split(',') if name.strip()]
    domains = [domain.strip() for domain in data.get('domains', '').split(',') if domain.strip()]
    extensions = [ext.strip() for ext in data.get('extensions', '').split(',') if ext.strip()]

    email = generate_email(names, domains, extensions)
    return jsonify({"email": email})

@app.route('/get_history', methods=['GET'])
def get_history():
    """Devuelve el historial de usuarios."""
    return jsonify({"history": history})

@app.route('/add_to_history', methods=['POST'])
def add_to_history():
    """Añade un nuevo usuario al historial, respetando el límite de 15."""
    data = request.json
    username = data.get('username')

    # Añadir al principio de la lista para invertir el orden
    history.insert(0, username)

    # Limitar el historial a 15 elementos
    if len(history) > MAX_HISTORY:
        history.pop()  # Eliminar el último elemento si hay más de 15

    return jsonify({"status": "success", "history": history})

if __name__ == '__main__':
    app.run(debug=True)
