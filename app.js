const express = require('express')
const app = express()
const path = require('path')
const url = require('url')
const session = require('express-session')
const mongoose = require('mongoose')

//routers
const indexRoute = require('./routes/index')
const userRoute = require('./routes/mongoDB/user')
const subscribeRoute = require('./routes/subscribe')
const searchFlightRoute = require('./routes/searchFlight')
const dataRoute = require('./routes/data');


//template engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

//static files
app.use(express.static(path.join(__dirname, 'public')))

//json
app.use(express.json())

//url encoded for post requests
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/news')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Failed to connect to MongoDB', err));

// Session management
app.use(session({
  secret: 'your_secret_key', // Change this to a secure secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

//routing
app.get('/', indexRoute)
app.use('/user', userRoute)
app.post('/subscribe', subscribeRoute)
app.post('/search_flight', searchFlightRoute)
app.use('/data', dataRoute)

// Middleware - Static pages
app.use((req, res, next) => {
  try {
      // Render the requested page by extracting the pathname from the URL
      res.render(url.parse(req.url, true).pathname.substring(1), {userId: req.session.userId});
  } catch (error) {
      // Create a new error and pass it to the next middleware
      const err = new Error('Error rendering the page');
      err.status = 500;
      return next(err); // Forward to error-handling middleware
  }
});

//middleware - error handling
app.use((err, req, res, next) => {
  console.log('error called')
  // Set a default status code (e.g., 500 Internal Server Error if no specific status)
  const statusCode = err.status || 500;

  // Pass the status and error message to the Pug template
  res.status(statusCode).render('error', {
      title: `Error ${statusCode}`,
      statusCode: statusCode,
      message: err.message || 'Something went wrong. Please try again later.'
  });
});

const port = 3000
app.listen(port, ()=>{
  console.log(`Server is running @ http://localhost:${port}`)
})
