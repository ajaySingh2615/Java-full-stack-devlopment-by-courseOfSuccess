-- Initialize default roles
INSERT INTO roles (role_name) VALUES ('USER') ON DUPLICATE KEY UPDATE role_name = role_name;
INSERT INTO roles (role_name) VALUES ('VENDOR') ON DUPLICATE KEY UPDATE role_name = role_name;
INSERT INTO roles (role_name) VALUES ('ADMIN') ON DUPLICATE KEY UPDATE role_name = role_name;

-- Create vendor_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS vendor_profiles (
  vendor_id INT NOT NULL AUTO_INCREMENT,
  user_id INT DEFAULT NULL,
  business_name VARCHAR(100) NOT NULL,
  gst_number VARCHAR(20) NOT NULL,
  business_phone VARCHAR(15) DEFAULT NULL,
  business_email VARCHAR(100) DEFAULT NULL,
  address TEXT NOT NULL,
  store_description TEXT,
  logo_url VARCHAR(255) DEFAULT NULL,
  status VARCHAR(20) NOT NULL,
  created_at DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (vendor_id),
  UNIQUE KEY UK_vendor_profiles_gst_number (gst_number),
  UNIQUE KEY UK_vendor_profiles_user_id (user_id),
  CONSTRAINT FK_vendor_profiles_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

-- Insert sample test data if not exists

-- Insert sample test user (vendor)
INSERT IGNORE INTO users (user_id, username, email, password, role_id) 
VALUES (999, 'testvendor', 'vendor@test.com', '$2a$12$example.hash.here', 2);

-- Insert sample categories (fixed structure - removed non-existent columns)
INSERT IGNORE INTO categories (category_id, name) 
VALUES 
(1, 'Vegetables'),
(2, 'Fruits'),
(3, 'Grains'),
(4, 'Dairy Products'),
(5, 'Pulses & Legumes'),
(6, 'Spices & Condiments');

-- Insert sample vendor profile
INSERT IGNORE INTO vendor_profiles (vendor_id, user_id, business_name, gst_number, business_phone, business_email, address, store_description, status, created_at)
VALUES (1, 999, 'Test Organic Farm', '27ABCDE1234F1Z5', '+91-9876543210', 'business@testfarm.com', '123 Farm Road, Village, State', 'Premium organic products', 'APPROVED', NOW());

-- Insert sample products
INSERT IGNORE INTO products (product_id, name, description, short_description, price, mrp, quantity, min_stock_alert, sku, url_slug, status, category_id, brand, image_url, meta_title, meta_description, created_by, created_at, updated_at)
VALUES 
(1, 'Organic Tomatoes', 'Fresh organic tomatoes grown without pesticides', 'Premium organic tomatoes', 120.00, 150.00, 50, 10, 'TEST-VEG-TOM-001', 'organic-tomatoes', 'ACTIVE', 1, 'Test Farm', '/images/tomatoes.jpg', 'Organic Tomatoes', 'Fresh organic tomatoes description', 999, NOW(), NOW()),
(2, 'Fresh Spinach', 'Nutrient-rich organic spinach leaves', 'Organic spinach bunch', 40.00, 50.00, 30, 5, 'TEST-VEG-SPI-002', 'fresh-spinach', 'ACTIVE', 1, 'Test Farm', '/images/spinach.jpg', 'Fresh Organic Spinach', 'Fresh spinach leaves description', 999, NOW(), NOW()),
(3, 'Sweet Oranges', 'Juicy sweet oranges from organic farms', 'Sweet oranges per kg', 80.00, 100.00, 25, 5, 'TEST-FRU-ORA-003', 'sweet-oranges', 'ACTIVE', 2, 'Test Farm', '/images/oranges.jpg', 'Sweet Oranges', 'Juicy sweet oranges description', 999, NOW(), NOW()),
(4, 'Organic Rice', 'Premium basmati rice from organic farms', 'Organic basmati rice', 180.00, 220.00, 15, 3, 'TEST-GRA-RIC-004', 'organic-rice', 'ACTIVE', 3, 'Test Farm', '/images/rice.jpg', 'Organic Basmati Rice', 'Premium organic rice description', 999, NOW(), NOW()),
(5, 'Draft Product', 'This is a draft product for testing', 'Draft product example', 50.00, 60.00, 0, 2, 'TEST-DRA-PRO-005', 'draft-product', 'DRAFT', 1, 'Test Farm', '/images/draft.jpg', 'Draft Product', 'Draft product for testing', 999, NOW(), NOW()); 