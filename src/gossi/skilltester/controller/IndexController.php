<?php
namespace gossi\skilltester\controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class IndexController implements IController {

	/* (non-PHPdoc)
	 * @see \gossi\skilltester\controller\IController::run()
	 */
	public function run(Request $request, Response $response, $parameters = array()) {
		
		$response->setContent('index');
		
		return $response;
	}

}
