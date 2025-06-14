# 👥 User Management Dashboard - GreenMagic E-commerce

## Overview

A comprehensive user management system built for the GreenMagic e-commerce platform with React frontend and Spring Boot backend. This system provides full CRUD operations, role-based access control, and professional admin dashboard functionality.

## 🚀 Features Implemented

### 📊 Dashboard Overview
- **User Statistics Cards**: Total users, active users, inactive users, administrators
- **Real-time Data**: Live user counts and status information
- **Professional UI**: Modern, responsive design with gradient backgrounds and animations

### 👤 User Management Operations

#### 2.1 Get All Users (Paginated) 🔒
- **Endpoint**: `GET /api/users?page=0&size=10`
- **Features**: 
  - Server-side pagination (configurable page sizes: 5, 10, 25, 50)
  - Responsive table with user avatars, contact info, roles, and status
  - Loading states and error handling

#### 2.2 Get User by ID 🔒
- **Endpoint**: `GET /api/users/{id}`
- **Features**: Individual user lookup with detailed information display

#### 2.3 Get User by Email 🔒
- **Endpoint**: `GET /api/users/email/{email}`
- **Features**: Email-based user search functionality

#### 2.4 Get Active Users 🔒
- **Endpoint**: `GET /api/users/active`
- **Features**: Filter and display only active users

#### 2.5 Update User Profile 🔒
- **Endpoint**: `PUT /api/users/{id}`
- **Features**: 
  - Full profile editing with validation
  - Role management (USER/ADMIN)
  - Optional password updates

#### 2.6 Delete User 🔒 (ADMIN ONLY)
- **Endpoint**: `DELETE /api/users/{id}`
- **Features**: 
  - Admin-only access control
  - Confirmation modal for safety
  - Prevents self-deletion

### 🔐 Password Management

#### 3.1 Change Password 🔒
- **Endpoint**: `PUT /api/auth/users/{id}/password`
- **Features**:
  - Current password verification
  - Strong password validation
  - Password strength indicator
  - Confirmation matching

#### 3.2 Admin Reset Password 🔒 (ADMIN ONLY)
- **Endpoint**: `PUT /api/auth/admin/users/{id}/reset-password`
- **Features**:
  - Admin bypass of current password
  - Administrative password reset
  - Security warnings and confirmations

## 🎨 UI/UX Features

### Professional Dashboard Design
- **Modern Layout**: Clean, card-based design with proper spacing
- **Color Scheme**: Professional gradients and consistent branding
- **Typography**: Clear hierarchy with proper font weights and sizes
- **Icons**: Lucide React icons for consistent visual language

### Interactive Elements
- **Search Functionality**: Real-time user search by name or email
- **Pagination Controls**: Intuitive navigation with page numbers
- **Action Buttons**: Color-coded actions (view, edit, password, delete)
- **Modal System**: Professional modal dialogs for user operations

### Responsive Design
- **Mobile-First**: Fully responsive across all device sizes
- **Touch-Friendly**: Appropriate button sizes and spacing
- **Adaptive Layout**: Grid systems that adjust to screen size
- **Mobile Menu**: Collapsible navigation for smaller screens

## 🔧 Technical Implementation

### Frontend Architecture
```
frontend/src/
├── pages/
│   └── UserManagement.jsx          # Main dashboard component
├── services/
│   └── userService.js              # API service layer
├── components/
│   └── modals/
│       ├── UserModal.jsx           # User CRUD modal
│       ├── PasswordModal.jsx       # Password management modal
│       └── ConfirmModal.jsx        # Confirmation dialogs
└── styles/
    ├── UserManagement.css          # Dashboard styling
    ├── UserModal.css               # Modal styling
    ├── PasswordModal.css           # Password modal styling
    └── ConfirmModal.css            # Confirmation modal styling
```

### Backend Integration
- **Spring Boot REST API**: Full integration with existing backend
- **Authentication**: JWT token-based authentication
- **Authorization**: Role-based access control (USER/ADMIN)
- **Validation**: Server-side validation with proper error handling

### State Management
- **React Hooks**: useState, useEffect for local state
- **Context API**: AuthContext for global authentication state
- **Error Handling**: Comprehensive error states and user feedback

## 🛡️ Security Features

### Access Control
- **Role-Based Permissions**: Different access levels for USER and ADMIN
- **Route Protection**: Admin-only routes and components
- **Action Restrictions**: Users can only edit their own profiles

### Data Validation
- **Frontend Validation**: Real-time form validation
- **Backend Validation**: Server-side validation and sanitization
- **Password Security**: Strong password requirements and hashing

### Security Best Practices
- **CSRF Protection**: Proper token handling
- **Input Sanitization**: XSS prevention
- **Secure Headers**: Proper HTTP security headers

## 📱 User Experience

### Navigation
- **Admin Menu**: User Management link in admin dropdown
- **Breadcrumbs**: Clear navigation hierarchy
- **Quick Actions**: Easy access to common operations

### Feedback Systems
- **Loading States**: Visual feedback during operations
- **Success Messages**: Confirmation of successful actions
- **Error Handling**: Clear error messages and recovery options
- **Progress Indicators**: Visual progress for multi-step operations

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Proper focus handling in modals

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Java 11+ and Maven
- Spring Boot backend running on port 8080

### Installation
1. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Access the Dashboard
1. Login as an admin user
2. Navigate to the user menu dropdown
3. Click "User Management"
4. Access the dashboard at `/admin/users`

## 🔗 API Endpoints Summary

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/users?page=0&size=10` | Get paginated users | ✅ | ❌ |
| GET | `/api/users/{id}` | Get user by ID | ✅ | ❌ |
| GET | `/api/users/email/{email}` | Get user by email | ✅ | ❌ |
| GET | `/api/users/active` | Get active users | ✅ | ❌ |
| PUT | `/api/users/{id}` | Update user profile | ✅ | ❌* |
| DELETE | `/api/users/{id}` | Delete user | ✅ | ✅ |
| PUT | `/api/auth/users/{id}/password` | Change password | ✅ | ❌* |
| PUT | `/api/auth/admin/users/{id}/reset-password` | Admin reset password | ✅ | ✅ |

*Users can only modify their own data unless they are admin

## 🎯 Future Enhancements

### Planned Features
- **Advanced Filtering**: Filter by role, status, registration date
- **Bulk Operations**: Select multiple users for bulk actions
- **Export Functionality**: Export user data to CSV/Excel
- **User Activity Logs**: Track user actions and login history
- **Email Notifications**: Automated emails for password resets
- **Advanced Search**: Full-text search with filters

### Performance Optimizations
- **Virtual Scrolling**: For large user lists
- **Caching**: Client-side caching of user data
- **Lazy Loading**: Load user details on demand
- **Debounced Search**: Optimize search performance

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS configuration allows frontend origin
2. **Authentication Issues**: Check JWT token validity and refresh logic
3. **Permission Denied**: Verify user roles and access permissions
4. **API Timeouts**: Check backend server status and network connectivity

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in frontend environment.

## 📄 License

This user management system is part of the GreenMagic e-commerce platform and follows the same licensing terms.

---

**Built with ❤️ for GreenMagic E-commerce Platform**

*Professional user management made simple and secure.* 