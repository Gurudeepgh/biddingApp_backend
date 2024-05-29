const { Notification } = require('../models/notificationModel');
const { Item } = require('../models/itemModel');

let io;

const initializeSocketIO = (server) => {
  io = require('socket.io')(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    socket.on('bid', async ({ itemId, bidAmount, userId }) => {
      try {
        const item = await Item.findByPk(itemId);
        if (!item) {
          return;
        }

        if (bidAmount <= item.currentPrice) {
          socket.emit('error', 'Bid amount must be higher than the current price');
          return;
        }

        const newBid = await item.createBid({ userId, bidAmount });
        item.currentPrice = bidAmount;
        await item.save();

        io.emit('update', { itemId, bid: newBid });

        const notification = await Notification.create({
          userId: item.userId,
          message: `New bid of ${bidAmount} placed on your item ${item.name}`,
        });

        io.to(item.userId.toString()).emit('notify', notification);
      } catch (error) {
        console.error('Error placing bid:', error);
      }
    });
  });
};

const notifyBidUpdate = (itemId, bid) => {
  io.emit('update', { itemId, bid });
};

module.exports = { initializeSocketIO, notifyBidUpdate };