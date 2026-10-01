import bcrypt from 'bcrypt';
import db from './db.js'

/**
 * Creates a new user in the database, assigned to the default "user" role.
 * @param {string} name - The user's display name.
 * @param {string} email - The user's email address (used as the username).
 * @param {string} passwordHash - The already-hashed password to store.
 * @returns {string} The id of the newly created user record.
 */
const createUser = async (name, email, passwordHash) => {
    const defaultRole = 'user';
    const query = `
        INSERT INTO public.users (name, email, password_hash, role_id)
      VALUES ($1, $2, $3, (SELECT role_id FROM public.roles WHERE role_name = $4))
      RETURNING user_id;
    `;

    const queryParams = [name, email, passwordHash, defaultRole];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    return result.rows[0].user_id;
}

/**
 * Finds a user in the database by email address, including their role name.
 * @param {string} email - The email address to look up.
 * @returns {object|null} The matching user record (with role_name), or null if none is found.
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
      FROM public.users u
      JOIN public.roles r ON u.role_id = r.role_id
      WHERE u.email = $1;
    `;

    const queryParams = [email];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
}

/**
 * Checks a plain text password against a bcrypt hash.
 * @param {string} password - The plain text password to check.
 * @param {string} passwordHash - The stored bcrypt hash to compare against.
 * @returns {boolean} True if the password matches the hash, false otherwise.
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
}

/**
 * Authenticates a user by email and password.
 * @param {string} email - The email address to look up.
 * @param {string} password - The plain text password to verify.
 * @returns {object|null} The user object (without password_hash) if authentication succeeds, or null otherwise.
 */
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordIsValid = await verifyPassword(password, user.password_hash);

    if (!passwordIsValid) {
        return null;
    }

    // Don't carry the password hash around outside the model
    delete user.password_hash;

    return user;
}

export { createUser, authenticateUser }
