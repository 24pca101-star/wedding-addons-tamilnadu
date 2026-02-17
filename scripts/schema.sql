-- Create database if not exists (optional, usually provided by host)
-- CREATE DATABASE IF NOT EXISTS wedding_addons;
-- USE wedding_addons;

CREATE TABLE IF NOT EXISTS templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(255),
    template_path VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS saved_designs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    canvas_json LONGTEXT,
    preview_image LONGTEXT, -- Base64 string or path
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data (Adjust paths if necessary)
INSERT INTO templates (name, description, image_path, template_path) VALUES 
('Floral Pink', 'Soft pink floral themed traditional welcome banner.', '/card1.jpg', '/templates/design-1.psd'),
('Soft Blue', 'Elegant blue tone banner with subtle decorations.', '/card2.jpg', '/templates/design-2.psd'),
('Minimal White', 'Clean and modern white aesthetic banner.', '/design1.jpg', '/templates/design-3.psd'),
('Traditional Red', 'Classic red wedding style welcome banner.', '/design4.jpg', '/templates/design-4.psd');
