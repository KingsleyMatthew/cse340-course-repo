import bcrypt from 'bcrypt';

// Import any needed model functions
import { createUser } from '../models/users.js';

// Define any controller functions
const showUserRegistrationForm = (req, res) => {
    const title = 'Register';

    res.render('register', { title });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        await createUser(name, email, passwordHash);

        // Set a success flash message and redirect to the home page
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

// Export any controller functions
export { showUserRegistrationForm, processUserRegistrationForm };
