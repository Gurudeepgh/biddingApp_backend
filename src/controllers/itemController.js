const { Item } = require('../models/itemModel');
const { ErrorResponse } = require('../utils/errorUtils');
const { uploadImage } = require('../utils/uploadUtils');

exports.getAllItems = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const { count, rows } = await Item.findAndCountAll({
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });

    res.status(200).json({
      items: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    next(error);
  }
};

exports.getItemById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const item = await Item.findByPk(id);
    if (!item) {
      return next(new ErrorResponse('Item not found', 404));
    }

    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

exports.createItem = async (req, res, next) => {
  const { userId, role } = req;
  const { name, description, startingPrice, endTime } = req.body;

  try {
    if (role !== 'admin') {
      return next(new ErrorResponse('Forbidden', 403));
    }

    const imageUrl = req.file ? await uploadImage(req.file) : null;

    const newItem = await Item.create({
      name,
      description,
      startingPrice,
      currentPrice: startingPrice,
      imageUrl,
      endTime,
    });

    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
    const { userId, role } = req;
    const { id } = req.params;
    const { name, description, startingPrice, endTime } = req.body;
  
    try {
      const item = await Item.findByPk(id);
      if (!item) {
        return next(new ErrorResponse('Item not found', 404));
      }
  
      if (role !== 'admin' && item.userId !== userId) {
        return next(new ErrorResponse('Forbidden', 403));
      }
  
      let imageUrl = item.imageUrl;
      if (req.file) {
        imageUrl = await uploadImage(req.file);
      }
  
      const updatedItem = await item.update({
        name,
        description,
        startingPrice,
        imageUrl,
        endTime,
      });
  
      res.status(200).json(updatedItem);
    } catch (error) {
      next(error);
    }
  };
  
  exports.deleteItem = async (req, res, next) => {
    const { userId, role } = req;
    const { id } = req.params;
  
    try {
      const item = await Item.findByPk(id);
      if (!item) {
        return next(new ErrorResponse('Item not found', 404));
      }
  
      if (role !== 'admin' && item.userId !== userId) {
        return next(new ErrorResponse('Forbidden', 403));
      }
  
      await item.destroy();
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      next(error);
    }
  };