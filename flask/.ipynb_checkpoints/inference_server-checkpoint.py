from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load saved model pipeline
model = joblib.load('flood_risk_classifier.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Expect JSON array of objects with features like in training
        input_data = request.json
        df = pd.DataFrame(input_data)

        # Predict (returns 1 for normal, -1 for anomaly)
        preds = model.predict(df)
        preds = preds.tolist()
        return jsonify({'predictions': preds})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
