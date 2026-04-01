const LostItem = require('../models/LostItem');
const { uploadImage, deleteImage } = require('../utils/imageUpload');
const User = require('../models/User');

exports.reportLostItem = async (req, res) => {
  try {
    const {
      itemName,
      description,
      category,
      color,
      lostDate,
      lostTime,
      lostLocation,
      reward,
    } = req.body;

    console.log('=== REPORT LOST ITEM ===');
    console.log('received body:', req.body);
    console.log('user:', req.user);
    console.log('files:', req.files ? Object.keys(req.files) : 'no files');

    // Validate user
    if (!req.user || !req.user.id) {
      console.error('❌ User not authenticated or user.id missing');
      console.log('req.user:', req.user);
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validate required fields
    if (
      !itemName ||
      !description ||
      !category ||
      !lostDate ||
      !lostLocation
    ) {
      const missingFields = [];
      if (!itemName) missingFields.push('itemName');
      if (!description) missingFields.push('description');
      if (!category) missingFields.push('category');
      if (!lostDate) missingFields.push('lostDate');
      if (!lostLocation) missingFields.push('lostLocation');
      console.error('❌ Validation failed - missing fields:', missingFields);
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    console.log('✅ Validation passed');

    // Upload images if present
    const images = [];
    if (req.files && req.files.images) {
      console.log('Processing images...');
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (const file of imageFiles) {
        try {
          const imageData = await uploadImage(file, 'lost-items');
          images.push(imageData);
          console.log('✅ Image uploaded:', imageData.url);
        } catch (imageError) {
          console.error('⚠️ Image upload error:', imageError.message);
          // Continue without the image instead of failing
        }
      }
    }

    console.log('Creating lost item...');
    const lostItem = new LostItem({
      userId: req.user.id,
      itemName,
      description,
      category,
      color,
      lostDate: new Date(lostDate),
      lostTime,
      lostLocation,
      images,
      reward: reward || { offered: false },
    });

    console.log('Saving to database...');
    await lostItem.save();
    console.log('✅ Lost item saved:', lostItem._id);

    // Update user stats
    console.log('Updating user stats...');
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { lostItemsCount: 1 },
    });
    console.log('✅ User stats updated');

    res.status(201).json({
      message: 'Lost item reported successfully',
      lostItem,
    });
  } catch (error) {
    console.error('❌ REPORT LOST ITEM ERROR:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({ error: error.message });
  }
};

exports.getLostItems = async (req, res) => {
  try {
    const { category, location, status, searchTerm } = req.query;
    console.log('Getting lost items with filters:', {
      category,
      location,
      status,
      searchTerm,
    });
    
    const filter = {};

    if (category) filter.category = category;
    if (location) filter.lostLocation = new RegExp(location, 'i');
    if (status) filter.status = status;

    if (searchTerm) {
      filter.$or = [
        { itemName: new RegExp(searchTerm, 'i') },
        { description: new RegExp(searchTerm, 'i') },
      ];
    }

    const lostItems = await LostItem.find(filter)
      .populate('userId', 'name email phone reputation')
      .sort({ createdAt: -1 })
      .limit(50);

    console.log('Found lost items:', lostItems.length);
    res.json(lostItems);
  } catch (error) {
    console.error('Get lost items error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLostItemById = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id).populate(
      'userId',
      'name email phone reputation successfulReturns'
    );

    if (!lostItem) {
      return res.status(404).json({ error: 'Lost item not found' });
    }

    // Increment views
    await LostItem.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });

    res.json(lostItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLostItem = async (req, res) => {
  try {
    const { itemName, description, category, color, status } = req.body;

    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({ error: 'Lost item not found' });
    }

    if (lostItem.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Not authorized to update this item' });
    }

    // Update fields
    if (itemName) lostItem.itemName = itemName;
    if (description) lostItem.description = description;
    if (category) lostItem.category = category;
    if (color) lostItem.color = color;
    if (status) lostItem.status = status;

    await lostItem.save();

    res.json({
      message: 'Lost item updated successfully',
      lostItem,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({ error: 'Lost item not found' });
    }

    if (lostItem.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Not authorized to delete this item' });
    }

    // Delete images from Cloudinary
    for (const image of lostItem.images) {
      await deleteImage(image.publicId);
    }

    await LostItem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Lost item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsReceived = async (req, res) => {
  try {
    const { id } = req.params;

    const lostItem = await LostItem.findById(id);

    if (!lostItem) {
      return res.status(404).json({ error: 'Lost item not found' });
    }

    // Only the person who reported the item can mark it as received
    if (lostItem.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to confirm this item' });
    }

    // Update item status to "Matched"
    lostItem.status = 'Matched';
    await lostItem.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { successfulReturns: 1 },
    });

    res.json({
      message: 'Item marked as received successfully',
      lostItem,
    });
  } catch (error) {
    console.error('Mark as received error:', error);
    res.status(500).json({ error: error.message });
  }
};
