
-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


SELECT * FROM organization;


CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL
);

INSERT INTO service_projects (organization_id, title, description, location, project_date) VALUES
(1, 'Neighborhood Cleanup Day', 'Volunteers will collect litter and clear overgrowth along the riverside walking trail.', 'Riverside Trail, Warri', '2026-10-03'),
(1, 'Affordable Homes Build', 'Help frame and paint walls for a new affordable housing unit.', 'Oak Street Lot 4', '2026-10-17'),
(1, 'Weatherproofing Workshop', 'Teach and assist elderly homeowners with weatherproofing their homes for winter.', 'Community Center Hall', '2026-11-01'),
(1, 'Tool Library Sorting', 'Organize and catalog donated tools for the community tool-lending library.', 'BrightFuture Warehouse', '2026-11-14'),
(1, 'Ramp Building Day', 'Build wheelchair ramps for residents with mobility needs.', 'Maple Avenue', '2026-12-05'),

(2, 'Community Garden Planting', 'Plant vegetables and herbs in the shared community garden plots.', 'Greenview Community Garden', '2026-10-10'),
(2, 'Farmers Market Support', 'Help set up and run the weekly farmers market booth.', 'Downtown Market Square', '2026-10-24'),
(2, 'Composting Education Day', 'Teach local residents how to start home composting.', 'Greenview Community Garden', '2026-11-07'),
(2, 'Tree Planting Initiative', 'Plant native trees along the city park perimeter.', 'City Park North Entrance', '2026-11-21'),
(2, 'Seed Bank Sorting', 'Sort and package seeds for next season''s community seed bank giveaway.', 'GreenHarvest Office', '2026-12-12'),

(3, 'Winter Coat Drive', 'Collect and distribute donated winter coats to families in need.', 'UnityServe Community Hall', '2026-10-05'),
(3, 'Youth Mentorship Kickoff', 'Pair volunteer mentors with local youth for the fall mentorship program.', 'Lincoln Middle School', '2026-10-19'),
(3, 'Senior Center Game Night', 'Host a game and social night for residents at the senior center.', 'Sunrise Senior Center', '2026-11-02'),
(3, 'Food Pantry Restock', 'Sort and shelve donated food items at the community food pantry.', 'UnityServe Food Pantry', '2026-11-16'),
(3, 'Holiday Toy Drive', 'Collect, wrap, and distribute toys to families for the holidays.', 'UnityServe Community Hall', '2026-12-13');

SELECT sp.project_id, sp.title, sp.description, sp.location, sp.project_date, o.name AS organization_name
      FROM public.service_projects sp
      JOIN public.organization o ON sp.organization_id = o.organization_id
      ORDER BY sp.project_date;

-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name) VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- ========================================
-- Project-Category Join Table
-- ========================================
-- A project can belong to one or more categories, and a category can be
-- associated with one or more projects, so this many-to-many relationship
-- requires its own table. The composite primary key prevents the same
-- project/category pair from being inserted more than once.
CREATE TABLE project_category (
    project_id INTEGER NOT NULL REFERENCES service_projects(project_id),
    category_id INTEGER NOT NULL REFERENCES category(category_id),
    PRIMARY KEY (project_id, category_id)
);

-- ========================================
-- Insert sample data: Project-Category associations
-- ========================================
-- category_id reference: 1 = Environmental, 2 = Educational,
-- 3 = Community Service, 4 = Health and Wellness
INSERT INTO project_category (project_id, category_id) VALUES
(1, 1),  -- Neighborhood Cleanup Day: Environmental
(2, 3),  -- Affordable Homes Build: Community Service
(3, 3),  -- Weatherproofing Workshop: Community Service
(3, 4),  -- Weatherproofing Workshop: Health and Wellness
(4, 3),  -- Tool Library Sorting: Community Service
(5, 3),  -- Ramp Building Day: Community Service
(5, 4),  -- Ramp Building Day: Health and Wellness
(6, 1),  -- Community Garden Planting: Environmental
(6, 2),  -- Community Garden Planting: Educational
(7, 3),  -- Farmers Market Support: Community Service
(8, 1),  -- Composting Education Day: Environmental
(8, 2),  -- Composting Education Day: Educational
(9, 1),  -- Tree Planting Initiative: Environmental
(10, 1), -- Seed Bank Sorting: Environmental
(11, 3), -- Winter Coat Drive: Community Service
(11, 4), -- Winter Coat Drive: Health and Wellness
(12, 2), -- Youth Mentorship Kickoff: Educational
(13, 3), -- Senior Center Game Night: Community Service
(13, 4), -- Senior Center Game Night: Health and Wellness
(14, 3), -- Food Pantry Restock: Community Service
(14, 4), -- Food Pantry Restock: Health and Wellness
(15, 3); -- Holiday Toy Drive: Community Service

SELECT * FROM category;