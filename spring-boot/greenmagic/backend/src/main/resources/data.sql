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