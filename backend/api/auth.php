<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

if(!$db) {
    http_response_code(503);
    echo json_encode(array(
        "success" => false,
        "message" => "Unable to connect to database."
    ));
    exit();
}

$user = new User($db);

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path_parts = explode('/', trim($path, '/'));

// Get the action from URL
$action = end($path_parts);

switch($method) {
    case 'POST':
        if($action == 'signup') {
            handleSignup();
        } elseif($action == 'login') {
            handleLogin();
        } else {
            http_response_code(404);
            echo json_encode(array(
                "success" => false,
                "message" => "Endpoint not found."
            ));
        }
        break;
        
    case 'GET':
        if($action == 'me') {
            handleGetMe();
        } else {
            http_response_code(404);
            echo json_encode(array(
                "success" => false,
                "message" => "Endpoint not found."
            ));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array(
            "success" => false,
            "message" => "Method not allowed."
        ));
        break;
}

function handleSignup() {
    global $user;
    
    $data = json_decode(file_get_contents("php://input"));
    
    if(!$data) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid JSON data."
        ));
        return;
    }
    
    // Validate required fields
    if(empty($data->firstName) || empty($data->lastName) || empty($data->email) || 
       empty($data->phone) || empty($data->password)) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "message" => "All fields are required."
        ));
        return;
    }
    
    // Validate email format
    if(!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid email format."
        ));
        return;
    }
    
    // Validate password length
    if(strlen($data->password) < 6) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "message" => "Password must be at least 6 characters."
        ));
        return;
    }
    
    // Set user properties
    $user->first_name = $data->firstName;
    $user->last_name = $data->lastName;
    $user->email = $data->email;
    $user->phone = $data->phone;
    $user->password = $data->password;
    $user->role = 'user';
    
    // Check if email already exists
    if($user->emailExists()) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "message" => "User already exists with this email address."
        ));
        return;
    }
    
    // Create user
    if($user->create()) {
        // Generate JWT token (simple implementation)
        $token = base64_encode(json_encode(array(
            'id' => $user->id,
            'email' => $user->email,
            'exp' => time() + (7 * 24 * 60 * 60) // 7 days
        )));
        
        http_response_code(201);
        echo json_encode(array(
            "success" => true,
            "message" => "User registered successfully.",
            "data" => array(
                "user" => array(
                    "id" => $user->id,
                    "firstName" => $user->first_name,
                    "lastName" => $user->last_name,
                    "email" => $user->email,
                    "phone" => $user->phone,
                    "role" => $user->role
                ),
                "token" => $token
            )
        ));
    } else {
        http_response_code(500);
        echo json_encode(array(
            "success" => false,
            "message" => "Unable to create user."
        ));
    }
}

function handleLogin() {
    global $user;
    
    $data = json_decode(file_get_contents("php://input"));
    
    if(!$data) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid JSON data."
        ));
        return;
    }
    
    // Validate required fields
    if(empty($data->email) || empty($data->password)) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "message" => "Email and password are required."
        ));
        return;
    }
    
    // Set email and check if user exists
    $user->email = $data->email;
    
    if(!$user->emailExists()) {
        http_response_code(401);
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid email or password."
        ));
        return;
    }
    
    // Check if account is active
    if(!$user->is_active) {
        http_response_code(401);
        echo json_encode(array(
            "success" => false,
            "message" => "Account is deactivated. Please contact support."
        ));
        return;
    }
    
    // Verify password
    if(!$user->verifyPassword($data->password)) {
        http_response_code(401);
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid email or password."
        ));
        return;
    }
    
    // Update last login
    $user->updateLastLogin();
    
    // Generate JWT token
    $token = base64_encode(json_encode(array(
        'id' => $user->id,
        'email' => $user->email,
        'exp' => time() + (7 * 24 * 60 * 60) // 7 days
    )));
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "message" => "Login successful.",
        "data" => array(
            "user" => array(
                "id" => $user->id,
                "firstName" => $user->first_name,
                "lastName" => $user->last_name,
                "email" => $user->email,
                "phone" => $user->phone,
                "role" => $user->role,
                "lastLogin" => $user->last_login
            ),
            "token" => $token
        )
    ));
}

function handleGetMe() {
    global $user;
    
    $headers = getallheaders();
    $token = null;
    
    if(isset($headers['Authorization'])) {
        $auth_header = $headers['Authorization'];
        if(preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
            $token = $matches[1];
        }
    }
    
    if(!$token) {
        http_response_code(401);
        echo json_encode(array(
            "success" => false,
            "message" => "Access token required."
        ));
        return;
    }
    
    // Decode token
    $token_data = json_decode(base64_decode($token), true);
    
    if(!$token_data || $token_data['exp'] < time()) {
        http_response_code(401);
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid or expired token."
        ));
        return;
    }
    
    // Get user data
    $user->id = $token_data['id'];
    
    if($user->getById()) {
        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "data" => array(
                "user" => array(
                    "id" => $user->id,
                    "firstName" => $user->first_name,
                    "lastName" => $user->last_name,
                    "email" => $user->email,
                    "phone" => $user->phone,
                    "role" => $user->role,
                    "lastLogin" => $user->last_login,
                    "createdAt" => $user->created_at
                )
            )
        ));
    } else {
        http_response_code(404);
        echo json_encode(array(
            "success" => false,
            "message" => "User not found."
        ));
    }
}
?>
