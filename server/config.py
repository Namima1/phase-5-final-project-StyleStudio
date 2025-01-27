from flask import Flask 
from flask_sqlalchemy import SQLAlchemy 
from flask_migrate import Migrate
from sqlalchemy import MetaData
from flask_restful import Api
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import os

# Define metadata for migrations
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s"
})

# Initialize Flask app
app = Flask(__name__)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database with app
db = SQLAlchemy(app, metadata=metadata)
migrate = Migrate(app, db)

# Initialize Flask-RESTful API
api = Api(app)

# Configure CORS to allow requests from frontend
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Initialize Bcrypt for password hashing
bcrypt = Bcrypt(app)

# Generate a secret key for session security
app.secret_key = b'y$2\xa7l\x89\xb0\t\x87\xb5\x1abf\xff\xeb\xd5'

# Configure and ensure upload folder exists
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static/uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)