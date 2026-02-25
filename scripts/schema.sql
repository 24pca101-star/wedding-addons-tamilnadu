-- Create database if not exists (optional, usually provided by host)
-- CREATE DATABASE IF NOT EXISTS wedding_addons;
-- USE wedding_addons;

CREATE TABLE IF NOT EXISTS templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS saved_designs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    canvas_json LONGTEXT,
    preview_image LONGTEXT, -- Base64 string or path
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data (Adjust paths if necessary)
INSERT INTO templates (name, description, image_path) VALUES 
('Rose Gold Floral', 'Soft pink floral welcome banner with elegant rose gold accents, perfect for traditional weddings.', '/templates/design-1.jpg'),
('Winter Watercolor', 'Elegant winter wedding banner featuring deep blue watercolor textures and lush greenery.', '/templates/design-2.jpg'),
('Winter Photo Invitation', 'Modern winter-themed invitation with cool blue accents and a central photo placeholder.', '/templates/design-3.jpg'),
('Romantic Hearts', 'Peach-toned wedding banner adorned with romantic doves, golden bells, and floral corner details.', '/templates/design-4.jpg'),
('Premium Gold Photo', 'Luxury gold and white banner with elegant floral outlines and a central photo frame.', '/templates/design-5.jpg'),
('Artistic Yellow Floral', 'Artistic floral banner featuring bold yellow blossoms and refined typography.', '/templates/design-6.jpg');
