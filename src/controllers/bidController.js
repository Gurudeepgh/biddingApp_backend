const { Bid } = require('../models/bidModel');
const { Item } = require('../models/itemModel');
const { ErrorResponse } = require('../utils/errorUtils');
const socketService = require('../services/socketService');

exports.getAllBidsForItem = async (req, res, next) => {
  const { itemId } = req.params;

  try {
    const bids = await Bid.findAll({ where: { itemId } });
    res.status(200).json(bids);
  } catch (error) {
    next(error);
  }
};

exports.placeBid = async (req, res, next) => {
  const { userId } = req;
  const { itemId } = req.params;
  const { bidAmount } = req.body;

  try {
    const item = await Item.findByPk(itemId);
    if (!item) {
      return next(new ErrorResponse('Item not found', 404));
    }

    if (bidAmount <= item.currentPrice) {
      return next(new ErrorResponse('Bid amount must be higher than the current price', 400));
    }

    const newBid = await Bid.create({ itemId, userId, bidAmount });
    item.currentPrice = bidAmount;
    await item.save();

    socketService.notifyBidUpdate(itemId, newBid);

    res.status(201).json(newBid);
  } catch (error) {
    next(error);
  }
};