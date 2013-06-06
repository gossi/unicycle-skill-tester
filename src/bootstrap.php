<?php
require_once __DIR__ . '/../vendor/autoload.php';

use gossi\skilltester\SkillTester;
use gossi\skilltester\entities\Trick;

define('SRC', ROOT . '/src');
define('TEMPLATES', SRC . '/gossi/skilltester/views');
define('CONTENT', ROOT . '/content');

Propel::init(ROOT . '/conf/propel-conf.php');

$app = new SkillTester();
$app->run();