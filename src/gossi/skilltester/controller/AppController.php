<?php
namespace gossi\skilltester\controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AppController implements IController {

	/* (non-PHPdoc)
	 * @see \gossi\skilltester\controller\IController::run()
	 */
	public function run(Request $request, Response $response, $parameters = array()) {
		
		$base = $request->getSchemeAndHttpHost() . $request->getBaseUrl();  
		
		$contents = file_get_contents(ROOT.'/application/build/index.html');
		$contents = str_replace('<title>',"\n\t".'<base href="'.$base.'/application/build/">'."\n\t".'<title>', $contents);
		
		$response->setContent($contents);
		
		return $response;
	}

}
