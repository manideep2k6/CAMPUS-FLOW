# TROUBLESHOOTING GUIDE - Network/Login Issues

## Quick Fixes for "Network Error" on Login/Register

### Step 1: Test API Connection
1. Open browser and go to: `http://localhost/campusflow/test_api.php`
2. This will show you what's working and what's not
3. Check all items should show "success" or "exists"

### Step 2: Check XAMPP Services
1. Open XAMPP Control Panel
2. Make sure **Apache** is running (green)
3. Make sure **MySQL** is running (green)
4. If not running, click "Start" for both

### Step 3: Verify File Structure
Make sure your files are in this structure:
```
C:\xampp\htdocs\campusflow\
├── index.html
├── config.php
├── api/
│   └── auth.php
└── js/
    └── auth.js
```

### Step 4: Check Database
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Check if database `campus_flow` exists
3. If not, create it and import `database.sql`

### Step 5: Test API Directly
Try accessing the API directly in browser:
- `http://localhost/campusflow/api/auth.php?action=check`

You should see JSON response (even if it says "not logged in")

### Step 6: Check Browser Console
1. Open browser (F12)
2. Go to "Console" tab
3. Try to login/register
4. Look for error messages
5. Share the error message if you see any

### Step 7: Common Issues

#### Issue: "Failed to fetch" or "Network error"
**Solution:**
- Make sure Apache is running in XAMPP
- Check if you're accessing via `http://localhost/campusflow/` not `file:///`
- Verify the `api/auth.php` file exists

#### Issue: "404 Not Found"
**Solution:**
- Check file paths are correct
- Make sure files are in `htdocs/campusflow/` folder
- Verify folder name is exactly `campusflow` (no spaces)

#### Issue: "Database connection failed"
**Solution:**
- Make sure MySQL is running in XAMPP
- Check database name in `config.php` is `campus_flow`
- Verify database exists in phpMyAdmin
- Check MySQL username/password in `config.php`

#### Issue: "Invalid response from server"
**Solution:**
- Check if PHP is enabled in Apache
- Look at Apache error logs: `C:\xampp\apache\logs\error.log`
- Try accessing `test_api.php` to see detailed errors

### Step 8: Manual API Test

Create a file `test_login.php` in your project root:

```php
<?php
require_once 'config.php';
$conn = getDBConnection();
echo "Database connected successfully!";
?>
```

Access: `http://localhost/campusflow/test_login.php`

If this works, database is fine. If not, check database settings.

### Step 9: Check PHP Error Logs
1. Check: `C:\xampp\php\logs\php_error_log`
2. Look for any errors related to your application
3. Share error messages if found

### Step 10: Verify Session Settings
Sessions should work by default, but if issues persist:
1. Check `C:\xampp\php\php.ini`
2. Make sure `session.auto_start = 0` (default)
3. Restart Apache after any changes

## Still Having Issues?

1. Run `setup_check.php` - it will diagnose most issues
2. Check browser console (F12) for JavaScript errors
3. Check Apache error logs
4. Verify all file paths are correct
5. Make sure you're using `http://localhost/` not `file:///`

## Quick Test Checklist

- [ ] Apache is running
- [ ] MySQL is running  
- [ ] Database `campus_flow` exists
- [ ] All files are in correct folders
- [ ] Accessing via `http://localhost/campusflow/`
- [ ] `test_api.php` shows all green/success
- [ ] Browser console shows no errors
- [ ] PHP error logs show no errors

