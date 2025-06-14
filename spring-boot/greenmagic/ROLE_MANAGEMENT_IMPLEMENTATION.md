# Role Management Implementation - GreenMagic E-commerce

## Overview
This document outlines the implementation of role-based user management in the GreenMagic e-commerce platform. The system now supports three distinct user roles: **USER** (Customer), **VENDOR**, and **ADMIN**.

## Database Schema

### Roles Table
```sql
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `UK716hgxp60ym1lifrdgp67xt5k` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### Users Table (Updated)
```sql
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `google_email` varchar(100) DEFAULT NULL,
  `google_id` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKovh8xmu9ac27t18m56gri58i1` (`google_id`),
  UNIQUE KEY `UK9q63snka3mdh91as4io72espi` (`phone_number`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## Backend Implementation

### 1. Role Entity (`Role.java`)
- **Location**: `backend/src/main/java/org/sortoutinnovation/greenmagic/model/Role.java`
- **Features**:
  - JPA entity mapping to `roles` table
  - One-to-Many relationship with User entity
  - Validation annotations for role name

### 2. RoleRepository (`RoleRepository.java`)
- **Location**: `backend/src/main/java/org/sortoutinnovation/greenmagic/repository/RoleRepository.java`
- **Methods**:
  - `findByRoleName(String roleName)`: Find role by name
  - `existsByRoleName(String roleName)`: Check if role exists
  - `findAllOrderedByName()`: Get all roles ordered by name

### 3. RoleService (`RoleService.java`)
- **Location**: `backend/src/main/java/org/sortoutinnovation/greenmagic/service/RoleService.java`
- **Features**:
  - **Auto-initialization**: Creates default roles (USER, VENDOR, ADMIN) on application startup
  - **Role Management**: CRUD operations for roles
  - **Helper Methods**: Get specific roles (user, vendor, admin)

### 4. Updated UserService (`UserService.java`)
- **Changes**:
  - Added `RoleService` dependency injection
  - Updated `registerUser()` method to assign roles during registration
  - Uses `UserMapper.toEntity()` with role parameter

### 5. Updated UserRegistrationRequestDto
- **Location**: `backend/src/main/java/org/sortoutinnovation/greenmagic/dto/UserRegistrationRequestDto.java`
- **New Field**: 
  ```java
  @NotBlank(message = "Role is required")
  @Pattern(regexp = "^(USER|VENDOR)$", message = "Role must be either USER or VENDOR")
  private String role;
  ```

### 6. Updated UserController
- **Location**: `backend/src/main/java/org/sortoutinnovation/greenmagic/controller/UserController.java`
- **New Endpoint**: 
  ```java
  @GetMapping("/roles")
  public ResponseEntity<ApiResponseDto<List<Role>>> getAvailableRoles()
  ```
  - Returns USER and VENDOR roles (excludes ADMIN from public registration)

### 7. Database Initialization
- **Location**: `backend/src/main/resources/data.sql`
- **Content**: SQL script to initialize default roles
  ```sql
  INSERT IGNORE INTO roles (role_name) VALUES ('USER');
  INSERT IGNORE INTO roles (role_name) VALUES ('VENDOR');
  INSERT IGNORE INTO roles (role_name) VALUES ('ADMIN');
  ```

## Frontend Implementation

### 1. Updated Register Component (`Register.jsx`)
- **Location**: `frontend/src/pages/Register.jsx`
- **New Features**:
  - **Role Selection Field**: Dropdown to choose between Customer (USER) and Vendor (VENDOR)
  - **Role Fetching**: Fetches available roles from `/api/users/roles` endpoint
  - **Role Validation**: Ensures role is selected during registration
  - **User-Friendly Labels**: "Customer" for USER, "Vendor" for VENDOR
  - **Role Description**: Helpful text explaining each role type

### 2. Updated Register Styles (`Register.css`)
- **Location**: `frontend/src/pages/Register.css`
- **New Styles**:
  - Select dropdown styling consistent with input fields
  - Role description box with green theme
  - Focus states and error handling for select elements

### 3. Updated User Management (`UserManagement.jsx` & `UserManagement.css`)
- **Location**: `frontend/src/pages/UserManagement.jsx` and `frontend/src/pages/UserManagement.css`
- **Updates**:
  - Added VENDOR role badge styling (orange theme)
  - Updated `getRoleBadgeClass()` function to handle VENDOR role
  - Role badges now display: ADMIN (red), USER (blue), VENDOR (orange)

## Role Definitions

### 1. USER (Customer)
- **Purpose**: Browse and purchase eco-friendly products
- **Permissions**: 
  - View products and categories
  - Add items to cart and wishlist
  - Place orders and make payments
  - Write reviews and ratings
  - Manage personal profile and addresses

### 2. VENDOR
- **Purpose**: Sell sustainable products on the platform
- **Permissions**:
  - All USER permissions
  - Create and manage product listings
  - View and manage orders for their products
  - Access vendor dashboard and analytics
  - Manage inventory and pricing

### 3. ADMIN
- **Purpose**: Platform administration and management
- **Permissions**:
  - All USER and VENDOR permissions
  - User management (view, edit, delete users)
  - Role assignment and management
  - Platform configuration and settings
  - Access to all administrative features

## API Endpoints

### Role Management
- `GET /api/users/roles` - Get available roles for registration (excludes ADMIN)

### User Registration (Updated)
- `POST /api/users/register` - Register new user with role selection
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phoneNumber": "+1234567890",
    "role": "USER"
  }
  ```

## Security Considerations

1. **Role Validation**: Backend validates role selection against allowed values
2. **Admin Protection**: ADMIN role is not available for public registration
3. **Role-Based Access**: Security configuration restricts endpoints based on roles
4. **Data Integrity**: Foreign key constraints ensure referential integrity

## Installation & Setup

### Backend Setup
1. **Database**: Ensure MySQL database is running
2. **Auto-Initialization**: Roles are automatically created on application startup via `RoleService.@PostConstruct`
3. **Manual Initialization** (if needed): Run the SQL script from `data.sql`

### Frontend Setup
1. **Dependencies**: No additional dependencies required
2. **API Configuration**: Ensure backend API URL is correctly configured in services

## Testing the Implementation

### 1. Registration Flow
1. Navigate to `/register`
2. Fill in user details
3. Select account type (Customer/Vendor)
4. Submit registration
5. Verify role assignment in database and user management dashboard

### 2. User Management
1. Login as admin
2. Navigate to User Management (`/admin/users`)
3. Verify role badges display correctly
4. Check role-based filtering and statistics

### 3. Database Verification
```sql
-- Check roles table
SELECT * FROM roles;

-- Check users with roles
SELECT u.name, u.email, r.role_name 
FROM users u 
LEFT JOIN roles r ON u.role_id = r.role_id;
```

## Future Enhancements

1. **Role Permissions Matrix**: Detailed permission system for granular access control
2. **Role Hierarchy**: Implement role inheritance and hierarchical permissions
3. **Dynamic Role Creation**: Admin interface for creating custom roles
4. **Role-Based UI**: Conditional rendering based on user roles
5. **Audit Logging**: Track role changes and administrative actions

## Troubleshooting

### Common Issues

1. **Roles Not Created**: 
   - Check if `RoleService.@PostConstruct` is executing
   - Manually run `data.sql` script

2. **Registration Fails**:
   - Verify role validation in `UserRegistrationRequestDto`
   - Check if selected role exists in database

3. **Role Not Displaying**:
   - Verify `UserMapper.toResponseDto()` includes role mapping
   - Check frontend role badge CSS classes

### Database Queries for Debugging

```sql
-- Check if roles exist
SELECT * FROM roles;

-- Check users without roles
SELECT * FROM users WHERE role_id IS NULL;

-- Count users by role
SELECT r.role_name, COUNT(u.user_id) as user_count
FROM roles r
LEFT JOIN users u ON r.role_id = u.role_id
GROUP BY r.role_id, r.role_name;
```

## Conclusion

The role management system is now fully implemented with:
- ✅ Three-tier role system (USER, VENDOR, ADMIN)
- ✅ Database schema with proper relationships
- ✅ Backend services and API endpoints
- ✅ Frontend registration with role selection
- ✅ User management dashboard with role display
- ✅ Automatic role initialization
- ✅ Security and validation

The system provides a solid foundation for role-based access control and can be extended with additional features as needed. 