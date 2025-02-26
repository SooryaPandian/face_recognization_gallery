from flask import Flask
from flask_cors import CORS
from routes import init_routes
from config import Config
from db import db

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)  # Enable CORS

init_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
