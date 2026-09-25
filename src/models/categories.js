import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_id, name
      FROM public.category;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, name
      FROM public.category
      WHERE category_id = $1;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    // Return the first row of the result set, or null if no rows are found
    return result.rows.length > 0 ? result.rows[0] : null;
}

const getCategoriesForProject = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
      FROM public.category c
      JOIN public.project_category pc ON c.category_id = pc.category_id
      WHERE pc.project_id = $1
      ORDER BY c.name;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO public.project_category (project_id, category_id)
      VALUES ($1, $2);
    `;

    const queryParams = [projectId, categoryId];
    await db.query(query, queryParams);
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // Remove any previous category assignments for this project
    const deleteQuery = `
        DELETE FROM public.project_category
      WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Assign each of the newly selected categories
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
}

export { getAllCategories, getCategoryDetails, getCategoriesForProject, updateCategoryAssignments }
