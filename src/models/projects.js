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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId }
