<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path_parts = explode('/', trim($path, '/'));

// Remove 'api' from path parts
$path_parts = array_slice($path_parts, 1);

if(empty($path_parts[0])) {
    // Health check
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "message" => "SafariTix API is running",
        "timestamp" => date('c'),
        "environment" => "development"
    ));
    exit();
}

$endpoint = $path_parts[0];

switch($endpoint) {
    case 'auth':
        require_once 'auth.php';
        break;
        
    case 'health':
        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "message" => "SafariTix API is running",
            "timestamp" => date('c'),
            "environment" => "development"
        ));
        break;
        
    default:
        http_response_code(404);
        echo json_encode(array(
            "success" => false,
            "message" => "Endpoint not found."
        ));
        break;
}
?>
