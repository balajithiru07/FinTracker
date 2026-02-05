const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Expense: MockExpense, Settings: MockSettings } = require('../mockDb');

// Helper to get the active model (Real vs Mock)
const getModel = (modelName) => {
    if (mongoose.connection.readyState === 1) {
        return require(`../models/${modelName}`);
    }
    return modelName === 'Expense' ? MockExpense : MockSettings;
};

// @desc    Get all expenses
// @route   GET /api/expenses
router.get('/', async (req, res) => {
    try {
        const Expense = getModel('Expense');
        const expenses = await Expense.find().sort({ date: -1 });
        res.json({ success: true, count: expenses.length, data: expenses });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
    try {
        const Expense = getModel('Expense');
        const expense = await Expense.findById(req.params.id); // This returns the object with deleteOne in our mock
        if (!expense) {
            return res.status(404).json({ success: false, error: 'No expense found' });
        }
        await expense.deleteOne();
        res.json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Add expense
// @route   POST /api/expenses
router.post('/', async (req, res) => {
    console.log('POST /api/expenses Request Body:', req.body); // DEBUG LOG
    try {
        const Expense = getModel('Expense');
        const expense = await Expense.create(req.body);
        console.log('Expense Created:', expense); // DEBUG LOG
        res.status(201).json({ success: true, data: expense });
    } catch (err) {
        console.error('Error adding expense:', err); // DEBUG LOG
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// ...

// @desc    Get Settings
// @route   GET /api/expenses/settings
router.get('/settings', async (req, res) => {
    try {
        const Settings = getModel('Settings');
        const settings = await Settings.findOne();
        res.json({ success: true, data: settings || { monthlyLimit: 0, dailyLimit: 0 } });
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Update Settings
// @route   POST /api/expenses/settings
router.post('/settings', async (req, res) => {
    console.log('POST /api/expenses/settings Request Body:', req.body); // DEBUG LOG
    try {
        const Settings = getModel('Settings');
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            settings.monthlyLimit = req.body.monthlyLimit;
            settings.dailyLimit = req.body.dailyLimit;
            await settings.save();
        }
        console.log('Settings Updated:', settings); // DEBUG LOG
        res.json({ success: true, data: settings });
    } catch (err) {
        console.error('Error updating settings:', err); // DEBUG LOG
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
