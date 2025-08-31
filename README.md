# Coastal Threat Alert System

A machine learning and cloud-enabled system to predict **coastal threats** such as **floods** and **cyclones**, and alert communities through an integrated backend service. This project combines **Flask-based ML microservices** with a **Node.js backend** for user management, alert reporting, and notifications.

---

## 🚀 Features

* **Flood & Cyclone Prediction** using trained ML models (Flask microservices).
* **User Authentication & Authorization** (JWT-based).
* **Alert Management** – create, update, and distribute coastal threat alerts.
* **Report System** – submit and manage reports of coastal incidents.
* **Notification Service** – send notifications to registered users.
* **Scalable Backend API** built with **Node.js + Express + MongoDB**.

---

## 🛠 Tech Stack

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

Backend will start on `http://localhost:5000`

### 3. Setup Flask ML Services

```bash
cd flask
pip install -r requirements.txt
python flood_server.py   # for flood prediction
python cyclone_server.py # for cyclone prediction
```

Flask services will run on respective ports (e.g., `5001`, `5002`).

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
