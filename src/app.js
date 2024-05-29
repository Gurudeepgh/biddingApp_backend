const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const morgan = require('morgan');
const cors = require('cors');
const { errorMiddleware } = require(__dirname + '/middlewares/errorMiddleware');
const authRoutes = require(__dirname + '/routes/authRoutes');
const userRoutes = require(__dirname + '/routes/userRoutes');
const itemRoutes = require(__dirname + '/routes/itemRoutes');
const bidRoutes = require(__dirname + '/routes/bidRoutes');
const notificationRoutes = require(__dirname + '/routes/notificationRoutes');
const socketService = require(__dirname + '/services/socketService');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorMiddleware);
app.get('/', (req, res) => {
  res.send('Hello World!')
})


socketService.initializeSocketIO(io);

const PORT = process.env.PORT || 3000;
// const isTest = process.env.NODE_ENV === 'test';
// if (isTest) {
//   PORT = 3001;
// }
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});