from http import client
import os
os.environ["USE_TF"] = "0"
import base64
from flask import Flask, request, jsonify
import numpy as np
import joblib
from sentence_transformers import SentenceTransformer
from flask_cors import CORS
import json
import traceback
from flask_pymongo import PyMongo
from datetime import datetime
from pymongo import MongoClient
import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("/etc/secrets/firebase-key.json")
firebase_admin.initialize_app(cred)


print("App is loading...")
# Flask app init
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, headers="Content-Type")

# ✅ MongoDB connection
app.config["MONGO_URI"] = "mongodb+srv://anugour1233:8SUoRLIwoSbf2GZo@cluster0.twtyzez.mongodb.net/VeriJobDB?retryWrites=true&w=majority"
mongo = PyMongo(app)

# Load model & encoders
model = joblib.load("bert_hybrid_model.pkl")
le_difficulty = joblib.load("le_difficulty.pkl")
le_contact = joblib.load("le_contact.pkl")
bert = SentenceTransformer("bert_model")  # Local BERT folder
bert.encode(["Hello world"])  # Warm-up to reduce first call latency


@app.route('/api/protected-route', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()  # Or with specific config
def protected_route():
    return jsonify({"message": "Success!"})

#Testing Database
@app.route("/test-db")
def test_db():
    mongo.db.predictions.insert_one({"message": "✅ MongoDB connected successfully!"})
    return "Inserted test message!"

# Testing
@app.route("/")
def home():
    return "✅ Fake Internship Detector API is running!"

# Token verifier
def verify_token():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    try:
        id_token = auth_header.split("Bearer ")[-1]
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print("Token verification error:", e)
        return None
    
# Saving History
@app.route("/history", methods=["GET"])
def get_history():
    uid = request.args.get("uid")
    if not uid:
        return jsonify({"error": "Missing UID"}), 400

    history_cursor = mongo.db.predictions.find({"uid": uid}).sort("timestamp", -1).limit(20)
    result = []
    for item in history_cursor:
        item["_id"] = str(item["_id"])  # Convert ObjectId to string
        result.append(item)
        
    return jsonify(result)


# Deleting History
@app.route('/delete_history', methods=['POST'])
def delete_history():
    data = request.get_json()
    uid = data.get('uid')
    timestamp = data.get('timestamp')

    print("🔍 Type of timestamp:", type(timestamp))
    print("📅 Value of timestamp:", timestamp)

    if not uid or not timestamp:
        return jsonify({"success": False, "message": "Missing uid or timestamp"}), 400

    try:
        # If it's already a datetime object, great. If it's a string, convert it
        if isinstance(timestamp, str):
            timestamp = datetime.fromisoformat(timestamp)

        db = mongo.db
        result = db.predictions.delete_one({
            "uid": uid,
            "timestamp": timestamp
        })

        if result.deleted_count == 1:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "message": "Entry not found"}), 404

    except Exception as e:
        print("❌ Error deleting history:")
        traceback.print_exc()
        return jsonify({"success": False, "message": str(e)}), 500


# Prediction
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)

        if not data or "structured" not in data or "text" not in data:
            return jsonify({"error": "Invalid input format"}), 400

        # Extract inputs
        uid = data["uid"]
        input_struct = data["structured"]
        input_text = data["text"]
        
        difficulty = input_struct.get("tasks_difficulty", "").lower()
        contact = input_struct.get("contact_mode", "").lower()

        # Fallback to known class in encoder if unknown
        difficulty = difficulty if difficulty in le_difficulty.classes_ else le_difficulty.classes_[0]
        contact = contact if contact in le_contact.classes_ else le_contact.classes_[0]

        difficulty_encoded = le_difficulty.transform([difficulty])[0]
        contact_encoded = le_contact.transform([contact])[0]
        
        

        # Encode structured data
        try:
            struct_vector = np.array([[
                input_struct.get("stipend", 0),
                int(input_struct.get("has_mentor", False)),
                difficulty_encoded,
                contact_encoded,
                int(input_struct.get("certificate_only", False)),
                int(input_struct.get("asks_for_money", False)),
                input_struct.get("red_flags", 0)
            ]])
        except Exception as e:
            return jsonify({"error": f"Error encoding structured data: {str(e)}"}), 400

        # Encode text
        full_text = input_text.get("description", "") + " " + input_text.get("offer_letter_text", "")
        text_vector = bert.encode([full_text], show_progress_bar=False)
        X = np.hstack([struct_vector, text_vector])

        # Predict
        pred = model.predict(X)[0]
        conf = model.predict_proba(X)[0][pred]

        result = {
            "prediction": "Real" if pred == 1 else "Fake",
            "confidence": round(conf * 100, 2)
        }

        # Optional: Save to history
        try:
            entry = {
                "input": data,
                "result": result
            }

            history = []
            if os.path.exists("history.json"):
                with open("history.json", "r") as f:
                    history = json.load(f)

            history.insert(0, entry)  # newest first
            with open("history.json", "w") as f:
                json.dump(history[:20], f, indent=2)  # keep only latest 20
        except Exception as e:
            print("Warning: Couldn't save to history:", str(e))
        
         # ✅ Save to MongoDB
        mongo.db.predictions.insert_one({
            "uid": uid,
            "input": data,
            "result": result,
            "timestamp": datetime.now()
        })

        return jsonify(result)

    except Exception as e:
        print(traceback.format_exc())  # Log full traceback for debugging
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
