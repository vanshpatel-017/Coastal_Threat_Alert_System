from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

model = joblib.load('best_flood_model.pkl')
means = np.array([0.0749885, 178.7099, 101023.7, 25.0239, 15.0178, 0.2521, 180.333, 25.0447, 14.9969])
stds = np.array([52.2648, 104.0387, 1435.5080, 14.4539, 8.6262, 91.8845, 104.3671, 6.3923, 3.9055])

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.json
        df = pd.DataFrame(input_data)

        required_features = [
            'latitude',
            'longitude',
            'msl',
            'temperature',
            'wind_speed',
            'msl_norm',  # Include all features your model expects
            'feature7',  # replace with actual names per order
            'feature8',
            'feature9',
        ]

        missing_cols = [col for col in required_features if col not in df.columns]
        if missing_cols:
            return jsonify({'error': f'Missing required features: {missing_cols}'}), 400

        X_raw = df[required_features].values  # get raw feature values

        X_norm = (X_raw - means) / stds       # normalize input based on saved stats

        preds = model.predict(X_norm)         # predict on normalized input
        preds = preds.tolist()

        return jsonify({'predictions': preds})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
