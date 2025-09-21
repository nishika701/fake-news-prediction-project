from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
vectorizer_path = os.path.join(BASE_DIR, "vectorizer.jb")
model_path = os.path.join(BASE_DIR, "lr_model.jb")

vectorizer = joblib.load(vectorizer_path)
model = joblib.load(model_path)

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    news_input = data.get("content", "").strip()
    if not news_input:
        return jsonify({"error": "No text provided"}), 400

    try:
        transform_input = vectorizer.transform([news_input])
        prediction = model.predict(transform_input)[0]
        result = "REAL" if prediction == 1 else "FAKE"
        return jsonify({"prediction": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=4500)