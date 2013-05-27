<?php
define('ROOT', __DIR__);
require_once __DIR__ . '/vendor/autoload.php';

use gossi\skilltester\SkillTester;
use gossi\skilltester\entities\Trick;

Propel::init('conf/propel-conf.php');

$app = new SkillTester();
$app->run();
