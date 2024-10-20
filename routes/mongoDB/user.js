const express = require('express');
const router = express.Router();
const User = require('../../models/User'); // Import the User model
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid');


router.post('/register', async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();    
    res.render('register_success', { first_name: req.body.first_name });
  } catch (error) {
    
      console.log(error.message)
      const err = new Error('Registration is not successful. Try after sometime!');
      err.status = 500;
      return next(err); // Forward to error-handling middleware  
  }
});

router.post('/login', async (req, res, next)=>{

  try{
    const user = await User.findOne({email: req.body.email})

    if(!user)
      res.render('login', {errorMessage: "Invalid email id"})
    
    if(user.password !== req.body.password)
      res.render('login', {errorMessage: "Invalid password"})

    req.session.userId = user.email
    req.session.user = user

    return res.redirect('/user/dashboard')
  }catch(error){
    
    console.log(error.message)
    const err = new Error('Login is not successful. Try after sometime!');
    err.status = 500;
    return next(err); // Forward to error-handling middleware
  
  }
})

router.get('/dashboard', (req, res)=>{

  if(!req.session.userId)
    return res.redirect('/login')

  res.render('user/dashboard', {user: req.session.user})
})

router.get('/profile', (req, res)=>{

  if(!req.session.userId)
    return res.redirect('/login')

  res.render('user/profile', {user: req.session.user})
})

router.get('/logout', (req, res)=>{

  req.session.destroy((error)=>{

    if(error){
      const err = new Error('Logout is not successful. Try after sometime!');
      err.status = 500;
      return next(err); // Forward to error-handling middleware
    }

    res.redirect('/login')
  })
})

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../public/uploads/profile_pics')); // Define your upload folder
  },
  filename: (req, file, cb) => {
      // Generate a unique identifier (UUID)
      const uniqueName = uuidv4(); // Generates a unique UUID
      // Use the unique identifier as the file name with the same extension as the uploaded file
      cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      
      if (mimetype && extname) {
          return cb(null, true);
      }
      cb(new Error('Error: File type not supported!'));
  }
});

router.put('/edit-profile-pic/:id', upload.single('profile_pic'), async (req, res) => {
  try {
      // Check if the file was uploaded
      if (!req.file) {
          return res.status(400).send('No file uploaded.');
      }

      // Update the user's profile picture in the database
      const user = await User.findByIdAndUpdate(req.params.id, {
          profile_pic: req.file.filename
      }, { new: true });

      if (!user) {
          return res.status(404).send('User not found.');
      }
      req.session.user = await User.findById(req.params.id)
      // Send back the uploaded file information
      res.json({
          message: 'Profile Picture has been uploaded successfully!',
          file: req.file
      });
  } catch (err) {
      res.status(500).send(err.message);
  }
});

router.put('/edit-personal-info/:id', async (req, res) => {
  try {
      
    // Update the user's profile picture in the database
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      console.log(req.body)
      if (!user) {
          return res.status(404).send('User not found.');
      }

      req.session.user = await User.findById(req.params.id)
      // Send back the uploaded file information
      res.json({
          message: 'Personal information has been successfully updated'         
      });
  } catch (err) {
      res.status(500).send(err.message);
  }
});
router.put('/edit-contact-info/:id', async (req, res) => {
  try {
      
    // Update the user's profile picture in the database
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (!user) {
          return res.status(404).send('User not found.');
      }

      req.session.user = await User.findById(req.params.id)
      // Send back the uploaded file information
      res.json({
          message: 'Contact information has been successfully updated'         
      });
  } catch (err) {
      res.status(500).send(err.message);
  }
});

router.delete('/delete-profile/:id', async (req, res)=>{
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) 
      return res.status(404).send('User not found.');
    
    await req.session.destroy((error)=>{

      if(error){
        const err = new Error('Logout is not successful. Try after sometime!');
        err.status = 500;
        return next(err); // Forward to error-handling middleware
      } 
      
    })    
    
    res.json({ message: 'User deleted successfully!' });
  }catch(err){
    res.status(500).send(err.message);
  }
})


module.exports = router;



