const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Event Schema
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    type: { type: String, enum: ['workOrder', 'moveIn', 'reminder', 'note'] },
    allDay: { type: Boolean, default: false },
});

const Event = mongoose.model('Event', eventSchema);

// Get all events

router.get('/all', async (req, res) => {
    if (!req.session.isAdmin) {
        return res.redirect('/admin/login');
    }

    try {
        const events = await Event.find(); // Replace with your database query to fetch events

        res.render('layouts/main', {
            title: 'EventManager',
            currentPage: 'eventManager', // Set the current page for the sidebar
            adminName: req.session.adminName,
            body: '../admin/eventManager',
            events: JSON.stringify(events), // Pass events as JSON string
        });
    } catch (err) {
        console.error('Error fetching events:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

// Express route for getting events
router.get('/events', async (req, res) => {
    const { category } = req.query; // Get the filter category from query parameters
    try {
        const query = category ? { type: category } : {}; // Filter by category if provided
        const events = await Event.find(query);
        res.json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route to add a new event
router.post('/events', async (req, res) => {
    const { title, start, end, type, allDay } = req.body;
    const newEvent = new Event({
        title,
        start,
        end,
        type,
        allDay,
    });

    try {
        const savedEvent = await newEvent.save();
        res.json(savedEvent); // Send back the saved event data
    } catch (err) {
        console.error('Error saving event:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// router.get('/all', async (req, res) => {
//     try {
//         const events = await Event.find();
//         res.json(events);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// Create a new event
router.post('/', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an event
router.delete('/events/:id', async (req, res) => {
    console.log('DELETE request received for event ID:', req.params.id);

    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            console.error('Event not found:', req.params.id);
            return res.status(404).json({ error: 'Event not found' });
        }

        console.log('Event deleted successfully:', deletedEvent);
        res.status(200).send('Event deleted');
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
