<?php
/**
 * Test API Endpoint
 * Use this to test if your API is working
 * URL: http://localhost/campusflow/test_api.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$results = [];

// Test 1: Check if config.php exists
$configPath = __DIR__ . '/config.php';
$results['config_file'] = [
    'exists' => file_exists($configPath),
    'path' => $configPath
];

// Test 2: Check if config.php can be loaded
if (file_exists($configPath)) {
    try {
        require_once $configPath;
        $results['config_load'] = ['status' => 'success'];
    } catch (Exception $e) {
        $results['config_load'] = ['status' => 'error', 'message' => $e->getMessage()];
    }
} else {
    $results['config_load'] = ['status' => 'error', 'message' => 'Config file not found'];
}

// Test 3: Check database connection
if (file_exists($configPath)) {
    try {
        require_once $configPath;
        $conn = getDBConnection();
        $results['database_connection'] = ['status' => 'success'];
        
        // Test query
        $stmt = $conn->query("SELECT COUNT(*) as count FROM users");
        $result = $stmt->fetch();
        $results['database_query'] = ['status' => 'success', 'user_count' => $result['count']];
    } catch (Exception $e) {
        $results['database_connection'] = ['status' => 'error', 'message' => $e->getMessage()];
    }
}

// Test 4: Check if API directory exists
$apiPath = __DIR__ . '/api';
$results['api_directory'] = [
    'exists' => is_dir($apiPath),
    'path' => $apiPath
];

// Test 5: Check if auth.php exists
$authPath = __DIR__ . '/api/auth.php';
$results['auth_file'] = [
    'exists' => file_exists($authPath),
    'path' => $authPath
];

// Test 6: Check PHP version
$results['php_version'] = [
    'version' => phpversion(),
    'meets_requirement' => version_compare(phpversion(), '7.4.0', '>=')
];

// Test 7: Check PDO extension
$results['pdo_extension'] = [
    'loaded' => extension_loaded('pdo_mysql')
];

echo json_encode($results, JSON_PRETTY_PRINT);
?>

