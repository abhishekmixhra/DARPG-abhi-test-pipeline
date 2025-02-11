const express = require('express');
const router = express.Router();
const Category = require('../../models/admin/Category'); // Adjust path as necessary
const Ministry = require('../../models/admin/Ministry'); // Adjust path as necessary
const auth = require('../../middleware/auth'); // Middleware for authentication
router.use(express.json());
// Route to get categories along with ministry info
router.post('/getCategoryWithMinistry', async (req, res) => {
    try {
        const { category_name } = req.body; // Extract input from the raw JSON body

        // Log the received input for debugging
        console.log('Received Input Parameters:', req.body);

        // Build the aggregation pipeline
        const pipeline = [
            {
                $lookup: {
                    from: 'ministries', // Ministry collection
                    localField: 'm_id', // Field in the Category collection
                    foreignField: 'm_id', // Field in the Ministry collection
                    as: 'ministryInfo' // Alias for the joined data
                }
            },
            {
                $unwind: {
                    path: '$ministryInfo', // Unwind the joined ministry data
                    preserveNullAndEmptyArrays: true // Include documents without matching ministries
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the first-level _id field
                    categoryDetails: {
                        $mergeObjects: [
                            '$$ROOT', // Include all fields from the category
                            { ministryInfo: '$ministryInfo' } // Add ministryInfo as a subfield
                        ]
                    }
                }
            }
        ];

        // Add filter to the pipeline if the `category_name` input is provided
        if (category_name) {
            console.log(`Applying filter for category_name: ${category_name.trim()}`);
            pipeline.unshift({
                $match: {
                    category_name: { $regex: category_name.trim(), $options: 'i' } // Case-insensitive filter
                }
            });
        }

        // Log the constructed pipeline for debugging
        console.log('Constructed Aggregation Pipeline:', JSON.stringify(pipeline, null, 2));

        // Execute the aggregation pipeline
        const results = await Category.aggregate(pipeline);

        // Log the retrieved results
        console.log('Query Results:', results);

        // If no data found, send a 404 response
        if (!results.length) {
            console.warn('No matching data found.');
            return res.status(404).json({
                status: false,
                message: 'No data found matching the criteria.',
                data: []
            });
        }

        // Respond with the retrieved data
        res.status(200).json({
            status: true,
            message: 'Data retrieved successfully.',
            data: results
        });

    } catch (error) {
        // Log the error details
        console.error('Error fetching data:', error.message || error);

        // Respond with a server error
        res.status(500).json({
            status: false,
            message: 'Server error occurred.',
            error: error.message || error
        });
    }
});



router.get('/getCategories', async (req, res) => {
    try {
        const { category_name } = req.query;

        // Initialize an empty query object
        const query = {};

        // Add a case-insensitive regex filter if category_name is provided
        if (category_name) {
            query.category_name = { $regex: category_name, $options: 'i' };
        }

        console.log('Query Object:', query); // Debugging purposes

        // Fetch categories matching the query
        const categories = await Category.find(query);

        // Check if categories are found
        if (categories.length === 0) {
            return res.status(404).json({
                message: 'No categories found matching the filter criteria.',
                categories: [],
            });
        }

        res.status(200).json({
            message: 'Categories retrieved successfully.',
            categories,
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            message: 'An error occurred while fetching categories.',
            error: error.message,
        });
    }
});

module.exports = router;
