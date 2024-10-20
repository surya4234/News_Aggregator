const express = require('express');
const router = express.Router();
const axios = require('axios')

router.get('/', async (req, res, next) => {
    try {
        const response = await axios.get(`http://api.aviationstack.com/v1/airports`, {
            params: {
                access_key: "0af1b6ed18bf3960f589ba63f0417954",
            },
        });

        const airports = response.data.data.filter(airport => airport.country_iso2 == 'AU');
        res.render('index', { 
            airports,
            userId: req.session.userId
         });
    } catch (error) {
      
        try {
            const jsonUrl = `http://localhost:3000/data/airports`; // Replace with your local server URL
            const jsonResponse = await axios.get(jsonUrl);
            const airports = jsonResponse.data.data.filter(airport => airport.country_iso2 === 'IN');
            res.render('index', { 
                airports,
                userId: req.session.userId
            });
        } catch (fileError) {
            console.log(fileError)
            const err = new Error('Error reading user data or fetching local JSON file');
            err.status = 500;
            return next(err); // Forward to error-handling middleware        
        }    
    }
    

});

module.exports = router