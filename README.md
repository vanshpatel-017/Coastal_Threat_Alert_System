# Coastal Threat Alert System

A machine learning and cloud-enabled system to predict **coastal threats** such as **floods** and **cyclones**, and alert communities through an integrated backend service. This project combines **Flask-based ML microservices**, a **Node.js backend**, and a **frontend interface** for user management, alert reporting, and notifications.

---

## 🚀 Features

* **Flood & Cyclone Prediction** using trained ML models (Flask microservices).
* **User Authentication & Authorization** (JWT-based).
* **Alert Management** – create, update, and distribute coastal threat alerts.
* **Report System** – submit and manage reports of coastal incidents.
* **Notification Service** – send notifications to registered users.
* **Frontend Dashboard** – view predictions, alerts, and reports.
* **Scalable Backend API** built with **Node.js + Express + MongoDB**.

---

## 🛠 Tech Stack

### Frontend

* **Vite + React** – User interface
* **TailwindCSS** – Styling

### Backend

* **Node.js** + **Express.js** – REST API server
* **MongoDB + Mongoose** – Database & ORM
* **JWT** – Authentication middleware

### Machine Learning (Flask Services)

* **Flask** – Model deployment
* **Scikit-learn** – Trained models for flood and cyclone prediction
* **Pickle (.pkl)** – Serialized ML models

### Other Tools

* **Git** & **GitHub** – Version control
* **Postman / cURL** – API testing

---

## 📂 Project Structure

```
Coastal_Threat_Alert_System-main/
│── backend/               # Node.js backend
│   ├── controllers/       # Business logic for alerts, auth, reports, notifications
│   ├── middlewares/       # Authentication middleware
│   ├── models/            # Mongoose models (User, Alert, Report)
│   ├── routes/            # API route definitions
│   ├── server.js          # Main Express server entry point
│   ├── package.json       # Node.js dependencies
│
│── flask/                 # Python Flask microservices for ML models
│   ├── cyclone_server.py  # Cyclone prediction service
│   ├── flood_server.py    # Flood risk prediction service
│   ├── inference_server.py# Model inference orchestrator
│   ├── *.pkl              # Trained ML models (cyclone, flood, scaler, etc.)
│   ├── requirements.txt   # Python dependencies
│
│── frontend/              # React + Vite frontend
│   ├── src/
│   ├── package.json
│
│── .gitignore
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/vanshpatel-017/Coastal_Threat_Alert_System.git
cd Coastal_Threat_Alert_System-main
```

### 2. Setup Backend (Node.js)

```bash
cd backend
npm install
npm start
```

Backend will start on `http://localhost:3001`

### 3. Setup Flask ML Services

```bash
cd flask
pip install -r requirements.txt
python flood_server.py   # for flood prediction (port 5000)
python cyclone_server.py # for cyclone prediction (port 6000)
```

Frontend will be available at: `http://localhost:5000` for flood and `http://localhost:6000` for cyclone 

### 4. Setup Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 🔌 API Endpoints

### User Authentication

* `POST /api/users/register` – Register a new user
* `POST /api/users/login` – Login and get JWT token

### Alerts

* `GET /api/alerts` – Get all alerts
* `POST /api/alerts` – Create a new alert

### Reports

* `GET /api/reports` – Get reports
* `POST /api/reports` – Submit new report

### Predictions (Flask ML Services)

* `POST http://localhost:5000/predict/flood` – Get flood risk prediction
  **Request Body:** `{ "rainfall": 200, "sea_level": 3.5, "wind_speed": 45 }`

* `POST http://localhost:6000/predict/cyclone` – Get cyclone prediction
  **Request Body:** `{ "pressure": 980, "wind_speed": 120 }`

---

## 📈 Future Improvements

* Integrate **real-time weather & sea-level APIs**.
* Deploy on **Docker/Kubernetes** for scalability.
* Add **mobile app frontend** for community alerts.
* Improve ML models with more training data.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request.

---

## 📜 License

This project is licensed under the **MIT License**.
