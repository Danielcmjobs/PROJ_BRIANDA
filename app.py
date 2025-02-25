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

def generate_username(base_name=None):
    """Genera un nombre de usuario aleatorio, con opción de incluir un nombre base."""
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
        base = base_name.capitalize() if base_name else random.choice(prefixes)
        random_suffix = random.choice(suffixes)
        random_num = random.randint(0, 99)
        username = f"{base}{random_suffix}{random_num}"[:20]
        
        if username not in existing_usernames:
            existing_usernames.add(username)
            return username

@app.route('/generate_username', methods=['GET'])
def generate_random_username():
    """Genera y devuelve un nombre de usuario aleatorio único, con opción de incluir un nombre base."""
    base_name = request.args.get('name')  # Obtener el nombre del usuario si lo proporciona
    username = generate_username(base_name)
    return jsonify({"username": username})

if __name__ == '__main__':
    app.run(debug=True)
