<?php
namespace gossi\skilltester;

use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Symfony\Component\HttpFoundation\Response;

class SkillTester {
	private $routes;
	
	public function __construct() {
		
		// create routes
		$this->routes = new RouteCollection();
		
		$this->routes->add('index', new Route('/', array(
			'controller' => 'gossi\\skilltester\\controller\\IndexController'
		)));
		
		$this->routes->add('app', new Route('/app', array(
			'controller' => 'gossi\\skilltester\\controller\\AppController'
		)));
		
		$this->routes->add('data', new Route('/data{suffix}', array(
			'controller' => 'gossi\\skilltester\\controller\\DataController',
			'suffix' => '.json'
		)));
		
		$this->routes->add('insert', new Route('/_insert', array(
			'controller' => 'gossi\\skilltester\\controller\\InsertController'
		)));
	}
	
	public function run() {
		$response = new Response('', 200, array('Content-Type' => 'text/html'));
		$response->setCharset('utf-8');
		
		$request = Request::createFromGlobals();
		
		$context = new RequestContext();
		$context->fromRequest($request);
		
		$matcher = new UrlMatcher($this->routes, $context);
		
		try {
			$parameters = $matcher->match($request->getPathInfo());
			
			if (array_key_exists('controller', $parameters)) {
				$controller = new $parameters['controller']();
				$response = $controller->run($request, $response, $parameters);
			}
			
		} catch(ResourceNotFoundException $e) {
			$response->setStatusCode(404);
		}
		
		$response->prepare($request);
		$response->send();
	}
}