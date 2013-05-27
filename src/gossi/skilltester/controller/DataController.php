<?php
namespace gossi\skilltester\controller;

use Symfony\Component\HttpFoundation\Request;
use gossi\skilltester\entities\TrickQuery;
use gossi\skilltester\entities\ItemQuery;
use gossi\skilltester\entities\GroupQuery;
use gossi\skilltester\entities\ActionQuery;
use gossi\skilltester\entities\ActionMapQuery;
use Symfony\Component\HttpFoundation\Response;
use gossi\skilltester\entities\FeedbackQuery;

class DataController implements IController {

	/* (non-PHPdoc)
	 * @see \gossi\skilltester\controller\IController::run()
	 */
	public function run(Request $request, Response $response, $parameters = array()) {
		
		$isJs = $parameters['suffix'] === '.js';
		
		$response->headers->set('Content-Type', $isJs ? 'text/javascript' : 'application/json');
		
		$json = array();
		
		// action map
		$map = array();
		foreach (ActionMapQuery::create()->find() as $a) {
			if (!array_key_exists($a->getParentId(), $map)) {
				$map[$a->getParentId()] = array();
			}
			$map[$a->getParentId()][] = $a->getChildId();
		}
		
		// actions
		$actionMap = array();
		$actions = array();
		foreach (ActionQuery::create()->find() as $a) {
			$action = array(
				'id' => $a->getId(),
				'type' => $a->getType(),
				'title' => $a->getTitle(),
				'description' => $a->getDescription()
			);
			
			if (array_key_exists($a->getId(), $map)) {
				$action['items'] = $map[$a->getId()];
			}
				
			$actions[] = $action;
			$actionMap[$a->getId()] = $a;
		}
		$json['actions'] = $actions;
		
		
		// groups
		$groups = array();
		foreach (GroupQuery::create()->find() as $g) {
			$group = array(
				'id' => $g->getId(),
				'title' => $g->getTitle(),
				'description' => $g->getDescription()
			);
			
			$groups[] = $group;
		}
		$json['groups'] = $groups;
		
		// items
		$items = array();
		$dbItems = ItemQuery::create()->find();
		foreach ($dbItems as $item) {
			if (!array_key_exists($item->getTrickId(), $items)) {
				$items[$item->getTrickId()] = array();
			}
			
			if (!array_key_exists($item->getGroupId(), $items[$item->getTrickId()])) {
				$items[$item->getTrickId()][$item->getGroupId()] = array();
			}
			
			$items[$item->getTrickId()][$item->getGroupId()][] = $item->getActionId();
		}
		
		// feedback
		$feedback = array();
		foreach (FeedbackQuery::create()->leftJoinValue()->innerJoinAction()->find() as $f) {
			if (!array_key_exists($f->getTrickId(), $feedback)) {
				$feedback[$f->getTrickId()] = array();
			}
			
			$obj = array();
			
			$pc = $f->getPercent();
			if (isset($pc)) {
				$obj['percent'] = $pc;
			}
			
			$max = $f->getMax();
			if (isset($max)) {
				$obj['max'] = $max;
			}
			
			$inv = $f->getInverted();
			if (isset($inv)) {
				$obj['inverted'] = $inv;
			}
			
			$mistake = $f->getMistake();
			if (isset($mistake)) {
				$obj['mistake'] = $mistake;
			}
			
			// values
			$values = array();
			foreach ($f->getValues() as $v) {
				if ($f->getAction()->getType() === 'boolean') {
					$values[$v->getRange()] = $v->getText();
				} else {
					$val = array();
					
					$text = $v->getText();
					if (isset($text)) {
						$val['feedback'] = $text;
					}
					
					$mistake = $v->getMistake();
					if (isset($mistake)) {
						$val['mistake'] = $mistake;
					}
					
					$value = $v->getValue();
					if (isset($value)) {
						$val['value'] = $value;
					}

					$values[$v->getRange()] = (object) $val;
				}
			}
			
			if (count($values)) {
				$obj['values'] = (object) $values;
			}
			
			$feedback[$f->getTrickId()][$f->getActionId()] = (object)$obj;
		}
		
		// tricks
		$tricks = array();
		foreach (TrickQuery::create()->orderByTitle(\Criteria::ASC)->find() as $t) {
			$trick = array(
				'title' => $t->getTitle(),
				'items' => $items[$t->getId()]
			);
			
			if (array_key_exists($t->getId(), $feedback)) {
				$trick['feedback'] = $feedback[$t->getId()];
			}
			
			$tricks[] = $trick;
		}
		
		$json['tricks'] = $tricks;
		
		$plainJson = json_encode($json);
		$response->setContent($isJs ? 'var data = ' . $plainJson : $plainJson);
		
		return $response;
	}

}
