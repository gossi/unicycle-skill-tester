<?php
namespace gossi\skilltester\controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class PageController implements IController {

	/* (non-PHPdoc)
	 * @see \gossi\skilltester\controller\IController::run()
	 */
	public function run(Request $request, Response $response, $parameters = array()) {
		
		$loader = new \Twig_Loader_Filesystem(TEMPLATES);
		$twig = new \Twig_Environment($loader);
		
		$pageFolder = CONTENT . '/pages/';
		$file = $pageFolder . $parameters['page'] . '.html';
		
		if (!file_exists($file)) {
			$file = $pageFolder . '404.html';
		}
		
		$content = file_get_contents($file);
		
		$response->setContent($twig->render('page.twig', array(
			'base' => $request->getBasePath(),
			'content' => $content,
			'active' => $parameters['page'] == 'index' ? '' : $parameters['page']
		)));
		
		return $response;
	}

}
