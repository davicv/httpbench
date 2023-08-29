<?php

$num = isset($_REQUEST['num']) && $_REQUEST['num'] > 0 ? (int)$_REQUEST['num'] : 100;

$nameList = array('Afonso', 'Alice', 'Ana', 'Amanda', 'Ana', 'Arthur', 'Augusto', 'Bernardo', 'Carlos',
                  'Carolina', 'Cassia', 'Cecília', 'Cintia', 'Daniel', 'Davi', 'Debora', 'Fabio', 'Fatima',
                  'Gabriel', 'Gael', 'Heitor', 'Helena', 'Isabella', 'Jose', 'Julia', 'Laura', 'Lavinnye',
                  'Ligia', 'Livia', 'Liz', 'Maitê', 'Manuela', 'Maria', 'Mauro', 'Miguel', 'Miguel', 'Noah',
                  'Ravi', 'Ronasa', 'Sophia');

$carList = array('Chevrolet Onix', 'Hyundai HB20', 'Ford Ka (hatch)', 'Chevrolet Prisma', 'Toyota Corolla',
                 'Fiat Palio', 'Renault Sandero', 'Fiat Strada', 'Volkswagen Gol', 'Honda HR-V', 'Jeep Renegade',
                 'Hyundai HB20S', 'Volkswagen Fox', 'Fiat Toro', 'Volkswagen Up!', 'Toyota Etios (hatch)',
                 'Fiat Uno', 'Toyota Hilux', 'Volkswagen Saveiro', 'Fiat Siena / Grand Siena',
                 'Toyota Etios (sedã)', 'Fiat Mobi', 'Honda Fit', 'Ford EcoSport', 'Chevrolet S10',
                 'Volkswagen Voyage', 'Renault Duster', 'Ford Ka+ (sedã)', 'Renault Logan', 'Chevrolet Spin',
                 'Chevrolet Cobalt', 'Nissan Versa', 'Honda Civic', 'Nissan March', 'Ford New Fiesta (hatch)',
                 'Ford Ranger', 'Honda City', 'Chevrolet Montana', 'Renault Duster Oroch', 'Toyota SW4');

$maxNameId = count($nameList) - 1;
$maxCarId = count($carList) - 1;

$list = array();
for ($i = 0; $i < $num; $i++) {
    $list[] = array(
        'id' => rand(100000, 999999),
        'name' => $nameList[rand(0, $maxNameId)],
        'age' => rand(18, 100),
        'car' => $carList[rand(0, $maxCarId)],
    );
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode(array(
	'server' => 'PHP',
	'list' => $list
));

?>