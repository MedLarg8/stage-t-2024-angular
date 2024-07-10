import datetime
import hashlib
import json
from flask import Flask, jsonify
from flask_mysqldb import MySQL
from tuto import Block


class BlockChain:

    def __init__(self):
        self.chain = []
        self.create_block(proof = 1, previous_hash = '0')



    def create_block(self, proof, previous_hash):
        block = {
            'index' : len(self.chain)+1,
            'timestamp' : str(datetime.datetime.now()),
            'proof' : proof,
            'previous_hash' : previous_hash}
        self.chain.append(block)
        return block
    
    def print_previous_block(self):
        return self.chain[-1]
    

    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False

        while check_proof is False:
            #generating a hashcode for the difference between the 2 proofs (current block and previous block)
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()

            if hash_operation[:5] == '00000':
                check_proof = True
            else:
                new_proof+=1
            
        return new_proof
    

    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()
    
    def chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1

        while block_index < len(chain):
            block = chain[block_index]
            if block['previous_hash']!= self.hash(previous_block):
                return False
            
            previous_proof = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()

            if hash_operation[:5] != '00000':
                return False

            previous_block = block
            block_index+=1
        
        return True
    

if __name__ =="__main__":
    UPLOAD_FOLDER = "static"

    app = Flask(__name__)
    #app.secret_key = 'secret-key'
    #testing commit
    # MySQL Config
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = ''
    app.config['MYSQL_DB'] = 'facial_recognition_table'  
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    mysql = MySQL(app)
    with app.app_context():
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM blockchain where id = 31")
        resultat = cur.fetchone()
        verified_transaction = resultat[1]
        previous_block_hash = resultat[2]
        nonce = resultat[3]
        block = Block()
        block.verified_transaction = verified_transaction
        block.previous_block_hash = previous_block_hash
        block.Nonce = nonce
        print(block)
        print(hash(block))
        
