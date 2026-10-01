import bcrypt from 'bcrypt';

// Import any needed model functions
import { createUser, authenticateUser } from '../models/users.js';

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

const showLoginForm = (req, res) => {
    const title = 'Log In';

    res.render('login', { title });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);

    if (user) {
        // Store the authenticated user on the session
        req.session.user = user;

        req.flash('success', 'Login successful!');
        console.log('User logged in:', user);

        return res.redirect('/dashboard');
    }

    req.flash('error', 'Invalid email or password. Please try again.');
    res.redirect('/login');
};

const processLogout = (req, res) => {
    // Clear the authenticated user from the session rather than calling
    // req.session.destroy(): destroy() wipes the whole session - including
    // the flash message - before it ever reaches the login page, so the
    // "logged out" confirmation would silently never appear.
    delete req.session.user;

    req.flash('success', 'You have been logged out.');

    res.redirect('/login');
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const showDashboard = (req, res) => {
    const user = req.session.user;
    const title = 'Dashboard';

    res.render('dashboard', { title, name: user.name, email: user.email });
};

// Export any controller functions
export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard
};
