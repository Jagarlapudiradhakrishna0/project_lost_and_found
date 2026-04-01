const FoundItem = require('../models/FoundItem');
const { uploadImage, deleteImage } = require('../utils/imageUpload');
const User = require('../models/User');

exports.reportFoundItem = async (req, res) => {
  try {
    const {
      itemName,
      description,
      category,
      color,
      foundDate,
      foundTime,
      foundLocation,
      isSafeWithMe,
    } = req.body;

    console.log('=== REPORT FOUND ITEM ===');
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
      !foundDate ||
      !foundLocation
    ) {
      const missingFields = [];
      if (!itemName) missingFields.push('itemName');
      if (!description) missingFields.push('description');
      if (!category) missingFields.push('category');
      if (!foundDate) missingFields.push('foundDate');
      if (!foundLocation) missingFields.push('foundLocation');
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
          const imageData = await uploadImage(file, 'found-items');
          images.push(imageData);
          console.log('✅ Image uploaded:', imageData.url);
        } catch (imageError) {
          console.error('⚠️ Image upload error:', imageError.message);
          // Continue without the image instead of failing
        }
      }
    }

    console.log('Creating found item...');
    const foundItem = new FoundItem({
      userId: req.user.id,
      itemName,
      description,
      category,
      color,
      foundDate: new Date(foundDate),
      foundTime,
      foundLocation,
      images,
      isSafeWithMe: isSafeWithMe !== undefined ? isSafeWithMe : true,
    });

    console.log('Saving to database...');
    await foundItem.save();
    console.log('✅ Found item saved:', foundItem._id);

    // Update user stats
    console.log('Updating user stats...');
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { foundItemsCount: 1 },
    });
    console.log('✅ User stats updated');

    res.status(201).json({
      message: 'Found item reported successfully',
      foundItem,
    });
  } catch (error) {
    console.error('❌ REPORT FOUND ITEM ERROR:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({ error: error.message });
  }
};

exports.getFoundItems = async (req, res) => {
  try {
    const { category, location, status, searchTerm } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (location) filter.foundLocation = new RegExp(location, 'i');
    if (status) filter.status = status;

    if (searchTerm) {
      filter.$or = [
        { itemName: new RegExp(searchTerm, 'i') },
        { description: new RegExp(searchTerm, 'i') },
      ];
    }

    const foundItems = await FoundItem.find(filter)
      .populate('userId', 'name email phone reputation')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(foundItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFoundItemById = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id).populate(
      'userId',
      'name email phone reputation successfulReturns'
    );

    if (!foundItem) {
      return res.status(404).json({ error: 'Found item not found' });
    }

    // Increment views
    await FoundItem.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });

    res.json(foundItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFoundItem = async (req, res) => {
  try {
    const { itemName, description, category, color, status, isSafeWithMe } =
      req.body;

    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({ error: 'Found item not found' });
    }

    if (foundItem.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Not authorized to update this item' });
    }

    // Update fields
    if (itemName) foundItem.itemName = itemName;
    if (description) foundItem.description = description;
    if (category) foundItem.category = category;
    if (color) foundItem.color = color;
    if (status) foundItem.status = status;
    if (isSafeWithMe !== undefined) foundItem.isSafeWithMe = isSafeWithMe;

    await foundItem.save();

    res.json({
      message: 'Found item updated successfully',
      foundItem,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({ error: 'Found item not found' });
    }

    if (foundItem.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Not authorized to delete this item' });
    }

    // Delete images from Cloudinary
    for (const image of foundItem.images) {
      await deleteImage(image.publicId);
    }

    await FoundItem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Found item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsReceived = async (req, res) => {
  try {
    const { id } = req.params;

    const foundItem = await FoundItem.findById(id);

    if (!foundItem) {
      return res.status(404).json({ error: 'Found item not found' });
    }

    // Only the person who reported finding the item can mark it as received by owner
    if (foundItem.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to confirm this item' });
    }

    // Update item status to "Matched"
    foundItem.status = 'Matched';
    await foundItem.save();

    // Update user stats
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { successfulMatches: 1 },
    });

    res.json({
      message: 'Item marked as received successfully',
      foundItem,
    });
  } catch (error) {
    console.error('Mark as received error:', error);
    res.status(500).json({ error: error.message });
  }
};
