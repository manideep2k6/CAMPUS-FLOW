<?php
/**
 * Campus Flow - Setup Verification Script
 * Run this file in your browser to check if everything is set up correctly
 * URL: http://localhost/campusflow/setup_check.php
 */

echo "<!DOCTYPE html><html><head><title>Campus Flow - Setup Check</title>";
echo "<style>body{font-family:Arial,sans-serif;max-width:800px;margin:50px auto;padding:20px;}";
echo ".success{color:green;}.error{color:red;}.warning{color:orange;}";
echo "h1{color:#667eea;}ul{line-height:2;}</style></head><body>";
echo "<h1>Campus Flow - Setup Verification</h1>";

$checks = [];
$allPassed = true;

// Check PHP Version
$phpVersion = phpversion();
$checks[] = [
    'name' => 'PHP Version',
    'status' => version_compare($phpVersion, '7.4.0', '>='),
    'message' => "PHP $phpVersion " . (version_compare($phpVersion, '7.4.0', '>=') ? '(OK)' : '(Requires PHP 7.4+)')
];

// Check MySQL Extension
$checks[] = [
    'name' => 'MySQL PDO Extension',
    'status' => extension_loaded('pdo_mysql'),
    'message' => extension_loaded('pdo_mysql') ? 'PDO MySQL extension is loaded' : 'PDO MySQL extension is not loaded'
];

// Check Database Connection
try {
    require_once 'config.php';
    $conn = getDBConnection();
    $checks[] = [
        'name' => 'Database Connection',
        'status' => true,
        'message' => 'Successfully connected to database'
    ];
    
    // Check if tables exist
    $tables = ['users', 'communities', 'community_members', 'projects', 'project_members', 'events', 'event_attendees', 'posts'];
    $missingTables = [];
    
    foreach ($tables as $table) {
        $stmt = $conn->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() == 0) {
            $missingTables[] = $table;
        }
    }
    
    if (empty($missingTables)) {
        $checks[] = [
            'name' => 'Database Tables',
            'status' => true,
            'message' => 'All required tables exist'
        ];
    } else {
        $checks[] = [
            'name' => 'Database Tables',
            'status' => false,
            'message' => 'Missing tables: ' . implode(', ', $missingTables) . '. Please import database.sql'
        ];
        $allPassed = false;
    }
    
} catch (Exception $e) {
    $checks[] = [
        'name' => 'Database Connection',
        'status' => false,
        'message' => 'Failed to connect: ' . $e->getMessage()
    ];
    $allPassed = false;
}

// Check if API files exist
$apiFiles = ['api/auth.php', 'api/communities.php', 'api/projects.php', 'api/events.php', 'api/dashboard.php'];
$missingFiles = [];

foreach ($apiFiles as $file) {
    if (!file_exists($file)) {
        $missingFiles[] = $file;
    }
}

if (empty($missingFiles)) {
    $checks[] = [
        'name' => 'API Files',
        'status' => true,
        'message' => 'All API files exist'
    ];
} else {
    $checks[] = [
        'name' => 'API Files',
        'status' => false,
        'message' => 'Missing files: ' . implode(', ', $missingFiles)
    ];
    $allPassed = false;
}

// Check if JS files exist
$jsFiles = ['js/auth.js', 'js/dashboard.js', 'js/communities.js', 'js/projects.js', 'js/events.js'];
$missingJs = [];

foreach ($jsFiles as $file) {
    if (!file_exists($file)) {
        $missingJs[] = $file;
    }
}

if (empty($missingJs)) {
    $checks[] = [
        'name' => 'JavaScript Files',
        'status' => true,
        'message' => 'All JavaScript files exist'
    ];
} else {
    $checks[] = [
        'name' => 'JavaScript Files',
        'status' => false,
        'message' => 'Missing files: ' . implode(', ', $missingJs)
    ];
    $allPassed = false;
}

// Check if HTML files exist
$htmlFiles = ['index.html', 'dashboard.html', 'communities.html', 'projects.html', 'events.html', 'profile.html'];
$missingHtml = [];

foreach ($htmlFiles as $file) {
    if (!file_exists($file)) {
        $missingHtml[] = $file;
    }
}

if (empty($missingHtml)) {
    $checks[] = [
        'name' => 'HTML Files',
        'status' => true,
        'message' => 'All HTML files exist'
    ];
} else {
    $checks[] = [
        'name' => 'HTML Files',
        'status' => false,
        'message' => 'Missing files: ' . implode(', ', $missingHtml)
    ];
    $allPassed = false;
}

// Display results
echo "<ul>";
foreach ($checks as $check) {
    $status = $check['status'] ? 'success' : 'error';
    $icon = $check['status'] ? '✓' : '✗';
    echo "<li><span class='$status'><strong>$icon {$check['name']}:</strong></span> {$check['message']}</li>";
}
echo "</ul>";

if ($allPassed) {
    echo "<h2 class='success'>✓ All checks passed! Your setup is ready.</h2>";
    echo "<p><a href='index.html'>Go to Login Page</a></p>";
} else {
    echo "<h2 class='error'>✗ Some checks failed. Please fix the issues above.</h2>";
    echo "<p><strong>Next Steps:</strong></p>";
    echo "<ul>";
    echo "<li>Make sure XAMPP Apache and MySQL are running</li>";
    echo "<li>Import database.sql file in phpMyAdmin</li>";
    echo "<li>Check that all files are in the correct directories</li>";
    echo "<li>Verify database credentials in config.php</li>";
    echo "</ul>";
}

echo "</body></html>";
?>

