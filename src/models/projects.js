import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT sp.project_id, sp.title, sp.description, sp.location, sp.project_date, o.name AS organization_name
      FROM public.service_projects sp
      JOIN public.organization o ON sp.organization_id = o.organization_id
      ORDER BY sp.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, organization_id, title, description, location, project_date
      FROM public.service_projects
      WHERE organization_id = $1
      ORDER BY project_date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

const getUpcomingProjects = async (numberOfProjects) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.description, sp.location, sp.project_date, sp.organization_id, o.name AS organization_name
      FROM public.service_projects sp
      JOIN public.organization o ON sp.organization_id = o.organization_id
      WHERE sp.project_date >= CURRENT_DATE
      ORDER BY sp.project_date ASC
      LIMIT $1;
    `;

    const queryParams = [numberOfProjects];
    const result = await db.query(query, queryParams);

    return result.rows;
}

const getProjectDetails = async (projectId) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.description, sp.location, sp.project_date, sp.organization_id, o.name AS organization_name
      FROM public.service_projects sp
      JOIN public.organization o ON sp.organization_id = o.organization_id
      WHERE sp.project_id = $1;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    // Return the first row of the result set, or null if no rows are found
    return result.rows.length > 0 ? result.rows[0] : null;
}

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.description, sp.location, sp.project_date, sp.organization_id, o.name AS organization_name
      FROM public.service_projects sp
      JOIN public.organization o ON sp.organization_id = o.organization_id
      JOIN public.project_category pc ON sp.project_id = pc.project_id
      WHERE pc.category_id = $1
      ORDER BY sp.project_date;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

/**
 * Creates a new service project in the database.
 * @param {string} title - The title of the project.
 * @param {string} description - A description of the project.
 * @param {string} location - The location of the project.
 * @param {string} date - The date of the project.
 * @param {string} organizationId - The id of the organization sponsoring the project.
 * @returns {string} The id of the newly created project record.
 */
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO public.service_projects (title, description, location, project_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    return result.rows[0].project_id;
}

/**
 * Updates an existing service project in the database.
 * @param {string} projectId - The id of the project to update.
 * @param {string} title - The title of the project.
 * @param {string} description - A description of the project.
 * @param {string} location - The location of the project.
 * @param {string} date - The date of the project.
 * @param {string} organizationId - The id of the organization sponsoring the project.
 * @returns {string} The id of the updated project record.
 */
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE public.service_projects
      SET title = $1, description = $2, location = $3, project_date = $4, organization_id = $5
      WHERE project_id = $6
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    return result.rows[0].project_id;
}

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getProjectsByCategoryId, createProject, updateProject }
