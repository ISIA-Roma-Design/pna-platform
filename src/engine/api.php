<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log to file to verify execution
file_put_contents(__DIR__ . '/debug.log', date('[Y-m-d H:i:s] ') . "Request received: " . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$dbFile = __DIR__ . '/db-prototipo.json';
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'register') {
        // Get raw posted data
        $input = file_get_contents("php://input");
        file_put_contents(__DIR__ . '/debug.log', "Input: " . $input . "\n", FILE_APPEND);
        
        $data = json_decode($input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON input: " . json_last_error_msg());
        }

        if (!empty($data)) {
            // Read existing data
            if (file_exists($dbFile)) {
                $fileContent = file_get_contents($dbFile);
                $currentData = json_decode($fileContent, true);
                if (!is_array($currentData)) {
                    $currentData = [];
                }
            } else {
                $currentData = [];
            }

            // Add timestamp
            $data['registered_at'] = date('Y-m-d H:i:s');
            
            // Append new user
            $currentData[] = $data;

            // Save back to file
            if (file_put_contents($dbFile, json_encode($currentData, JSON_PRETTY_PRINT))) {
                http_response_code(201);
                echo json_encode(["message" => "User registered successfully.", "user" => $data]);
            } else {
                throw new Exception("Unable to write to database.json. Check permissions on " . $dbFile);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Data is incomplete."]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'submit_candidacy') {
        // Handle Candidacy Submission
        $input = file_get_contents("php://input");
        file_put_contents(__DIR__ . '/debug.log', "Candidacy Input: " . $input . "\n", FILE_APPEND);
        
        $data = json_decode($input, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON input: " . json_last_error_msg());
        }

        if (!empty($data)) {
            // Read existing data or separate file?
            // For now, we use a separate 'candidacies.json' or append to 'database.json' with a 'type' field.
            // Let's use 'database.json' but maybe different file for clarity if requested, 
            // but sticking to database.json is simpler for demo.
            
            // To keep it clean, let's just append to database.json but structured possibly different?
            // Actually, the user asked for a "system" in DBML, but for the PHP flat-file demo, 
            // let's just save valid JSON objects.
            
            if (file_exists($dbFile)) {
                $fileContent = file_get_contents($dbFile);
                $currentData = json_decode($fileContent, true);
                if (!is_array($currentData)) {
                    $currentData = [];
                }
            } else {
                $currentData = [];
            }

            $data['submitted_at'] = date('Y-m-d H:i:s');
            $data['record_type'] = 'candidacy'; // Distinction
            
            $currentData[] = $data;

            if (file_put_contents($dbFile, json_encode($currentData, JSON_PRETTY_PRINT))) {
                http_response_code(201);
                echo json_encode(["message" => "Candidacy submitted successfully."]);
            } else {
                throw new Exception("Unable to write to database.json.");
            }
        } else {
             http_response_code(400);
             echo json_encode(["message" => "Data is incomplete."]);
        }

    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update_profile') {
        // Handle Profile Update
        $input = file_get_contents("php://input");
        file_put_contents(__DIR__ . '/debug.log', "Update Profile: " . $input . "\n", FILE_APPEND);
        
        $data = json_decode($input, true);
        if (empty($data['email'])) {
            http_response_code(400);
            echo json_encode(["message" => "Email is required to identify user."]);
            exit;
        }

        $emailToFind = strtolower(trim($data['email']));
        
        if (file_exists($dbFile)) {
            $fileContent = file_get_contents($dbFile);
            $currentData = json_decode($fileContent, true);
            $userFound = false;

            if (is_array($currentData)) {
                foreach ($currentData as &$user) {
                    if (isset($user['email']) && strtolower(trim($user['email'])) === $emailToFind) {
                        // Update fields
                        $user['nome'] = $data['nome'] ?? $user['nome'];
                        $user['cognome'] = $data['cognome'] ?? $user['cognome'];
                        $user['telefono'] = $data['telefono'] ?? $user['telefono'];
                        $user['matricola'] = $data['matricola'] ?? $user['matricola'];
                        $user['codice_fiscale'] = $data['codice_fiscale'] ?? $user['codice_fiscale'];
                        $user['data_nascita'] = $data['data_nascita'] ?? $user['data_nascita'];
                        $user['luogo_nascita'] = $data['luogo_nascita'] ?? $user['luogo_nascita'];
                        $user['nazionalita'] = $data['nazionalita'] ?? $user['nazionalita'];
                        $user['residenza'] = $data['residenza'] ?? $user['residenza'];
                        $user['indirizzo'] = $data['indirizzo'] ?? $user['indirizzo'];
                        $user['tipologia_istituzione'] = $data['tipologia_istituzione'] ?? $user['tipologia_istituzione'];
                        $user['istituzione'] = $data['istituzione'] ?? $user['istituzione'];
                        $user['anno_accademico'] = $data['anno_accademico'] ?? $user['anno_accademico'];

                        // Update Password Only if Provided
                        if (!empty($data['password'])) {
                            if ($data['password'] === $data['confirm_password']) {
                                $user['password'] = $data['password'];
                                $user['confirm_password'] = $data['confirm_password']; // Keep sync if needed
                            } else {
                                http_response_code(400);
                                echo json_encode(["message" => "Passwords do not match."]);
                                exit;
                            }
                        }

                        $userFound = true;
                        $updatedUser = $user;
                        break;
                    }
                }
            }
            
            if ($userFound) {
                if (file_put_contents($dbFile, json_encode($currentData, JSON_PRETTY_PRINT))) {
                    http_response_code(200);
                    echo json_encode(["message" => "Profile updated successfully.", "user" => $updatedUser]);
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Failed to write to database."]);
                }
            } else {
                http_response_code(404);
                echo json_encode(["message" => "User not found."]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Database not found."]);
        }

    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'login') {
        // Handle Login (Email Lookup)
        $input = file_get_contents("php://input");
        file_put_contents(__DIR__ . '/debug.log', "Login Attempt: " . $input . "\n", FILE_APPEND);
        
        $data = json_decode($input, true);
        if (empty($data['email'])) {
            http_response_code(400);
            echo json_encode(["message" => "Email is required."]);
            exit;
        }

        $emailToFind = strtolower(trim($data['email']));
        
        if (file_exists($dbFile)) {
            $fileContent = file_get_contents($dbFile);
            $currentData = json_decode($fileContent, true);
            
            $foundUser = null;
            if (is_array($currentData)) {
                foreach ($currentData as $user) {
                    // Check if record is a user registration (has email and NO record_type or record_type is not candidacy)
                    // The DB mixes users and candidacies. Users usually don't have 'record_type'.
                    // Or we just look for email match in any record that looks like a user profile?
                    // Let's look for matching email keys.
                    
                    if (isset($user['email']) && strtolower(trim($user['email'])) === $emailToFind) {
                        // Check password (simple verification)
                        // In a real app, use password_verify(). Here we assume plain text or direct match based on user request.
                        if (isset($data['password']) && isset($user['password']) && $data['password'] === $user['password']) {
                            $foundUser = $user;
                            break;
                        } elseif (!isset($data['password'])) {
                             // Fail if no password provided
                             break;
                        }
                    }
                }
            }
            
            if ($foundUser) {
                http_response_code(200);
                echo json_encode(["message" => "Login successful", "user" => $foundUser]);
            } else {
                http_response_code(401); // Unauthorized (User not found)
                echo json_encode(["message" => "User not found."]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Database not found."]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'search_users') {
        // Handle User Search
        $query = isset($_GET['query']) ? strtolower(trim($_GET['query'])) : '';
        
        if (strlen($query) < 2) {
             http_response_code(400);
             echo json_encode(["message" => "Query too short."]);
             exit;
        }

        if (file_exists($dbFile)) {
            $fileContent = file_get_contents($dbFile);
            $currentData = json_decode($fileContent, true);
            $results = [];

            if (is_array($currentData)) {
                foreach ($currentData as $user) {
                    // Skip candidacies (record_type)
                    if (isset($user['record_type']) && $user['record_type'] === 'candidacy') {
                        continue;
                    }

                    // Check Match
                    $nome = isset($user['nome']) ? strtolower($user['nome']) : '';
                    $cognome = isset($user['cognome']) ? strtolower($user['cognome']) : '';
                    $email = isset($user['email']) ? strtolower($user['email']) : '';

                    if (strpos($nome, $query) !== false || 
                        strpos($cognome, $query) !== false || 
                        strpos($email, $query) !== false) {
                        
                        // Return public info only
                        $results[] = [
                            'nome' => $user['nome'],
                            'cognome' => $user['cognome'],
                            'email' => $user['email'],
                            // Add role/type if we had it, assuming 'studente' by default logic or generic
                            'role' => 'studente' // or 'docente? we don't distinguish yet in DB clearly, assuming generic user
                        ];
                    }
                }
            }
            
            http_response_code(200);
            echo json_encode(["users" => $results]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Database not found."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found or invalid method."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    file_put_contents(__DIR__ . '/debug.log', "Error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(["message" => "Server Error: " . $e->getMessage()]);
}
?>
