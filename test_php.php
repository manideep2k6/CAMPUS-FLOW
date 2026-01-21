<?php
/**
 * Test PHP Installation
 * Open this file in browser: http://localhost/campusflow/test_php.php
 * Or if using XAMPP: http://localhost/campusflow/test_php.php
 */

echo "<!DOCTYPE html><html><head><title>PHP Test</title>";
echo "<style>body{font-family:Arial;max-width:800px;margin:50px auto;padding:20px;}";
echo ".success{color:green;}.error{color:red;}.info{color:blue;}";
echo "h1{color:#667eea;}pre{background:#f5f5f5;padding:15px;border-radius:5px;}</style></head><body>";
echo "<h1>PHP Installation Test</h1>";

echo "<h2>1. PHP Version</h2>";
echo "<p class='info'>PHP Version: " . phpversion() . "</p>";

echo "<h2>2. Server Information</h2>";
echo "<pre>";
echo "Server Software: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'Not available') . "\n";
echo "Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'Not available') . "\n";
echo "Script Path: " . __FILE__ . "\n";
echo "Current Directory: " . __DIR__ . "\n";
echo "</pre>";

echo "<h2>3. PHP Extensions</h2>";
$required = ['pdo', 'pdo_mysql', 'json', 'session'];
foreach ($required as $ext) {
    $loaded = extension_loaded($ext);
    $class = $loaded ? 'success' : 'error';
    $status = $loaded ? '✓ Loaded' : '✗ Not Loaded';
    echo "<p class='$class'>$ext: $status</p>";
}

echo "<h2>4. File Permissions</h2>";
$files = ['config.php', 'api/auth.php', 'database.sql'];
foreach ($files as $file) {
    $exists = file_exists($file);
    $class = $exists ? 'success' : 'error';
    $status = $exists ? '✓ Exists' : '✗ Not Found';
    echo "<p class='$class'>$file: $status</p>";
}

echo "<h2>5. Database Connection Test</h2>";
if (file_exists('config.php')) {
    try {
        require_once 'config.php';
        $conn = getDBConnection();
        echo "<p class='success'>✓ Database connection successful!</p>";
        
        // Test query
        $stmt = $conn->query("SELECT DATABASE() as db");
        $result = $stmt->fetch();
        echo "<p class='info'>Connected to database: " . $result['db'] . "</p>";
    } catch (Exception $e) {
        echo "<p class='error'>✗ Database connection failed: " . $e->getMessage() . "</p>";
        echo "<p class='info'>Make sure:</p>";
        echo "<ul>";
        echo "<li>MySQL is running in XAMPP</li>";
        echo "<li>Database 'campus_flow' exists</li>";
        echo "<li>Username and password in config.php are correct</li>";
        echo "</ul>";
    }
} else {
    echo "<p class='error'>✗ config.php not found</p>";
}

echo "<h2>6. API Test</h2>";
echo "<p class='info'>Try accessing: <a href='api/auth.php?action=check' target='_blank'>api/auth.php?action=check</a></p>";
echo "<p class='info'>You should see JSON response (even if error, it should be JSON format)</p>";

echo "<h2>7. Important Notes</h2>";
echo "<div style='background:#fff3cd;padding:15px;border-radius:5px;margin:20px 0;'>";
echo "<p><strong>⚠️ You must use XAMPP Apache, not VS Code Live Server!</strong></p>";
echo "<p>VS Code Live Server (port 5500) does NOT run PHP.</p>";
echo "<p>To fix:</p>";
echo "<ol>";
echo "<li>Open XAMPP Control Panel</li>";
echo "<li>Start Apache and MySQL</li>";
echo "<li>Copy your project to: <code>C:\\xampp\\htdocs\\campusflow\\</code></li>";
echo "<li>Access via: <code>http://localhost/campusflow/</code></li>";
echo "</ol>";
echo "</div>";

echo "</body></html>";
?>

