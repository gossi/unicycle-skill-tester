<?php
namespace gossi\skilltester\controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

interface IController {

	/**
	 * 
	 * @param Request $request
	 * @param Response $response
	 * @param Array $parameters
	 * @return Response
	 */
	public function run(Request $request, Response $response, $parameters = array());
}
