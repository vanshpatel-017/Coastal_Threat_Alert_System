const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const notificationRoutes = require('./routes/notificationRoutes');
const { getReportsByCity, exportReportsCSV, exportReportsPDF } = require("./controllers/reportController");
const userRouter = require('./routes/userRoutes');
const alertRoutes = require('./routes/alert');
const predict = require('./routes/predict')
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.get('/', (req, res) => {
  res.send('Welcome to Hackout API: Code is Green');
});
app.use('/api', alertRoutes);

app.get("/search", getReportsByCity);
app.get("/export/csv", exportReportsCSV);
app.get("/export/pdf", exportReportsPDF);
app.use("/api/notifications", notificationRoutes);
app.use("/api/predict", predict);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('(CodeRed) MongoDB Error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('⚠️ Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
