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

export { createUser }
