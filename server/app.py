from flask import request, jsonify, send_from_directory, session
from flask_session import Session
import os
from config import app, db, bcrypt
from models import ClothingItem, Outfit, OutfitItem, User
from datetime import timedelta
import logging
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(level=logging.INFO)

# Configure session settings
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static/uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.config["SESSION_PERMANENT"] = True
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"]= "True"
# Session(app)

# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])


@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Virtual Closet API!"})

# ---------------- AUTHENTICATION ENDPOINTS ----------------

@app.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    print(data)  # Debugging to check received data

    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "All fields are required"}), 400

    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    logging.info(f"New user registered: {new_user.email}")
    return jsonify({"message": "User registered successfully", "user_id": new_user.id}), 201

@app.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    print(user)
    print(user.id)

    if user and bcrypt.check_password_hash(user.password, data.get('password')):
        session.permanent = True  # Set session lifetime
        print(user.id)
        session['user_id'] = user.id
        print(session.get("user_id"))
        logging.info(f"User logged in: {user.email}")
        return jsonify({"message": "Login successful", "user_id": user.id}), 200
    else:
        logging.warning(f"Failed login attempt for email: {data.get('email')}")
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.pop('user_id', None)
    logging.info("User logged out")
    return jsonify({"message": "Logout successful"}), 200

@app.route('/check-session', methods=['GET'])
def check_session():
    """Check if a user session exists"""
    print(session)
    print(session.get("user_id"))
    if 'user_id' in session:
        logging.info(f"Session active for user ID: {session['user_id']}")
        return jsonify({"authenticated": True, "user_id": session['user_id']}), 200
    logging.info("No active session found.")
    return jsonify({"authenticated": False}), 401

# ---------------- CLOTHING ENDPOINTS ----------------

@app.route('/clothing', methods=['GET'])
def get_clothing():
    """Retrieve all clothing items"""
    items = ClothingItem.query.all()
    response = jsonify([
        {
            "id": item.id,
            "name": item.name,
            "category": item.category,
            "image_url": item.image_url,
            "user_id": item.user_id
        } for item in items
    ])
    return response

@app.route('/clothing/<int:user_id>', methods=['GET'])
def get_clothing_by_id(user_id):
    """Retrieve all clothing items"""
    print(id)
    items = ClothingItem.query.filter_by(user_id = user_id)
    response = jsonify([
        {
            "id": item.id,
            "name": item.name,
            "category": item.category,
            "image_url": item.image_url, 
            "user_id": item.id
        } for item in items
    ])
    return response

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit upload size to 16MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/clothing/upload', methods=['POST'])
def upload_clothing():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    name = request.form.get('name')
    category = request.form.get('category')

    if not name or not category:
        return jsonify({"error": "Name and category are required"}), 400

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        try:
            file.save(file_path)
            new_clothing_item = ClothingItem(
                name=name,
                category=category,
                image_url=f"/static/uploads/{filename}"
            )
            db.session.add(new_clothing_item)
            db.session.commit()
        except Exception as e:
            app.logger.error(f"Error saving file: {e}")
            return jsonify({"error": "Failed to save the file"}), 500

        return jsonify({
            "message": "Clothing item uploaded successfully",
            "id": new_clothing_item.id,
            "name": new_clothing_item.name,
            "category": new_clothing_item.category,
            "image_url": f"/static/uploads/{filename}"
        }), 201

    return jsonify({"error": "Invalid file format"}), 400


@app.route('/clothing/<int:item_id>', methods=['PATCH'])
def update_clothing(item_id):
    """Update a clothing item"""
    item = ClothingItem.query.get(item_id)
    if not item:
        return jsonify({"error": f"Clothing item with ID {item_id} not found"}), 404

    item.name = request.form.get('name', item.name)
    item.category = request.form.get('category', item.category)

    if 'file' in request.files:
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            try:
                file.save(file_path)
            except Exception as e:
                logging.error(f"Error saving file: {e}")
                return jsonify({"error": "Failed to save the file"}), 500

            item.image_url = f"http://127.0.0.1:5000/static/uploads/{filename}"

    db.session.commit()
    return jsonify({
        "message": "Item updated successfully",
        "id": item.id,
        "name": item.name,
        "category": item.category,
        "image_url": item.image_url
    }), 200

@app.route('/clothing/<int:item_id>', methods=['DELETE'])
def delete_clothing(item_id):
    """Delete a clothing item"""
    item = ClothingItem.query.get(item_id)
    if not item:
        return jsonify({"error": f"Clothing item with ID {item_id} not found"}), 404

    image_filename = os.path.basename(item.image_url)
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)

    if os.path.exists(image_path):
        os.remove(image_path)
    
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted successfully"}), 200

@app.route('/static/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        logging.error(f"File not found: {filename}")
        return jsonify({"error": str(e)}), 404

if __name__ == '__main__':
    Session(app)
    app.run(debug=True, port=5000)