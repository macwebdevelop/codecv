<?php

$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

$subject = "FROM "+$name+" at "+$email;
$rec = "brendan.anthony.maclean13@gmail.com";

mail($rec, $subject, $message);
?>
