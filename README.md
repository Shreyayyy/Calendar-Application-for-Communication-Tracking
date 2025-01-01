# Calendar-Application-for-Communication-Tracking
# 🏢 Company Management System

A responsive and modular web application that allows administrators to manage company details and users to view dashboards and calendars. This application separates admin and user functionalities for better user experience.

---

## 🚀 Features

### **Admin Features**
- Add, edit, and delete company information.
- Manage communication methods and history.
- Centralized dashboard for company management.

### **User Features**
- **Dashboard**: View company information interactively.
- **Calendar View**: Access scheduled events and updates in a structured layout.

---

## 🛠️ Technologies Used

- **Frontend Framework**: React.js
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Styling**: CSS3 (Dark Mode with Animations)
- **Build Tool**: Create React App (CRA)

---

## 📂 Project Structure

company-management-system/ ├── src/ │ ├── components/ │ │ ├── admin/ │ │ │ └── CompanyManagement.js # Admin-specific functionality │ │ ├── user/ │ │ │ ├── Dashboard.js # User dashboard │ │ │ └── CalendarView.js # User calendar │ │ ├── SelectionPage.js # Admin/User role selection page │ │ └── CompanyContext.js # Shared state management │ ├── styles/ │ │ └── SelectionPage.css # Dark mode styles │ └── App.js # Main entry point ├── public/ │ └── index.html ├── package.json ├── README.md └── .gitignore 

📋 Application Functionality
Admin
Role Selection: Navigate to /admin after selecting the "Admin" option.
Company Management: Access the CompanyManagement.js component to manage companies.
State Sharing: Admin data is shared globally using CompanyContext.js.
User
Role Selection: Navigate to /user after selecting the "User" option.
Dashboard and Calendar View: Use Dashboard.js and CalendarView.js for company insights and scheduling.
