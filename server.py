from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from urllib.parse import quote
from flask_bcrypt import Bcrypt
import sqlite3
import jwt
from datetime import datetime, timedelta, UTC

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Secret Key'
CORS(app)
bcrypt = Bcrypt(app)

API_KEY = "94baba82565b67fa8ba5866bda4fbf77";
BASE_URL = "https://api.themoviedb.org/3";
headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NGJhYmE4MjU2NWI2N2ZhOGJhNTg2NmJkYTRmYmY3NyIsIm5iZiI6MTc0MzI1MDQ2OS4yNTcsInN1YiI6IjY3ZTdlNDI1NmIzNjdkNDY5NTY3YmNmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hFAmxmi3iLmGqvYE_JisYSSpSLIYYMc46uEYpQEikBI"
}

@app.route('/popular_movies', methods=['GET'])
def get_popular_movies():
    try:
        response = requests.get(f'{BASE_URL}/movie/popular', headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data['results']
        else:
            print(response)
            return []
    except Exception as e:
        print('Exception Popular')
        print(e)
        return []
    
@app.route('/genres', methods=['GET'])
def get_genres():
    try:
        response = requests.get(f'{BASE_URL}/genre/movie/list?&language=en-US', headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            return {"genres": []}
    except Exception as e:
        print("Exception Genre")
        print(e)
        return {"genres": []}

@app.route('/movies_by_genre/<genre_id>', methods=['GET'])
def get_movies_by_genre(genre_id):
    try:
        response = requests.get(f'{BASE_URL}/discover/movie?&language=en-US&sort_by=popularity.desc&with_genres={genre_id}', headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data['results']
        else:
            return []
    except Exception as e:
        print("Exception Genre get")
        print(e)
        return []

def movie_credits(movie_id):
    try:
        response = requests.get(f'{BASE_URL}/movie/{movie_id}/credits', headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print(response)
            return []
    except Exception as e:
        print('Exception movie credit')
        print(e)
        return []

def movie_videos(movie_id):
    try:
        response = requests.get(f'{BASE_URL}/movie/{movie_id}/videos', headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print(response)
            return []
    except Exception as e:
        print('Exception movie videos')
        print(e)
        return []

def movie_images(movie_id):
    try:
        response = requests.get(f'{BASE_URL}/movie/{movie_id}/images', headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print(response)
            return []
    except Exception as e:
        print('Exception movie images')
        print(e)
        return []

def movie_externals(movie_id):
    try:
        response = requests.get(f'{BASE_URL}/movie/{movie_id}/external_ids', headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print(response)
            return []
    except Exception as e:
        print('Exception movie externals')
        print(e)
        return []

def movie_providers(movie_id):
    try:
        response = requests.get(f'{BASE_URL}/movie/{movie_id}/watch/providers', headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print(response)
            return []
    except Exception as e:
        print('Exception Providers')
        print(e)
        return []

@app.route('/movie_details/<movie_id>', methods = ['GET'])
def get_movie_details(movie_id):
    try:
        response = requests.get(f'{BASE_URL}/movie/{movie_id}', headers=headers)
        if response.status_code == 200:
            data = response.json()
            credits = movie_credits(movie_id)
            data['credits'] = credits
            videos = movie_videos(movie_id)
            data['videos'] = videos
            images = movie_images(movie_id)
            data['images'] = images
            externals = movie_externals(movie_id)
            data['externals_links'] = externals
            providers = movie_providers(movie_id)
            data['providers'] = providers

            return data
        else:
            print("Exception Movie Details")
            print(response)
            return []
    except Exception as e:
        print('Exception')
        print(e)
        return []

@app.route('/search_movie/<query>', methods=["GET"])
def get_searched_movies(query):
    try:
        response = requests.get(f'{BASE_URL}/search/movie?query={quote(query)}&sort_by=popularity.desc', headers=headers)
        print(response)
        if response.status_code == 200:
            data = response.json()
            # print(data)
            return data['results']
        else:
            print('Err Search')
            print(response)
            return []
    except Exception as e:
        print('Exception Search')
        print(e)
        return []

def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)''')
    conn.commit()
    conn.close()

init_db()

def get_db_connection():
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Signup successful'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username already exists'}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user['password'], password):
        token = jwt.encode({'username': username, 'exp': datetime.now(UTC) + timedelta(hours=1)}, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'message': 'Login successful', 'token': token})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/get_account', methods=['GET'])
def account():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        decoded_token = jwt.decode(token.split()[1], app.config['SECRET_KEY'], algorithms=['HS256'])
        username = decoded_token.get('username')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT username, email, createdAt FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()
        conn.close()

        if not user:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({'username': user['username'], 'email': user['email'], 'createdAt': user['createdAt']})
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

@app.route('/add_favorite', methods=['POST'])
def add_favorite():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        decoded_token = jwt.decode(token.split()[1], app.config['SECRET_KEY'], algorithms=['HS256'])
        username = decoded_token.get('username')
        data = request.json
        movie_id = data.get('movie_id')
        movie_title = data.get('movie_title')
        movie_ratings = data.get('movie_ratings')
        poster_url = data.get('poster_url')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO favorites (username, movie_id, movie_title, ratings, poster_url) 
            VALUES (?, ?, ?, ?, ?)''', 
            (username, movie_id, movie_title, movie_ratings, poster_url)
        )
        conn.commit()
        conn.close()

        return jsonify({'message': 'Movie added to favorites'}), 201

    except sqlite3.IntegrityError:
        return jsonify({'message': 'Movie already added to favorites'}), 401

    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401


@app.route('/get_favorites', methods=['GET'])
def favorites():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        decoded_token = jwt.decode(token.split()[1], app.config['SECRET_KEY'], algorithms=['HS256'])
        username = decoded_token.get('username')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT movie_id, movie_title, ratings, poster_url FROM favorites WHERE username = ?', (username,))
        movies = cursor.fetchall()
        conn.close()

        return jsonify([{
            'movie_id': movie[0],
            'title': movie[1],
            'vote_average': int(movie[2]),
            'poster_path': movie[3]
        } for movie in movies])

    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401


if __name__ == '__main__':
    app.run(debug=True, port=5000)

