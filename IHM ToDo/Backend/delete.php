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

$id=$_GET['id'];

$sqlQuery = "DELETE FROM tasks
    WHERE id= $id";

$result = $connection->query($sqlQuery, PDO::FETCH_OBJ);

if(!$result){
    echo "No se puede listar el contenido";
    die();
}

$tasks =[];
foreach($result as $item){
    $tasks[] = $item;
}
echo json_encode($tasks);