from flask import Flask, render_template, redirect, url_for, request, session, flash, jsonify,Response
from flask_mysqldb import MySQL


import base64
import hashlib
import os
import uuid  # for generating unique IDs
from werkzeug.utils import secure_filename
from deepface import DeepFace
import threading
import cv2
import functools
from flask_cors import CORS
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from project_functions import create_database_client, Client, check_imprint_validity, pass_transaction, get_client_by_username, Transaction, create_database_transaction

# OpenCV VideoCapture setup
cap = cv2.VideoCapture(0)  # Adjust the index or backend as needed
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

counter = 0
face_match = False
recognition_started = False  # Flag to track if recognition is started

# Load reference image

#
import sys
from datetime import datetime
sys.path.append(os.path.join(os.path.dirname(__file__), 'empreinte_digitale'))
from empreinte_digitale import create_empreinte
#



UPLOAD_FOLDER = "my-angular-project/static"

app = Flask(__name__)
CORS(app,supports_credentials=True)
CORS(app, resources={r"/users": {"origins": "http://localhost:4200"}})
app.secret_key = 'secret-key'

# MySQL Config
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'facial_recognition_table'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['CORS_HEADERS'] = 'Content-Type'

mysql = MySQL(app)

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/home')
def home():
    if 'username' in session:
        cur = mysql.connection.cursor()
        cur.execute("SELECT image FROM user WHERE username = %s", [session['username']])
        user = cur.fetchone()
        cur.close()
        if user and user[0]:
            image = user[0]
        else:
            image = None
        return render_template('home.html', username=session['username'], image=image)
    return redirect(url_for('login'))

@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        bpassword = password.encode('utf-8')

        # Handle profile image upload
        if 'image' in request.files:
            image = request.files['image']

            if image.filename == '':
                image_filename = None
            else:
                # Generate a unique filename and create user folder
                user_folder = os.path.join(app.config['UPLOAD_FOLDER'], username)
                os.makedirs(user_folder, exist_ok=True)  # Create user folder if it doesn't exist
                filename = str(uuid.uuid4()) + secure_filename(image.filename)
                image_path = os.path.join(user_folder, filename)
                image.save(image_path)
                image_filename = filename
        else:
            image_filename = None

        RegisteredClient = Client(username, bpassword, image_filename)
        clientCreated = create_database_client(RegisteredClient)

        if clientCreated:
            flash('You have successfully registered! Please log in.', 'success')
            return jsonify({'message':'success'})
        else:
            flash('Error in registration. Please try again.', 'danger')
            return jsonify({'error':'Error in registration. Please try again.'})


######
@app.route('/users', methods=['GET', 'POST'])
def fetch_users():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, username, date, balance FROM user")
        
        user_list = []
        row = cur.fetchone()
        while row is not None:
            user_dict = {'id': row[0], 'username': row[1], 'date': row[2], 'balance': row[3]}
            user_list.append(user_dict)
            row = cur.fetchone()
        cur.close()
        return jsonify(user_list)
    
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    if request.method == 'DELETE':
        try:
            cur = mysql.connection.cursor()
            cur.execute("DELETE FROM user WHERE id = %s", [id])
            mysql.connection.commit()
            cur.close()
            return jsonify({'message': 'User deleted successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
import logging

logging.basicConfig(level=logging.DEBUG)

@app.route('/transactions', methods=['GET', 'POST'])
def fetchTransactions():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, sender, recepient, value, time, signature FROM transactions")
        
        transactions_list = []
        row = cur.fetchone()
        while row is not None:
            sender_key = row[1]
            recepient_key = row[2]
            signature = row[5]

            cur_sender = mysql.connection.cursor()
            cur_sender.execute("SELECT username FROM user WHERE `private-key` = %s", [sender_key])
            sender_username = cur_sender.fetchone()
            sender_username = sender_username[0] if sender_username else 'Unknown Sender'
            cur_sender.close()

            cur_recipient = mysql.connection.cursor()
            cur_recipient.execute("SELECT username FROM user WHERE `public-key` = %s", [recepient_key])
            recipient_username = cur_recipient.fetchone()
            recipient_username = recipient_username[0] if recipient_username else 'Unknown Recipient'
            cur_recipient.close()

            cur_blockchain = mysql.connection.cursor()
            cur_blockchain.execute("SELECT id FROM blockchain WHERE FIND_IN_SET(%s, verified_transactions)", [signature])
            blockchain_id_row = cur_blockchain.fetchone()
            blockchain_id = blockchain_id_row[0] if blockchain_id_row else 'Not Found'
            cur_blockchain.close()

            transactions_dict = {
                'id': row[0],
                'sender': sender_username,
                'recepient': recipient_username,
                'value': row[3],
                'time': row[4],
                'signature': signature,
                'blockchain_id': blockchain_id
            }
            transactions_list.append(transactions_dict)
            row = cur.fetchone()
        cur.close()
        return jsonify(transactions_list)
    
@app.route('/transaction_details/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    if request.method == 'DELETE':
        logging.debug("id: ", id)
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM transactions WHERE id = %s", [id])
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'transaction deleted successfully'}), 200

@app.route('/blockchain', methods=['GET', 'POST'])
def fetch_blockchain():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, verified_transactions FROM blockchain")
        blockchain_list = []

        row = cur.fetchone()
        while row is not None:
            blockchain_id = row[0]
            verified_transactions = row[1]
            transactions_details = []

            if verified_transactions:
               
                cur2 = mysql.connection.cursor()
                cur2.execute("SELECT id FROM transactions WHERE FIND_IN_SET(signature, %s)", [verified_transactions])                
                transaction_row = cur2.fetchone()

                while transaction_row is not None:
                    transactions_details.append(transaction_row[0])
                    transaction_row = cur2.fetchone()
                
                cur2.close()

            blockchain_dict = {
                'id': blockchain_id,
                'verified_transactions': transactions_details
            }
            blockchain_list.append(blockchain_dict)
            row = cur.fetchone()

        cur.close()
        return jsonify(blockchain_list)
    
@app.route('/blockchain/<int:id>', methods=['DELETE'])
def delete_block(id):
    if request.method == 'DELETE':
        logging.debug("id: ", id)
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM blockchain WHERE id = %s", [id])
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'block deleted successfully'}), 200

######

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        print(request.json)

        username = request.json.get('username')
        session['username'] = username
        password = request.json.get('password')
        print(username, "         ", password, isinstance(username, str))
        
        if not username or not password:
            print("missing username or password")
            return jsonify({'error': 'Missing username or password'}), 400
        
        print('username and password exist')
        print("pre creation")
        cur = mysql.connection.cursor()
        print("cur created")
        cur.execute("SELECT * FROM user WHERE username = %s", [username])
        user = cur.fetchone()
        print("user is :",user)
        bpassword = password.encode('utf-8')
        bpassword = hashlib.sha1(bpassword).hexdigest()
        cur.close()
        if user:
            if bpassword == user[2]:  # user[2] is the password_hash column
                print("valid user")
                if check_imprint_validity(username):
                    print("valid")
                    session['username'] = user[1]  # user[1] is the username column
                    if username == "admin":
                        print("admin session")
                        return jsonify({'message':'admin session'})
                    print("the passed user is :",user[1])
                    
                    # Return JSON response with a flag indicating successful login
                    return jsonify({'message': 'Login successful', 'username': user[1]}), 200
                
                else:
                    ##
                    now = datetime.now() 
                    time = now.date()
                    create_empreinte(username, bpassword, time)
                    
                    return jsonify({'message': 'New Imprint Created'})                
                    ##

                    # print(user[2], "passed password is:", bpassword)
                    # print("invalid imprint")
                    # return jsonify({'error': 'Invalid user imprint, this user is not eligible to login. Please try with another user.'}), 401
            else:
                print("invalid2")
                #flash('Invalid user imprint, this user is not eligible to login. Please try again.', 'danger')
                return jsonify({'error': 'Invalid password'}), 403
        else:
            return jsonify({'error': 'This user does not exist.'}), 403
    return render_template('login.html')

@app.route('/transaction', methods=['POST'])
def transaction():
    print("entered /transaction")

    # Retrieve JSON data from the request
    transaction_data = request.get_json()

    # Ensure session and username are present
    

    sender_username = transaction_data.get('sender')
    recipient_username = transaction_data.get('recipient')
    value = transaction_data.get('value')

    if  not recipient_username or not value:
        return jsonify({'error': 'Missing required data (recipient, or value)'}), 400

    sender = get_client_by_username(sender_username)
    recipient = get_client_by_username(recipient_username)

    if not recipient:
        return jsonify({'error': 'Recipient not found in the database'}), 404

    if not sender:
        return jsonify({'error':'Sender not found in the database'}), 404
    
    if sender_username == recipient_username:
        return jsonify({'error' : 'You cant make this kind of transaction !!'}), 500

    # Create transaction object
    transaction = Transaction(sender, recipient, value)

    # Attempt to create the transaction in the database
    if create_database_transaction(transaction):
        pass_transaction(transaction)
        return jsonify({'message': 'Transaction created successfully'}), 200
    else:
        return jsonify({'error': 'Failed to create transaction : not enough balance'}), 500




@app.route('/face_recognition', methods=['GET', 'POST'])
def face_recognition():
    match = False
    print("entered face_recognition")
    if 'username' not in session:
        return jsonify({'error' : 'User not logged in'}), 401
    if request.method == 'GET':
        return render_template('face_recognition.html')
    elif request.method == 'POST':
        # Process the image data received from client-side
        image_data = request.json.get('image', None)

        if image_data:
            # Decode base64 image data
            _, encoded_image = image_data.split(",", 1)
            decoded_image = base64.b64decode(encoded_image)

            # Save the image temporarily (optional for testing)
            temp_image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'temp.jpg')
            with open(temp_image_path, 'wb') as f:
                f.write(decoded_image)

            # Perform face recognition
            try:
                result = DeepFace.verify(temp_image_path, 'test.jpg')
                match = result['verified']
            except ValueError:
                match = False

            return jsonify({'match': match})

    return jsonify({'match': False})

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

def check_face(frame, username):
    global face_match
    print("entered check_face")
    with app.app_context():
        try:
            cur = mysql.connection.cursor()
            cur.execute("SELECT image FROM user WHERE username = %s", [username])
            user_data = cur.fetchone()
            cur.close()

            if not user_data:
                print(f"No user found for username: {username}")
                face_match = False
                return jsonify({'error':f'No user found for username: {username}'})

            image_fetch = user_data[0]
            if not image_fetch:
                print(f"No image found for user: {username}")
                face_match = False
                return jsonify({'error':f"No image found for user: {username}"})

            image_path = os.path.join(UPLOAD_FOLDER, username, image_fetch)
            image = cv2.imread(image_path)

            if image is None:
                print(f"Failed to read image from path: {image_path}")
                face_match = False
                return jsonify({'error':f"Failed to read image from path: {image_path}"})

            result = DeepFace.verify(frame, image)
            print(f"fetched image : {image_fetch}")
            face_match = result['verified']
            print(f"face_match : {face_match}")
        except Exception as e:
            print(f"Error verifying face: {e}")
            return jsonify({'error':f"Error verifying face: {e}"})

def generate_frames(username):
    global face_match
    global counter
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if recognition_started and counter % 30 == 0:
            try:
                threading.Thread(target=functools.partial(check_face, frame.copy(), username)).start()
            except Exception as e:
                print(f"Error starting thread: {e}")
                return jsonify({'error':f"Error starting thread: {e}"})

        counter += 1

        if face_match:
            cv2.putText(frame, "MATCH!", (20, 450), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)
        else:
            cv2.putText(frame, "NO MATCH!", (20, 450), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        
@app.route('/video_feed')
def video_feed():
    if 'username' in session:
        username = session['username']
        return Response(generate_frames(username), mimetype='multipart/x-mixed-replace; boundary=frame')
    else:
        return jsonify({'error': 'User not logged in'}), 403

@app.route('/start_recognition', methods=['GET'])
def start_recognition():
    global recognition_started
    try:
        if not recognition_started:
            recognition_started = True
            return jsonify({'message': 'Recognition started'})
        else:
            return jsonify({'message': 'Recognition already started'})
    except Exception as e:
        print(f"Error in start_recognition route: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/stop_recognition', methods=['GET'])
def stop_recognition():
    global recognition_started, face_match
    try:
        recognition_started = False
        if face_match:
            print("face match true")
            return jsonify({'data': {'match': True}})
        else:
            print("face match false")
            return jsonify({'data': {'match': False}})
    except Exception as e:
        print(f"Error in stop_recognition route: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
