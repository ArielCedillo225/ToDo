<?php

header("Access-Control-Allow-Origin:*");
$dsn = "mysql:host=localhost;dbname=todo";
$username = "root";
$password = "12341";

try{
    $connection = new PDO($dsn, $username, $password);
}catch(Exception $exception){
    print_r($exception);
}

$content =  file_get_contents("php://input");
$tasks = json_decode($content);

$id = $tasks->id;
$status = $tasks->status;

print_r([$id, $status]);

$sqlQuery = "UPDATE tasks 
    SET task_status='$status' 
    WHERE id = $id";

$result = $connection->query($sqlQuery);

if($result){
    echo "El registro se guardo correctamente";
} else {
    echo "Error, no se pudo registrar";
}
