const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/all', async (req, res) => {
    if (!req.session.isAdmin) {
        return res.redirect('/admin/login');
    }

    try {
        
        res.render('layouts/main', {
            title: 'EventManager',
            currentPage: 'reportManager', // Set the current page for the sidebar
            adminName: req.session.adminName,
            body: '../admin/reportManager'
        });
    } catch (err) {
        console.error('Error fetching events:', err.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
