const Fir = require('../models/Fir');

// @desc    Register a new FIR
// @route   POST /api/firs
// @access  Private
exports.createFir = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const {
      policeStation,
      district,
      state,
      complainant,
      victim,
      incident
    } = req.body;

    const fir = await Fir.create({
      policeStation,
      district,
      state,
      complainant,
      victim,
      incident,
      userId: req.user.id
    });

    res.status(201).json(fir);
  } catch (error) {
    console.error('Error creating FIR:', error);
    // Send validation errors back to client for easier debugging
    if (error.name === 'ValidationError') {
      const details = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message || error.errors[key].kind || error.errors[key].path;
        return acc;
      }, {});
      return res.status(400).json({ message: 'Validation error creating FIR', errors: details });
    }

    // Generic server error
    res.status(500).json({ message: 'Server error creating FIR', error: error.message });
  }
};

// @desc    Get all FIRs (for Admin/Police) or User's FIRs (for Citizen)
// @route   GET /api/firs
// @access  Private
exports.getFirs = async (req, res) => {
  try {
    let firs;
    // Check if user is a Citizen or Police/Admin
    const userRole = req.user.userGroup;

    if (userRole === 'Citizen') {
      firs = await Fir.find({ userId: req.user.id }).sort({ createdAt: -1 });
    } else {
      // Admin/Police can see all FIRs
      firs = await Fir.find({}).sort({ createdAt: -1 });
    }

    res.status(200).json(firs);
  } catch (error) {
    console.error('Error fetching FIRs:', error);
    res.status(500).json({ message: 'Server error fetching FIRs' });
  }
};

// @desc    Get FIR by ID
// @route   GET /api/firs/:id
// @access  Private
exports.getFirById = async (req, res) => {
  try {
    const fir = await Fir.findById(req.params.id);

    if (!fir) {
      return res.status(404).json({ message: 'FIR not found' });
    }

    // Check authorization: Citizen can only view their own FIRs
    if (req.user.userGroup === 'Citizen' && fir.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this FIR' });
    }

    res.status(200).json(fir);
  } catch (error) {
    console.error('Error fetching FIR:', error);
    res.status(500).json({ message: 'Server error fetching FIR' });
  }
};
