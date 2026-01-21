CAMPUS FLOW - SETUP INSTRUCTIONS
================================

1. DATABASE SETUP (XAMPP):
   - Start XAMPP and ensure Apache and MySQL are running
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Import the database.sql file to create the database and tables
   - Default password for sample users is: password

2. PROJECT STRUCTURE:
   - Place all files in: C:\xampp\htdocs\campusflow\ (or your preferred folder)
   - Make sure the folder structure is maintained:
     * index.html
     * dashboard.html
     * communities.html
     * projects.html
     * events.html
     * profile.html
     * config.php
     * api/ folder (with auth.php, communities.php, projects.php, events.php)
     * js/ folder (with auth.js, dashboard.js, communities.js, projects.js, events.js)
     * database.sql

3. CONFIGURATION:
   - Open config.php and verify database settings:
     * DB_HOST: localhost
     * DB_USER: root
     * DB_PASS: (leave empty for default XAMPP)
     * DB_NAME: campus_flow

4. ACCESS THE APPLICATION:
   - Open browser and go to: http://localhost/campusflow/
   - Register a new account or login with sample accounts:
     * Username: admin, Password: password
     * Username: john_doe, Password: password
     * Username: jane_smith, Password: password

5. FEATURES:
   - User Registration & Login
   - Dashboard with overview
   - Create and Join Communities
   - Create and Join Projects
   - Create and Attend Events
   - User Profile

6. TROUBLESHOOTING:
   - If you get database connection errors, check MySQL is running in XAMPP
   - If pages don't load, check Apache is running
   - Make sure all file paths are correct
   - Check browser console for JavaScript errors

