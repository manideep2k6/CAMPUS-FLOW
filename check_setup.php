<?php
/**
 * Comprehensive Setup Check
 * Open: http://localhost/campusflow/check_setup.php
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Campus Flow - Setup Check</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 50px auto; padding: 20px; }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        .warning { color: orange; font-weight: bold; }
        .info { color: blue; }
        h1 { color: #667eea; }
        h2 { border-bottom: 2px solid #667eea; padding-bottom: 5px; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        ul { line-height: 1.8; }
    </style>
</head>
<body>
    <h1>🔍 Campus Flow - Setup Diagnostic</h1>
    
    <?php
    $allPassed = true;
    $issues = [];
    
    // Test 1: PHP Version
    echo '<div class="section">';
    echo '<h2>1. PHP Version</h2>';
    $phpVersion = phpversion();
    $phpOk = version_compare($phpVersion, '7.4.0', '>=');
    if ($phpOk) {
        echo '<p class="success">✓ PHP ' . $phpVersion . ' (OK)</p>';
    } else {
        echo '<p class="error">✗ PHP ' . $phpVersion . ' (Requires PHP 7.4+)</p>';
        $allPassed = false;
        $issues[] = 'PHP version too old';
    }
    echo '</div>';
    
    // Test 2: Required Extensions
    echo '<div class="section">';
    echo '<h2>2. PHP Extensions</h2>';
    $required = ['pdo', 'pdo_mysql', 'json', 'session'];
    foreach ($required as $ext) {
        $loaded = extension_loaded($ext);
        if ($loaded) {
            echo '<p class="success">✓ ' . $ext . ' extension loaded</p>';
        } else {
            echo '<p class="error">✗ ' . $ext . ' extension NOT loaded</p>';
            $allPassed = false;
            $issues[] = 'Missing extension: ' . $ext;
        }
    }
    echo '</div>';
    
    // Test 3: File Structure
    echo '<div class="section">';
    echo '<h2>3. File Structure</h2>';
    $files = [
        'config.php' => 'Configuration file',
        'api/auth.php' => 'Authentication API',
        'auth.js' => 'Authentication JavaScript',
        'index.html' => 'Login page',
        'database.sql' => 'Database schema'
    ];
    
    foreach ($files as $file => $desc) {
        $exists = file_exists($file);
        if ($exists) {
            echo '<p class="success">✓ ' . $desc . ' (' . $file . ')</p>';
        } else {
            echo '<p class="error">✗ ' . $desc . ' (' . $file . ') NOT FOUND</p>';
            $allPassed = false;
            $issues[] = 'Missing file: ' . $file;
        }
    }
    echo '</div>';
    
    // Test 4: Config File
    echo '<div class="section">';
    echo '<h2>4. Configuration</h2>';
    if (file_exists('config.php')) {
        try {
            require_once 'config.php';
            echo '<p class="success">✓ config.php loaded successfully</p>';
            echo '<p class="info">Database: ' . DB_NAME . '</p>';
            echo '<p class="info">Host: ' . DB_HOST . '</p>';
            echo '<p class="info">User: ' . DB_USER . '</p>';
        } catch (Exception $e) {
            echo '<p class="error">✗ Error loading config.php: ' . $e->getMessage() . '</p>';
            $allPassed = false;
            $issues[] = 'Config file error: ' . $e->getMessage();
        }
    }
    echo '</div>';
    
    // Test 5: Database Connection
    echo '<div class="section">';
    echo '<h2>5. Database Connection</h2>';
    if (file_exists('config.php')) {
        try {
            require_once 'config.php';
            if (function_exists('getDBConnection')) {
                $conn = getDBConnection();
                echo '<p class="success">✓ Database connection successful!</p>';
                
                // Test query
                $stmt = $conn->query("SELECT DATABASE() as db, VERSION() as version");
                $result = $stmt->fetch();
                echo '<p class="info">Connected to: ' . $result['db'] . '</p>';
                echo '<p class="info">MySQL Version: ' . $result['version'] . '</p>';
                
                // Check if tables exist
                $tables = ['users', 'communities', 'projects', 'events'];
                $missingTables = [];
                foreach ($tables as $table) {
                    $stmt = $conn->query("SHOW TABLES LIKE '$table'");
                    if ($stmt->rowCount() == 0) {
                        $missingTables[] = $table;
                    }
                }
                
                if (empty($missingTables)) {
                    echo '<p class="success">✓ All required tables exist</p>';
                } else {
                    echo '<p class="warning">⚠ Missing tables: ' . implode(', ', $missingTables) . '</p>';
                    echo '<p class="info">Solution: Import database.sql in phpMyAdmin</p>';
                    $issues[] = 'Missing database tables';
                }
            } else {
                echo '<p class="error">✗ getDBConnection function not found</p>';
                $allPassed = false;
            }
        } catch (Exception $e) {
            echo '<p class="error">✗ Database connection failed: ' . $e->getMessage() . '</p>';
            echo '<ul>';
            echo '<li>Make sure MySQL is running in XAMPP</li>';
            echo '<li>Check database name in config.php is "campus_flow"</li>';
            echo '<li>Verify database exists in phpMyAdmin</li>';
            echo '<li>Check MySQL username and password</li>';
            echo '</ul>';
            $allPassed = false;
            $issues[] = 'Database connection failed: ' . $e->getMessage();
        }
    }
    echo '</div>';
    
    // Test 6: API Test
    echo '<div class="section">';
    echo '<h2>6. API Endpoints</h2>';
    echo '<p class="info">Test these URLs in your browser:</p>';
    echo '<ul>';
    echo '<li><a href="api/simple_test.php" target="_blank">api/simple_test.php</a> - Should return JSON</li>';
    echo '<li><a href="api/test.php" target="_blank">api/test.php</a> - Detailed API test</li>';
    echo '<li><a href="api/auth.php?action=check" target="_blank">api/auth.php?action=check</a> - Auth API test</li>';
    echo '</ul>';
    echo '</div>';
    
    // Test 7: Server Information
    echo '<div class="section">';
    echo '<h2>7. Server Information</h2>';
    echo '<pre>';
    echo 'Server Software: ' . ($_SERVER['SERVER_SOFTWARE'] ?? 'Not available') . "\n";
    echo 'Document Root: ' . ($_SERVER['DOCUMENT_ROOT'] ?? 'Not available') . "\n";
    echo 'Script Path: ' . __FILE__ . "\n";
    echo 'Current Directory: ' . __DIR__ . "\n";
    echo 'PHP SAPI: ' . php_sapi_name() . "\n";
    echo '</pre>';
    echo '</div>';
    
    // Final Summary
    echo '<div class="section" style="background: ' . ($allPassed ? '#d4edda' : '#f8d7da') . '; border-color: ' . ($allPassed ? '#c3e6cb' : '#f5c6cb') . ';">';
    echo '<h2>' . ($allPassed ? '✓ All Checks Passed!' : '✗ Issues Found') . '</h2>';
    
    if ($allPassed) {
        echo '<p class="success">Your setup looks good! You can now use the application.</p>';
        echo '<p><a href="index.html" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Application</a></p>';
    } else {
        echo '<p class="error">Please fix the following issues:</p>';
        echo '<ul>';
        foreach ($issues as $issue) {
            echo '<li class="error">' . $issue . '</li>';
        }
        echo '</ul>';
        echo '<h3>Quick Fixes:</h3>';
        echo '<ol>';
        echo '<li><strong>If using Live Server (port 5500):</strong> You MUST use XAMPP Apache instead. Copy files to C:\\xampp\\htdocs\\campusflow\\ and access via http://localhost/campusflow/</li>';
        echo '<li><strong>If database connection fails:</strong> Start MySQL in XAMPP, create database "campus_flow", and import database.sql</li>';
        echo '<li><strong>If files not found:</strong> Make sure all files are in the correct folder structure</li>';
        echo '<li><strong>If Apache won\'t start:</strong> Check if port 80 is in use, or change Apache port in XAMPP</li>';
        echo '</ol>';
    }
    echo '</div>';
    ?>
</body>
</html>

