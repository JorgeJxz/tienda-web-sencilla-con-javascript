<?php 

header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: Sat, 14 Jan 2012 01:00:00 GMT"); 

$contenido = $_REQUEST["param"];
$f = fopen("../json/clientes.json", 'w+b');
fwrite($f,$contenido);
fclose($f);

?>