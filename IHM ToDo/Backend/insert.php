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

$name = $tasks->task_name;
$description = $tasks->task_description;
$date = $tasks->task_date;

$slqQuerry = "INSERT INTO tasks (task_name, task_description, task_date) 
            VALUES ('$name', '$description', '$date')";

$result = $connection->query($slqQuerry);

if($result){
    echo "El registro se guardo correctamente";
} else {
    echo "Error, no se pudo registrar";
}
