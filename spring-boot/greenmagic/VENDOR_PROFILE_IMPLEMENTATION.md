# Vendor Profile Implementation - GreenMagic E-commerce

## Overview
This document outlines the implementation of vendor functionality in the GreenMagic e-commerce platform. The system now supports a separate vendor profile entity linked to users with the VENDOR role.

## Architecture Design

### Entity Relationships
```
User (1) <----> (0..1) VendorProfile
```
- One-to-One relationship between User and VendorProfile
- Each vendor must have a User account with VENDOR role
- Vendor profiles require admin approval (PENDING → APPROVED/REJECTED)

## Database Schema

### Vendor Profiles Table
```sql
CREATE TABLE `vendor_profiles` (
  `vendor_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `business_name` varchar(100) NOT NULL,
  `gst_number` varchar(20) NOT NULL,
  `business_phone` varchar(15) DEFAULT NULL,
  `business_email` varchar(100) DEFAULT NULL,
  `address` text NOT NULL,
  `store_description` text,
  `logo_url` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`vendor_id`),
  UNIQUE KEY `UK_vendor_profiles_gst_number` (`gst_number`),
  UNIQUE KEY `UK_vendor_profiles_user_id` (`user_id`),
  CONSTRAINT `FK_vendor_profiles_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
)
```

## Implementation Components

### 1. Entity Classes
- **VendorProfile**: JPA entity representing vendor business details
  - Contains business information, contact details, and approval status
  - Linked to User via OneToOne relationship
  - Includes VendorStatus enum (PENDING, APPROVED, REJECTED)

### 2. DTO Classes
- **VendorProfileCreateRequestDto**: For creating/updating vendor profiles
- **VendorProfileResponseDto**: For returning vendor profile data to clients

### 3. Repository
- **VendorProfileRepository**: JPA repository for vendor profile CRUD operations
  - Includes methods for finding profiles by status, user, etc.
  - Contains custom queries for vendor management

### 4. Service Layer
- **VendorProfileService**: Business logic for vendor profile management
  - Profile creation with validation
  - Status management (approval/rejection)
  - Query methods for admin dashboard

### 5. Controllers
- **VendorProfileController**: REST endpoints for vendor profile operations
  - Profile creation and updates
  - Admin approval workflow
  - Status filtering and statistics

### 6. Security Configuration
- Updated to restrict vendor management endpoints to appropriate roles
- Public endpoints for vendor registration
- Protected endpoints for profile management
- Admin-only endpoints for approval and statistics

## Registration Flow

### Current Flow (Normal User)
1. User registers with basic information
2. System assigns USER role
3. User can immediately access customer features

### New Vendor Registration Flow
1. User registers normally with basic account details
2. User selects "VENDOR" role during registration
3. User creates a vendor profile with business details
4. Vendor profile status is set to "PENDING"
5. Admin reviews and approves/rejects the vendor profile
6. If approved, vendor can access seller features

## Admin Vendor Management

### 1. Vendor Approval Dashboard
- List of pending vendor profiles
- Business details verification
- Approve/Reject actions
- Notification system

### 2. Vendor Statistics
- Count of vendors by status
- Recent registrations
- Active/inactive vendors

## API Endpoints

### Vendor Profile Creation
- `POST /vendors/users/{userId}` - Create vendor profile for existing user
  ```json
  {
    "businessName": "Green Farms Inc.",
    "gstNumber": "29GGGGG1314R9Z6",
    "businessPhone": "+917788990011",
    "businessEmail": "business@greenfarms.com",
    "address": "123 Green Street, Eco City",
    "storeDescription": "Organic produce direct from farm"
  }
  ```

### Profile Management
- `GET /vendors/{vendorId}` - Get vendor profile by ID
- `GET /vendors/users/{userId}` - Get vendor profile by user ID
- `GET /vendors/users/{userId}/exists` - Check if vendor profile exists
- `PUT /vendors/{vendorId}` - Update vendor profile

### Admin Endpoints
- `GET /vendors` - Get all vendor profiles (paginated)
- `GET /vendors/status/{status}` - Get vendor profiles by status
- `GET /vendors/pending` - Get all pending vendor profiles
- `PUT /vendors/{vendorId}/status/{status}` - Update vendor status
- `GET /vendors/stats/counts` - Get vendor profile counts by status

## Security Considerations

### 1. GST Number Validation
- Regular expression validation for GST number format
- Uniqueness validation to prevent duplicate registrations

### 2. Authorization Controls
- Only ADMIN users can approve/reject vendor profiles
- Vendors can only access their own profile
- Role-based access control for all vendor endpoints

### 3. Data Protection
- Business information is protected with appropriate access controls
- Sensitive vendor details (GST, business contacts) are validated and secured

## Future Enhancements

1. **Verification Process**
   - Document upload for business verification
   - Multi-step approval workflow
   - Automated verification checks

2. **Vendor Dashboard**
   - Sales analytics
   - Inventory management
   - Order fulfillment tools

3. **Vendor Rating System**
   - Customer feedback for vendor quality
   - Performance metrics
   - Rating-based visibility

4. **Commission Structure**
   - Configurable commission rates
   - Payment settlement process
   - Financial reporting

## Implementation Notes

### Database Migration
- Execute the provided SQL scripts to create the vendor_profiles table
- Existing vendor users will need to create profiles separately

### Testing
- Unit tests for validation logic
- Integration tests for approval workflow
- Security tests for authorization controls

### Deployment
- Requires database migration for new table
- No downtime required for implementation 