<?php
namespace gossi\skilltester\controller;

use Symfony\Component\HttpFoundation\Request;
use gossi\skilltester\entities\ActionQuery;
use gossi\skilltester\entities\Action;
use gossi\skilltester\entities\Group;
use gossi\skilltester\entities\Trick;
use gossi\skilltester\entities\ActionMap;
use gossi\skilltester\entities\Item;
use gossi\skilltester\entities\GroupQuery;
use gossi\skilltester\entities\TrickQuery;
use gossi\skilltester\entities\ActionMapQuery;
use gossi\skilltester\entities\ItemQuery;
use Symfony\Component\HttpFoundation\Response;
use gossi\skilltester\entities\Feedback;
use gossi\skilltester\entities\Value;

class PopulateController implements IController {

	/* (non-PHPdoc)
	 * @see \gossi\skilltester\controller\IController::run()
	 */
	public function run(Request $request, Response $response, $parameters = array()) {
		
		$response->setContent('populate data');
		
		// truncate first:
		foreach (array('action', 'action_i18n', 'action_map', 'trick', 'item', 'group', 'group_i18n', 'feedback', 'value', 'value_i18n') as $tbl) {
			\Propel::getConnection('skilltester')->exec('TRUNCATE TABLE `' . $tbl. '`');
		}

		$this->createActions();
		$this->createGroups();
		$this->createTricks();
		
		return $response;
	}
		
	private function createActions() {
		// 1
		$a = new Action();
		$a->setTitle("Beine Durchstrecken");
		$a->setDescription('Die Beine drücken den Oberkörper nach oben');
		$a->save();
		
		// 2
		$a = new Action();
		$a->setTitle('Hebeln mit dem Oberkörper');
		$a->setDescription('Der Oberkörper knickt an der Hüfte ein, um ihn dann noch oben zu beschleunigen. Mit dem Schwung wird der ganze Körper aufgerichtet.');
		$a->save();
		
		// 3
		$a = new Action();
		$a->setTitle('Hand drückt am Sattel hoch');
		$a->setDescription('Mit der Hand wird gegen den Sattel gedrückt um den Körper aufzurichten.');
		$a->save();
		
		// 4
		$a = new Action();
		$a->setTitle('Hand am Sattel?');
		$a->setDescription('Eine Hand hält den Sattel vorne am Griff fest.');
		$a->save();
		
		// 5
		$a = new Action();
		$a->setType('int');
		$a->setTitle('Umdrehungen pro Minute');
		$a->setDescription('Die Geschwindigkeit gemessen an den Umdrehungen pro Minute<br>Anmerkung: Erst auf die Geschwindigkeit achten, wenn die restlichen Angaben stimmen.');
		$a->save();
		
		// 6
		$a = new Action();
		$a->setTitle('Ist das Bein durchgestreckt?');
		$a->setDescription('Muskelspannung im Bein ist wahrnehmbar. Von der Hüfte bis zur Fußspitze gleicht das Bein einem Holzbein.');
		$a->save();
		
		// 7
		$a = new Action();
		$a->setType('radio');
		$a->setTitle('Fußspitze');
		$a->setDescription('Ausprägung der Fußspitze.');
		$a->save();
		
		// 8 toe-none
		$a6 = new Action();
		$a6->setTitle('Nichts');
		$a6->setDescription('Keine wirkliche Muskelaktivität; die Fußspitze labbert.');
		$a6->save();
		
		// 9 point
		$a7 = new Action();
		$a7->setTitle('Point');
		$a7->setDescription('Die Fußspitze ist durchgestreckt. Die Wadenmuskulatur ist sichtbar konrahiert und von Fußspitze zum Knie ergibt sich eine gerade Linie.');
		$a7->save();
		
		// 10 flex
		$a8 = new Action();
		$a8->setTitle('Flex');
		$a8->setDescription('Die Fußspitze ist angezogen. Die Wadenmuskulatur ist sichtbar gedehnt und der Schienbeinmuskel kontrahiert.');
		$a8->save();
		
		$map = new ActionMap();
		$map->setParentId(7)->setChildId(8)->save();
		
		$map = new ActionMap();
		$map->setParentId(7)->setChildId(9)->save();
		
		$map = new ActionMap();
		$map->setParentId(7)->setChildId(10)->save();
		
		
		// 11
		$a = new Action();
		$a->setType('radio');
		$a->setTitle('Füße aufsetzen');
		$a->setDescription('Wie werden die Füße aufgesetzt?');
		$a->save();
		
		// 12
		$a = new Action();
		$a->setTitle('Fußspitze aufsetzen');
		$a->setDescription('Die Fußspitzen werden zuerst auf den Reifen aufgesetzt.');
		$a->save();
		
		// 13
		$a = new Action();
		$a->setTitle('Fersen aufsetzen');
		$a->setDescription('Die Fersen werden zuerst auf den Reifen aufgesetzt.');
		$a->save();
		
		$map = new ActionMap();
		$map->setParentId(11)->setChildId(12)->save();
		
		$map = new ActionMap();
		$map->setParentId(11)->setChildId(13)->save();

		// 14
		$a = new Action();
		$a->setTitle('Füße abrollen?');
		$a->setDescription('Die Füße werden mit den Fußspitzen aufgesetzt, über den ganzen Fuß abgerollt und die Ferse verlässt den Reifen.');
		$a->save();
		
		// 15
		$a = new Action();
		$a->setType('radio');
		$a->setTitle('Oberkörperposition');
		$a->setDescription('');
		$a->save();
		
		// 16
		$a = new Action();
		$a->setTitle('Oberkörper ist eingeklappt');
		$a->setDescription('Oberkörper ist eingeklappt und hängt vor der gedachten Verlängerung der Sattelstütze.');
		$a->save();
		
		// 17
		$a = new Action();
		$a->setTitle('In Verlängerung der Sattelstütze (Dorsalextension)');
		$a->setDescription('Der Oberkörper ist die Verlängerung der Sattelstütze.');
		$a->save();
		
		// 18
		$a = new Action();
		$a->setTitle('Oberkörper knickt nach hinten weg (Dorsalflexion)');
		$a->setDescription('Der Oberkörper knickt nach hinten weg, die Verlängerung der Sattelstütze läuft vor dem Gesicht vorbei.');
		$a->save();
		
		$map = new ActionMap();
		$map->setParentId(15)->setChildId(16)->save();
		
		$map = new ActionMap();
		$map->setParentId(15)->setChildId(17)->save();
		
		$map = new ActionMap();
		$map->setParentId(15)->setChildId(18)->save();

		// 19
		$a = new Action();
		$a->setType('radio');
		$a->setTitle('Schulterposition');
		$a->setDescription('Welche Ausprägung hat die Schulter?');
		$a->save();
		
		// 20
		$a = new Action();
		$a->setTitle('Nach Innen rotiert');
		$a->setDescription('Die Schultern sind nach innen rotiert (meistens angezeigt indem die Handflächen nach unten zeigen).');
		$a->save();
		
		// 21
		$a = new Action();
		$a->setTitle('Nach Außen rotiert');
		$a->setDescription('Die Schultern sind nach außen rotiert (meistens angezeigt indem die Handflächen nach oben zeigen).');
		$a->save();
		
		$map = new ActionMap();
		$map->setParentId(19)->setChildId(20)->save();
		
		$map = new ActionMap();
		$map->setParentId(19)->setChildId(21)->save();
		
		// 22
		$a = new Action();
		$a->setTitle('Arme durchgestreckt?');
		$a->setDescription('Die Arme sind durchgestreckt und Muskelspannung ist deutlich erkennbar.');
		$a->save();
		
		// 23
		$a = new Action();
		$a->setType('radio');
		$a->setTitle('Handflächen');
		$a->setDescription('Wohin zeigen die Handflächen?');
		$a->save();
		
		// 24
		$a = new Action();
		$a->setTitle('Handflächen zeigen nach unten');
		$a->setDescription('');
		$a->save();
		
		// 25
		$a = new Action();
		$a->setTitle('Handflächen zeigen nach oben');
		$a->setDescription('');
		$a->save();
		
		$map = new ActionMap();
		$map->setParentId(23)->setChildId(24)->save();
		
		$map = new ActionMap();
		$map->setParentId(23)->setChildId(25)->save();
		
		// 26
		$a = new Action();
		$a->setType('radio');
		$a->setTitle('Standfußposition');
		$a->setDescription('Mit dem Standfuß, ist der Fuß gemeint, der nur auf der Gabel steht');
		$a->save();
		
		// 27
		$a = new Action();
		$a->setTitle('Fußspitze');
		$a->setDescription('Der Standfuß steht mit der Fußspitze auf der Gabel, womöglich sogar auf Zehenspitzen.');
		$a->save();
		
		// 28
		$a = new Action();
		$a->setTitle('Mittlerer Fuß');
		$a->setDescription('Der Standfuß sitzt hinter dem Fußballen auf der Gabel auf. Fußspitze und Ferse können die Gabel vorne und hinten \'überlappen\'.');
		$a->save();
		
		// 29
		$a = new Action();
		$a->setTitle('Ferse');
		$a->setDescription('Der Standfuß sitzt mit der Ferse auf der Gabel.');
		$a->save();
		
		$map = new ActionMap();
		$map->setParentId(26)->setChildId(27)->save();
		
		$map = new ActionMap();
		$map->setParentId(26)->setChildId(28)->save();
		
		$map = new ActionMap();
		$map->setParentId(26)->setChildId(29)->save();
		
		// 30
		$a = new Action();
		$a->setType('radio');
		$a->setTitle('Kontrollfußposition');
		$a->setDescription('Mit dem Kontrollfuß ist der Fuß gemeint, der auf dem Reifen aufsetzt.');
		$a->save();
		
		// 31
		$a = new Action();
		$a->setTitle('Nur auf dem Reifen');
		$a->setDescription('Der Kontrollfuß setzt nur auf dem Reifen auf.');
		$a->save();
		
		// 32
		$a = new Action();
		$a->setTitle('Auf dem Reifen und hinter den Fußballen auf der Gabel');
		$a->setDescription('Der Kontrollfuß setzt mit den Zehenspitzen auf dem Reifen auf. Hinter den Fußballen setzt der Fuß auf der Gabel auf.');
		$a->save();
		
		// 33
		$a = new Action();
		$a->setTitle('Auf dem Reifen und mit der Ferse auf der Gabel');
		$a->setDescription('Der Kontrollfuß setzt mit den Zehenspitzen auf dem Reifen auf. Mit der Ferse setzt der Fuß auf der Gabel auf.');
		$a->save();
		
		$map = new ActionMap();
		$map->setParentId(30)->setChildId(31)->save();
		
		$map = new ActionMap();
		$map->setParentId(30)->setChildId(32)->save();
		
		$map = new ActionMap();
		$map->setParentId(30)->setChildId(33)->save();
		
		// 34
		$a = new Action();
		$a->setTitle('Hüftrotation?');
		$a->setDescription('Ist das Hüftgelenk rotiert?');
		$a->save();
		
		// 35
		$a = new Action();
		$a->setTitle('Bein Parallel zum Boden?');
		$a->setDescription('Ist das gestreckte Bein mindestens Parallel zum Boden?');
		$a->save();
		
		// 36
		$a = new Action();
		$a->setType('int');
		$a->setTitle('Bein-Rumpf-Winkel rückenseits (Dorsalflexion) [°]');
		$a->setDescription('Der Winkel zwischen dem gestreckten Bein und dem Rücken.');
		$a->save();
		
		// 37
		$a = new Action();
		$a->setTitle('Schulter und Hüfte auf einer Linie?');
		$a->setDescription('Sind (seitliche betrachtet) die Schultern und Hüften auf einer Linie oder sind die Schultern verzogen?');
		$a->save();
		
		// 38
		$a = new Action();
		$a->setType('int');
		$a->setTitle('Arm-Rumpf-Winkel');
		$a->setDescription('Wie hoch wird der Arm gehalten? Der Winkel zwischen Oberkörper und dem Arm.');
		$a->save();
		
		// 39
		$a = new Action();
		$a->setType('radio');
		$a->setTitle('Beinposition');
		$a->setDescription('Wo befindet sich das freie Bein? (seitl. betrachtet)');
		$a->save();
		
		// 40
		$a = new Action();
		$a->setTitle('Vor dem Oberkörper');
		$a->setDescription('');
		$a->save();
		
		// 41
		$a = new Action();
		$a->setTitle('In einer Linie mit dem Oberkörper');
		$a->setDescription('');
		$a->save();
		
		// 42
		$a = new Action();
		$a->setTitle('Hinter dem Oberkörper');
		$a->setDescription('');
		$a->save();
		
		$map = new ActionMap();
		$map->setParentId(39)->setChildId(40)->save();
		
		$map = new ActionMap();
		$map->setParentId(39)->setChildId(41)->save();
		
		$map = new ActionMap();
		$map->setParentId(39)->setChildId(42)->save();
		
		// 43
		$a = new Action();
		$a->setTitle('Runder Tritt?');
		$a->setDescription('Ein sauberer, runder nicht abgehakter, stockender oder stotternder Tritt?');
		$a->save();
		
		// 44
		$a = new Action();
		$a->setTitle('Walking-Rhythmus');
		$a->setDescription('Ist der \'Walking\' Rhythmus kontinuerlich, im gleichen Tempo und ruhig? In keinem Fall hektisch. Sollte audiovisuell wahrnehmbar sein.');
		$a->save();
		
		// 45
		$a = new Action();
		$a->setType('int');
		$a->setTitle('Bein-Winkel');
		$a->setDescription('Der Winkel zwischen beiden Beinen.');
		$a->save();
		
		// 46
		$a = new Action();
		$a->setType('radio');
		$a->setTitle('Pedalaufsatz');
		$a->setDescription('Wo setzen die Füße/der Fuß auf den Pedalen/dem Pedal auf?');
		$a->save();
		
		// 47
		$a = new Action();
		$a->setTitle('Mit der Fußspitze');
		$a->setDescription('Die Fußspitze setzt auf dem Pedal auf.');
		$a->save();
		
		// 48
		$a = new Action();
		$a->setTitle('Mit dem Fußballen');
		$a->setDescription('Der Fußballen setzt auf dem Pedal auf.');
		$a->save();
		
		// 49
		$a = new Action();
		$a->setTitle('Mit der Fußmitte');
		$a->setDescription('Die Fußmitte setzt auf dem Pedal auf.');
		$a->save();
		
		// 50
		$a = new Action();
		$a->setTitle('Mit der Ferse');
		$a->setDescription('Die Ferse setzt auf dem Pedal auf.');
		$a->save();
		
		$map = new ActionMap();
		$map->setParentId(46)->setChildId(47)->save();
		$map = new ActionMap();
		$map->setParentId(46)->setChildId(48)->save();
		$map = new ActionMap();
		$map->setParentId(46)->setChildId(49)->save();
		$map = new ActionMap();
		$map->setParentId(46)->setChildId(50)->save();

		// 51
		$a = new Action();
		$a->setTitle('Oberkörperverwringung');
		$a->setDescription('Der Oberkörper wird verwringt. Dabei zieht die äußere Schulter nach vorne und die innere Schulter nach hinten.');
		$a->save();
		
		// 52
		$a = new Action();
		$a->setTitle('Hüfttranslation');
		$a->setDescription('Die Hüfte wird seitlich zum gedachten Kreismittelpunkt geschoben');
		$a->save();
		
		// 53
		$a = new Action();
		$a->setTitle('Hüftrotation');
		$a->setDescription('Die Hüfte wird verdreht. Das Hüftäußere zieht nach vorne, das Hüftinnere drückt nach hinten.');
		$a->save();
		
		// 54
		$a = new Action();
		$a->setTitle('Rudern der Arme');
		$a->setDescription('Die Arme rudern den Kreis. Dabei schieben beide Arme (meistens parallel) einen unsichtbaren Gegenstand von der Mitte nach Außen.');
		$a->save();
		
		// 55
		$a = new Action();
		$a->setTitle('Fall &amp; Recovery');
		$a->setDescription('Bei Fall &amp; Recovery steht der Fahrer zunächst still (womöglich sind auch die Beine durchgestreckt), lässt sich dann fallen (Fall), fängt sich (Recovery) in eine der o.g. Position und beginnt die Kreisfahrt.');
		$a->save();
		
// 		//
// 		$a = new Action();
// 		$a->setTitle('');
// 		$a->setDescription('');
// 		$a->save();
	}
	
	private function createGroups() {
		// 1
		$g = new Group();
		$g->setTitle("Körperspannung");
		$g->save();
		
		// 2
		$g = new Group();
		$g->setTitle("Ästhetik");
		$g->save();
		
		// 3
		$g = new Group();
		$g->setTitle("Bewegungskontrolle");
		$g->save();
		
		// 4
		$g = new Group();
		$g->setTitle("Körper Aufrichten");
		$g->save();
		
		// 5
		$g = new Group();
		$g->setTitle("Geschwindigkeit");
		$g->save();
		
		// 6
		$g = new Group();
		$g->setTitle("Fortbewegung");
		$g->setDescription('Erzeugung kinetischer Energie');
		$g->save();
		
		// 7
		$g = new Group();
		$g->setTitle("Gleichgewicht");
		$g->save();
		
		// 8
		$g = new Group();
		$g->setTitle("Drehmoment");
		$g->save();
	}
	
	private function createTricks() {
		$this->createWheelWalk();
		$this->createWheelWalk1ft();
		$this->createArabesque();
		$this->createSpin();
		$this->createSpin1ft();
		$this->createCoasting1ftExt();
		$this->create1ft();
		$this->createRiding();
		$this->createRidingCurve();
		$this->createGliding();
		$this->create1ftWWtoSW();
		$this->createGlidingToStandgliding();
		$this->createAerial();
		$this->createUnispin();
		$this->createHoWAerial();
		$this->createSoSSwing();
		$this->createSoSKick();
		$this->createHoWSwing();
		$this->createHoWKick();
		$this->createStandwalk();
	}

	private function createArabesque() {
		// Arabesque
		$t = new Trick();
		$t->setTitle('Arabesque');
		$t->save();
			
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(6)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(7)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(4)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(30)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(34)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(35)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(36)->save();
			
		// feedback
			
		// beinstreckung
		$f = new Feedback();
		$f->setTrick($t)->setActionId(6)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Nene, das Bein gehört durchgestreckt, wenn es frei hängt!')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Genau, das Bein gehört durchgestreckt, wenn es frei hängt! Du machst es super')->save();
			
		// fußspitze
		$f = new Feedback();
		$f->setTrick($t)->setActionId(7)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(8)->setText('Da ist ja garnix los im Fuß! Die Fußspitze gehört mit dem Bein gestreckt')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(9)->setText('Yes! Die Fußspitze gehört zur Beinstreckung dazu. Läuft.')->setValue(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(10)->setText('Da ist zwar Power in der Fußspitze, aber die in der falschen Richtung. Durchstrecken, nicht anziehen.')->setValue(0)->save();
			
		// hand am sattel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(4)->setInverted(true)->setMistake('fatal')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Keine Hand am Sattel? Bombe! So gehörts, Hand am Sattel ist für Luschen.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Hand am Sattel zerstört genau das, was eigtl. trainiert werden soll, nämlich die Kontrolle des Einrads über mittels des Fußes. Hand am Sattel zerlegt auf lange Sicht den Fahrer. Hand am Sattel = ULTRAFAIL!')->save();
		
		// kontrollfuß
		$f = new Feedback();
		$f->setTrick($t)->setActionId(30)->setMax(5)->save();

		$v = new Value();
		$v->setFeedback($f)->setRange(31)->setText('Wenn der Fuß nicht auf der Gabel aufsetzt, kann er das Einrad nicht kontrollieren. Beste Position ist hier der Fuß mit Zehenspitzen auf dem Reifen und hinter den Fußballen setzt er auf der Gabel auf um darüber die Neigung des Einrads zu kontrollieren.')->setValue(0)->setMistake('fatal')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(32)->setText('Der Kontrollfuß steuert das Einrad. Der Konztollfuß sitzt hinter den Fußballen auf der Gabel auf und kann durch absenken der Ferse das Einrad nach vorne drücken bzw. durch absenken der Fußspitze nach hinten und darüber die Neigung des Einrads kontrollieren.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(33)->setText('Wenn der Fuß nicht auf der Gabel aufsetzt, kann er das Einrad nicht kontrollieren. Beste Position ist hier der Fuß mit Zehenspitzen auf dem Reifen und hinter den Fußballen setzt er auf der Gabel auf um darüber die Neigung des Einrads zu kontrollieren. Setzt aber die Ferse auf kann das Einrad nicht nach vorne geneigt werden.')->setValue(0)->setMistake('fatal')->save();
			
		// hüftrotation
		$f = new Feedback();
		$f->setTrick($t)->setActionId(34)->setInverted(true)->setMistake('conceptual')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Genau, eine Hüftrotation kommt bei der Arabesque nicht vor. Sondern eine Bogenspannung im Rücken.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Hüfte aufgedreht? Total falsch. Bei der Arabesque geht es um die Bogenspannung im Rücken, da kann keine Rotation im Hüftgelenk auftauchen.')->save();
			
		// bein parallel zum boden?
		$f = new Feedback();
		$f->setTrick($t)->setActionId(35)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Hoch das Beinchen! Mindestens parallel zum Boden.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Ok, Mindesthöhe für das Bein ist erreicht.')->save();
		
		// dorsalflexion
		$f = new Feedback();
		$f->setTrick($t)->setActionId(36)->setPercent(20)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange('>180')->setText('Uuh jee, das ist noch nichtmal in der Nähe von der Bogenspannung im Rücken')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange('160-180')->setText('Naja, viel ist es ja noch nicht.')->setValue(1)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange('130-161')->setText('Dort fängt der Bereich mit Bogenspannung an. Es wird.')->setValue(3)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange('105-131')->setText('Das ist jetzt der Bereich für die Arabesque.')->setValue(4)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange('<104')->setText('Eine Arabesque in voller Blüte!')->setValue(5)->save();
	}
	
	private function createWheelWalk() {
		// Wheel Walk
		$t = new Trick();
		$t->setTitle('Wheel Walk');
		$t->save();
		
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(6)->setActionId(11)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(6)->setActionId(14)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(7)->setActionId(15)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(19)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(22)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(23)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(6)->setActionId(44)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(44)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(44)->save();
		
		// feedback
			
		// füße aufsetzen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(11)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(12)->setText('Sehr schön, die Fußspitzen setzen zuerst auf.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(13)
		->setText('Die Fußspitzen sollen zuerst aufsetzen, nicht die Fersen. Andere Tricks brauchen das in der Reihenfolge.')
		->setValue(0)
		->setMistake('fatal')->save();
			
		// füße abrollen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(14)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Sehr schön, die Fußspitzen setzen zuerst auf und der ganze Fuß rollt über den Reifen ab.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Die Fußspitzen sollen zuerst aufsetzen und den ganzen Fuß über den Reifen abrollen.')->save();
			
		// oberkörper
		$f = new Feedback();
		$f->setTrick($t)->setActionId(15)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(16)->setText('Dein Oberkörper ist \'n bisschen weit zu vorne, mehr nach hinten.')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(17)->setText('Alles bestens mit deinem Oberkörper.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(18)->setText('Dein Oberkörper ist \'n bisschen zu weit hinten, mehr nach vorne.')->setValue(0)->save();
			
		// schultern
		$f = new Feedback();
		$f->setTrick($t)->setActionId(19)->setMax(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(20)->setText('Durch die Innenrotierten Schultern, musst du zusätzlich Körperspannung im Rücken aufbauen, um die Oberkörperposition zu stabilisieren. Rotiere die Schultern nach außen, das hilft dir dabei.')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(21)->setText('Außenrotierte Schulter unterstützen die Oberkörperposition, das machst du gut so.')->setValue(5)->save();
			
		// arme
		$f = new Feedback();
		$f->setTrick($t)->setActionId(22)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Sehr schön, durchgestreckte Arme zeigen Körperspannung und zeugen von einem ausgeprägten Kraftpotential.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Schon zu schwach die Ämrchen durchzustrecken? Das ist aber mehr drinne.')->save();
		
		// handflächen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(23)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(24)->setText('Mit Handflächen nach unten signalisierst du dem Zuschauer du hast keine Interesse an der Kommunikation mit ihm. Hat er dann noch Interesse dir zuzuschauen?')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(25)->setText('Mit Handflächen nach oben signalisierst du dem Zuschauer deine Kommunikationsbereitschaft und erzählst ihm so, der Zuschauer sei dir nicht egal, gut so.')->setValue(5)->save();
		
		// walking-rhythmus
		$f = new Feedback();
		$f->setTrick($t)->setActionId(44)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Super, ein kontinuierliche Bewegung der Füße sieht nicht nur gut aus, sondern erlaubt auch eine leichtere Kontrolle des Tricks und verleiht dem Trick etwas Majestätisches.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Deine Füße sind wohl noch etwas durcheinander. Nimm dir für jeden Schritt Zeit.')->save();
	}
	
	private function createWheelWalk1ft() {
		// Wheel Walk 1ft
		$t = new Trick();
		$t->setTitle('1ft Wheel Walk');
		$t->save();
	
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(6)->setActionId(11)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(6)->setActionId(14)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(7)->setActionId(15)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(19)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(22)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(23)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(6)->setActionId(44)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(44)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(44)->save();
	
		// feedback
			
		// füße aufsetzen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(11)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(12)->setText('Sehr schön, die Fußspitzen setzen zuerst auf.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(13)
		->setText('Die Fußspitzen sollen zuerst aufsetzen, nicht die Fersen. Andere Tricks brauchen das in der Reihenfolge.')
		->setValue(0)
		->setMistake('fatal')->save();
			
		// füße abrollen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(14)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Sehr schön, die Fußspitzen setzen zuerst auf und der ganze Fuß rollt über den Reifen ab.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Die Fußspitzen sollen zuerst aufsetzen und den ganzen Fuß über den Reifen abrollen.')->save();
			
		// oberkörper
		$f = new Feedback();
		$f->setTrick($t)->setActionId(15)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(16)->setText('Dein Oberkörper ist \'n bisschen weit zu vorne, mehr nach hinten.')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(17)->setText('Alles bestens mit deinem Oberkörper.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(18)->setText('Dein Oberkörper ist \'n bisschen zu weit hinten, mehr nach vorne.')->setValue(0)->save();
			
		// schultern
		$f = new Feedback();
		$f->setTrick($t)->setActionId(19)->setMax(5)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(20)->setText('Durch die Innenrotierten Schultern, musst du zusätzlich Körperspannung im Rücken aufbauen, um die Oberkörperposition zu stabilisieren. Rotiere die Schultern nach außen, das hilft dir dabei.')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(21)->setText('Außenrotierte Schulter unterstützen die Oberkörperposition, das machst du gut so.')->setValue(5)->save();
			
		// arme
		$f = new Feedback();
		$f->setTrick($t)->setActionId(22)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Sehr schön, durchgestreckte Arme zeigen Körperspannung und zeugen von einem ausgeprägten Kraftpotential.')->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Schon zu schwach die Ämrchen durchzustrecken? Das ist aber mehr drinne.')->save();
	
		// handflächen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(23)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(24)->setText('Mit Handflächen nach unten signalisierst du dem Zuschauer du hast keine Interesse an der Kommunikation mit ihm. Hat er dann noch Interesse dir zuzuschauen?')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(25)->setText('Mit Handflächen nach oben signalisierst du dem Zuschauer deine Kommunikationsbereitschaft und erzählst ihm so, der Zuschauer sei dir nicht egal, gut so.')->setValue(5)->save();
	
		// walking-rhythmus
		$f = new Feedback();
		$f->setTrick($t)->setActionId(44)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Super, ein kontinuierliche Bewegung im Fuß sieht nicht nur gut aus, sondern erlaubt auch eine leichtere Kontrolle des Tricks und verleiht dem Trick etwas Majestätisches.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Deine Fuß ist wohl noch etwas zickig. Nimm dir für jeden Schritt Zeit.')->save();
	}

	private function createSpin() {
		// Spin
		$t = new Trick();
		$t->setTitle('Spin');
		$t->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(5)->setActionId(5)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(37)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(19)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(22)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(23)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(38)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(43)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(43)->save();
		
		// feedback
			
		// schultern
		$f = new Feedback();
		$f->setTrick($t)->setActionId(19)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(20)->setText('Durch die Innenrotierten Schultern, musst du zusätzlich Körperspannung im Rücken aufbauen, um die Oberkörperposition zu stabilisieren. Rotiere die Schultern nach außen, das hilft dir dabei.')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(21)->setText('Außenrotierte Schulter unterstützen die Oberkörperposition, das machst du gut so.')->setValue(5)->save();
			
		// schultern über hüfte
		$f = new Feedback();
		$f->setTrick($t)->setActionId(37)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Sehr schön, dein Rücken stabilisiert den Spin.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Dein Oberkörper verwringt sich und dadurch kann auch der Rücken keine vernünftige Körperspannung mehr aufbauen. Positioniere die Schultern wieder über den Hüften und stabilisere mit dem Rücken den Spin.')->save();
			
		// arme
		$f = new Feedback();
		$f->setTrick($t)->setActionId(22)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Sehr schön, durchgestreckte Arme zeigen Körperspannung und zeugen von einem ausgeprägten Kraftpotential.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Schon zu schwach die Ämrchen durchzustrecken? Das ist aber mehr drinne.')->save();
			
		// handflächen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(23)->setMax(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(24)->setText('Mit Handflächen nach unten signalisierst du dem Zuschauer du hast keine Interesse an der Kommunikation mit ihm. Hat er dann noch Interesse dir zuzuschauen?')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(25)->setText('Mit Handflächen nach oben signalisierst du dem Zuschauer deine Kommunikationsbereitschaft und erzählst ihm so, der Zuschauer sei dir nicht egal, gut so.')->setValue(5)->save();
			
		// arw
		$f = new Feedback();
		$f->setTrick($t)->setActionId(38)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange("<89")->setText('Keine Kraft den Arm zu heben? Wenn doch, zeig das, indem der Arm so gehalten wird, dass die Hände etwa auf Augenhöhe sind (natürlich bei gestrecktem Arm)')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange("90-110")->setText('Das ist die optimale Armposition, so dass die Hände (natürlich bei gestrecktem Arm) etwa auf Augenhöhe sind.')->setValue(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(">110")->setText('Es ist zwar etwas unorthodox die Arme soweit in den Himmel zu strecken (was machen sie denn da oben?), aber völlig ok :)')->setValue(5)->save();
			
		// rpm
		$f = new Feedback();
		$f->setTrick($t)->setActionId(5)->setMax(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("<45")->setText('Das ist noch ein wenig zu gemütlich, da ist aber zum Glück noch viel Luft nach oben.')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("45-60")->setText('Du fährst den Spin mit Basisgeschwindigkeit. Kannst aber noch ne große Schippe drauflegen.')->setValue(1)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange("61-80")->setText('Oha, dein Spin ist ja schon ein bisschen schnell - Geb noch weiter Gas!')->setValue(2)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("81-100")->setText('Nun, dein Spin hat ja schon eine Stramme Geschwindigkeit, ein bisschen mehr geht noch!')->setValue(3)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange("101-120")->setText('Das ist ja mal ein Spin mit Dampf!')->setValue(4)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(">120")->setText('Boah Krass, ein Spin mit Volldampf!')->setValue(5)->save();
			
		// runder tritt
		$f = new Feedback();
		$f->setTrick($t)->setActionId(43)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Immer schön ruhig treten, wie ein Uhrwerk.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Der unrunde Tritt ist für den Spin sehr ungünstig, da alle Stöße vom Oberkörper kompensiert werden müssen. Besser langsamer drehen, dafür runder treten, das Tempo langsam steigern.')->save();
		
	}

	private function createSpin1ft() {
		// Spin 1ft ext
		$t = new Trick();
		$t->setTitle('Spin 1ft ext');
		$t->save();
		
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(6)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(7)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(37)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(19)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(22)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(23)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(38)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(39)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(43)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(43)->save();
			
		// feedback
			
		// beinstreckung
		$f = new Feedback();
		$f->setTrick($t)->setActionId(6)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Nene, das Bein gehört durchgestreckt, wenn es frei hängt!')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Genau, das Bein gehört durchgestreckt, wenn es frei hängt! Du machst es super')->save();
		
		// fußspitze
		$f = new Feedback();
		$f->setTrick($t)->setActionId(7)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(8)->setText('Da ist ja garnix los im Fuß! Die Fußspitze gehört mit dem Bein gestreckt')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(9)->setText('Yes! Die Fußspitze gehört zur Beinstreckung dazu. Läuft.')->setValue(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(10)->setText('Da ist zwar Power in der Fußspitze, aber die in der falschen Richtung. Durchstrecken, nicht anziehen.')->setValue(0)->save();
			
		// schultern
		$f = new Feedback();
		$f->setTrick($t)->setActionId(19)->setMax(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(20)->setText('Durch die Innenrotierten Schultern, musst du zusätzlich Körperspannung im Rücken aufbauen, um die Oberkörperposition zu stabilisieren. Rotiere die Schultern nach außen, das hilft dir dabei.')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(21)->setText('Außenrotierte Schulter unterstützen die Oberkörperposition, das machst du gut so.')->setValue(5)->save();
		
		// schultern über hüfte
		$f = new Feedback();
		$f->setTrick($t)->setActionId(37)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Sehr schön, dein Rücken stabilisiert den Spin.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Dein Oberkörper verwringt sich und dadurch kann auch der Rücken keine vernünftige Körperspannung mehr aufbauen. Positioniere die Schultern wieder über den Hüften und stabilisere mit dem Rücken den Spin.')->save();
		
		// arme
		$f = new Feedback();
		$f->setTrick($t)->setActionId(22)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Sehr schön, durchgestreckte Arme zeigen Körperspannung und zeugen von einem ausgeprägten Kraftpotential.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Schon zu schwach die Ämrchen durchzustrecken? Das ist aber mehr drinne.')->save();
		
		// handflächen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(23)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(24)->setText('Mit Handflächen nach unten signalisierst du dem Zuschauer du hast keine Interesse an der Kommunikation mit ihm. Hat er dann noch Interesse dir zuzuschauen?')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(25)->setText('Mit Handflächen nach oben signalisierst du dem Zuschauer deine Kommunikationsbereitschaft und erzählst ihm so, der Zuschauer sei dir nicht egal, gut so.')->setValue(5)->save();
		
		// arw
		$f = new Feedback();
		$f->setTrick($t)->setActionId(38)->setMax(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("<89")->setText('Keine Kraft den Arm zu heben? Wenn doch, zeig das, indem der Arm so gehalten wird, dass die Hände etwa auf Augenhöhe sind (natürlich bei gestrecktem Arm)')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("90-110")->setText('Das ist die optimale Armposition, so dass die Hände (natürlich bei gestrecktem Arm) etwa auf Augenhöhe sind.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(">110")->setText('Es ist zwar etwas unorthodox die Arme soweit in den Himmel zu strecken (was machen sie denn da oben?), aber völlig ok :)')->setValue(5)->save();
		
		// free leg
		$f = new Feedback();
		$f->setTrick($t)->setActionId(39)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(40)->setText('Das Bein vor dem Körper schließt von einem unausgeglichenem Kräfteverhältnis zwischen Bauch und Rücken. Versuch weniger den Bauch anzuspannen, dafür mit dem Rücken das Bein auf eine Höhe mit dem Oberkörper zu bringen.')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(41)->setText('So ist es super. Bauch- und Rückenmuskulatur bilden eine gute Balance und halten das Bein.')->setValue(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(42)->setText('Ein Bein was da hinten hängt? Da ist dann wohl keine Muskulatur am Werk, die das Bein bewegt. Durch anspannen des Bauches das Bein nach vorne bewegen und über die Rückenmuskulatur das Bein auf gleicher Höhe mit dem Oberkörper anhalten.')->setValue(0)->save();
		
		// runder tritt
		$f = new Feedback();
		$f->setTrick($t)->setActionId(43)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Immer schön ruhig treten, wie ein Uhrwerk.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Der unrunde Tritt ist für den Spin sehr ungünstig, da alle Stöße vom Oberkörper kompensiert werden müssen. Besser langsamer drehen, dafür runder treten, das Tempo langsam steigern.')->save();
	}

	private function createCoasting1ftExt() {
		// Coasting 1ft ext
		$t = new Trick();
		$t->setTitle('Coasting 1ft ext');
		$t->save();
		
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(6)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(7)->save();
			
		// feedback
		
		// beinstreckung
		$f = new Feedback();
		$f->setTrick($t)->setActionId(6)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Nene, das Bein gehört durchgestreckt, wenn es frei hängt!')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Genau, das Bein gehört durchgestreckt, wenn es frei hängt! Du machst es super')->save();
		
		// fußspitze
		$f = new Feedback();
		$f->setTrick($t)->setActionId(7)->setMax(5)->save();

		$v = new Value();
		$v->setFeedback($f)->setRange(8)->setText('Da ist ja garnix los im Fuß! Die Fußspitze gehört mit dem Bein gestreckt')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(9)->setText('Yes! Die Fußspitze gehört zur Beinstreckung dazu. Läuft.')->setValue(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(10)->setText('Da ist zwar Power in der Fußspitze, aber die in der falschen Richtung. Durchstrecken, nicht anziehen.')->setValue(0)->save();
	}

	private function create1ft() {
		$t = new Trick();
		$t->setTitle('1ft');
		$t->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(7)->setActionId(15)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(43)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(43)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(46)->save();
		
		
		// feedback
			
		// oberkörper
		$f = new Feedback();
		$f->setTrick($t)->setActionId(15)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(16)->setText('Dein Oberkörper ist \'n bisschen weit zu vorne, mehr nach hinten.')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(17)->setText('Alles bestens mit deinem Oberkörper.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(18)->setText('Dein Oberkörper ist \'n bisschen zu weit hinten, mehr nach vorne.')->setValue(0)->save();
			
		// runder tritt
		$f = new Feedback();
		$f->setTrick($t)->setActionId(43)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Immer schön ruhig treten, wie ein Uhrwerk.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Der unrunde Tritt ist für 1ft sehr ungünstig, da alle Stöße vom Oberkörper kompensiert werden müssen. Andere Tricks die sich aus dem 1ft ergeben (zum Beispiel Coasting) funktionieren mit einem störenden Tritt im Einbein erst garnicht.')->save();
		
		// Fußposition
		$f = new Feedback();
		$f->setTrick($t)->setActionId(46)->setMax(5)->save();

		$v = new Value();
		$v->setFeedback($f)->setRange(47)->setText('Da steht der Fuß ein bisschen zu weit vorne auf den Pedalen, da kann das Einrad sehr leicht wegflutschen. Setz den Fuß mit dem Fußballen auf, das ist am besten.')->setMistake('critical')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(48)->setText('Die Fußballen auf den Pedalen ist die beste Position, hier gelingen das Treten und die Kontrolle des Einrades am besten.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(49)->setText('Das ist schon ein bisschen weit hinten. Für zukünftige Tricks ungünstig. Setze den Fuß mit dem Fußballen auf die Pedale, das ist am besten.')->setMistake('critical')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(50)->setText('Dein Fußaufsatz grenzt schon beinahe an Körperverletzung. Ob bei diesem Aufsatz Probleme für die Knie entstehen ist nicht bekannt, aber vermuten tut man es. Bitte die Füße mit dem Fußballen auf die Pedale aufsetzen.')->setMistake('fatal')->setValue(0)->save();
	}
	
	private function createRiding() {
		$t = new Trick();
		$t->setTitle('Normales Fahren');
		$t->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(7)->setActionId(15)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(43)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(43)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(46)->save();
	
	
		// feedback
			
		// oberkörper
		$f = new Feedback();
		$f->setTrick($t)->setActionId(15)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(16)->setText('Dein Oberkörper ist \'n bisschen weit zu vorne, mehr nach hinten.')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(17)->setText('Alles bestens mit deinem Oberkörper.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(18)->setText('Dein Oberkörper ist \'n bisschen zu weit hinten, mehr nach vorne.')->setValue(0)->save();
			
		// runder tritt
		$f = new Feedback();
		$f->setTrick($t)->setActionId(43)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Immer schön ruhig treten, wie ein Uhrwerk.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Der unrunde Tritt ist für 1ft sehr ungünstig, da alle Stöße vom Oberkörper kompensiert werden müssen. Andere Tricks die sich aus dem 1ft ergeben (zum Beispiel Coasting) funktionieren mit einem störenden Tritt im Einbein erst garnicht.')->save();
	
		// Fußposition
		$f = new Feedback();
		$f->setTrick($t)->setActionId(46)->setMax(5)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(47)->setText('Da steht der Fuß ein bisschen zu weit vorne auf den Pedalen, da kann das Einrad sehr leicht wegflutschen. Setz den Fuß mit dem Fußballen auf, das ist am besten.')->setMistake('critical')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(48)->setText('Die Fußballen auf den Pedalen ist die beste Position, hier gelingen das Treten und die Kontrolle des Einrades am besten.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(49)->setText('Das ist schon ein bisschen weit hinten. Für zukünftige Tricks ungünstig. Setze den Fuß mit dem Fußballen auf die Pedale, das ist am besten.')->setMistake('critical')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(50)->setText('Dein Fußaufsatz grenzt schon beinahe an Körperverletzung. Ob bei diesem Aufsatz Probleme für die Knie entstehen ist nicht bekannt, aber vermuten tut man es. Bitte die Füße mit dem Fußballen auf die Pedale aufsetzen.')->setMistake('fatal')->setValue(0)->save();
	}
	
	private function createRidingCurve() {
		$t = new Trick();
		$t->setTitle('Kurve Fahren');
		$t->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(7)->setActionId(15)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(43)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(43)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(46)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(8)->setActionId(51)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(8)->setActionId(52)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(8)->setActionId(53)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(8)->setActionId(54)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(8)->setActionId(55)->save();
	
		// feedback
			
		// oberkörper
		$f = new Feedback();
		$f->setTrick($t)->setActionId(15)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(16)->setText('Dein Oberkörper ist \'n bisschen weit zu vorne, mehr nach hinten.')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(17)->setText('Alles bestens mit deinem Oberkörper.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(18)->setText('Dein Oberkörper ist \'n bisschen zu weit hinten, mehr nach vorne.')->setValue(0)->save();
			
		// runder tritt
		$f = new Feedback();
		$f->setTrick($t)->setActionId(43)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Immer schön ruhig treten, wie ein Uhrwerk.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Der unrunde Tritt ist für 1ft sehr ungünstig, da alle Stöße vom Oberkörper kompensiert werden müssen. Andere Tricks die sich aus dem 1ft ergeben (zum Beispiel Coasting) funktionieren mit einem störenden Tritt im Einbein erst garnicht.')->save();
	
		// Fußposition
		$f = new Feedback();
		$f->setTrick($t)->setActionId(46)->setMax(5)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(47)->setText('Da steht der Fuß ein bisschen zu weit vorne auf den Pedalen, da kann das Einrad sehr leicht wegflutschen. Setz den Fuß mit dem Fußballen auf, das ist am besten.')->setMistake('critical')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(48)->setText('Die Fußballen auf den Pedalen ist die beste Position, hier gelingen das Treten und die Kontrolle des Einrades am besten.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(49)->setText('Das ist schon ein bisschen weit hinten. Für zukünftige Tricks ungünstig. Setze den Fuß mit dem Fußballen auf die Pedale, das ist am besten.')->setMistake('critical')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(50)->setText('Dein Fußaufsatz grenzt schon beinahe an Körperverletzung. Ob bei diesem Aufsatz Probleme für die Knie entstehen ist nicht bekannt, aber vermuten tut man es. Bitte die Füße mit dem Fußballen auf die Pedale aufsetzen.')->setMistake('fatal')->setValue(0)->save();
		
		// Oberkörper Verwringung
		$f = new Feedback();
		$f->setTrick($t)->setActionId(51)->setInverted(true)->setMistake('fatal')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Die Oberkörperverwringung löst die Körperspannung auf, außerdem lässt sich darüber die Kreisfahrt schlecht kontrollieren. Das üben des Spins (der sich an die Kreisfahrt anschließt) wird dadurch quasi unmöglich. Korrekt ist das verschieben der Hüfte zum gedachten Kreismittelpunkt (auch wenn es sich zunächst komisch anfühlt).')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Eine Oberkörperverwringung löst nur die Körperspannung auf, ohne ist man besser dran.')->save();

		// Hüfttranslation
		$f = new Feedback();
		$f->setTrick($t)->setActionId(52)->setMistake('fatal')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('So ist es korrekt. Über die Hüftneigung lässt sich der Radius des Kreises sehr leicht kontrollieren und bietet auch die ideale Voraussetzung für den Spin.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Die Hüftneigung ist DIE Technik für die Kurve. Darüber lässt sich der Radius kontrollieren und bietet auch die ideale Voraussetzung für den Spin. Du solltest sie echt lernen.')->save();

		// Hüftrotation
		$f = new Feedback();
		$f->setTrick($t)->setActionId(53)->setInverted(true)->setMistake('fatal')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Die Hüftrotation löst die Körperspannung auf, außerdem lässt sich darüber die Kreisfahrt schlecht kontrollieren. Das üben des Spins (der sich an die Kreisfahrt anschließt) wird dadurch quasi unmöglich. Korrekt ist das verschieben der Hüfte zum gedachten Kreismittelpunkt (auch wenn es sich zunächst komisch anfühlt).')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Hüftrotation braucht man in der Kurve nicht. Korrekt ist das verschieben der Hüfte zum gedachten Kreismittelpunkt (auch wenn es sich zunächst komisch anfühlt).')->save();
		
		// Rudern
		$f = new Feedback();
		$f->setTrick($t)->setActionId(54)->setInverted(true)->setMistake('fatal')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Wir sind doch nicht im Rudersport, sondern im Einradfahren. Das Gezappel der Hände und Arme sieht nicht nur bescheuert aus, es bringt auch nix. Korrekt ist das verschieben der Hüfte zum gedachten Kreismittelpunkt (auch wenn es sich zunächst komisch anfühlt).')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Genau, wir sind doch nicht im Rudersport.')->save();
		
		// Fall & Recovery 
		$f = new Feedback();
		$f->setTrick($t)->setActionId(55)->setPercent(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Fall & Recovery ist eine sehr fortgeschrittene Methode um die Kreisfahrt einzuleiten. Sieht ziemlich geil aus.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Fall & Recovery ist eine sehr fortgeschrittene Methode um die Kreisfahrt einzuleiten. Sieht ziemlich geil aus.')->save();
	}
	
	private function createGliding() {
		$t = new Trick();
		$t->setTitle('Gliding');
		$t->save();
		
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(7)->setActionId(15)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(19)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(22)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(23)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(26)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(30)->save();
		
		// feedback

		// oberkörper
		$f = new Feedback();
		$f->setTrick($t)->setActionId(15)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(16)->setText('Dein Oberkörper ist \'n bisschen weit zu vorne, mehr nach hinten.')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(17)->setText('Alles bestens mit deinem Oberkörper.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(18)->setText('Dein Oberkörper ist \'n bisschen zu weit hinten, mehr nach vorne.')->setValue(0)->save();
			
		// schultern
		$f = new Feedback();
		$f->setTrick($t)->setActionId(19)->setMax(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(20)->setText('Durch die Innenrotierten Schultern, musst du zusätzlich Körperspannung im Rücken aufbauen, um die Oberkörperposition zu stabilisieren. Rotiere die Schultern nach außen, das hilft dir dabei.')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(21)->setText('Außenrotierte Schulter unterstützen die Oberkörperposition, das machst du gut so.')->setValue(5)->save();
			
		// arme
		$f = new Feedback();
		$f->setTrick($t)->setActionId(22)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Sehr schön, durchgestreckte Arme zeigen Körperspannung und zeugen von einem ausgeprägten Kraftpotential.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Schon zu schwach die Ämrchen durchzustrecken? Das ist aber mehr drinne.')->save();
		
		// handflächen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(23)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(24)->setText('Mit Handflächen nach unten signalisierst du dem Zuschauer du hast keine Interesse an der Kommunikation mit ihm. Hat er dann noch Interesse dir zuzuschauen?')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(25)->setText('Mit Handflächen nach oben signalisierst du dem Zuschauer deine Kommunikationsbereitschaft und erzählst ihm so, der Zuschauer sei dir nicht egal, gut so.')->setValue(5)->save();
		
		// standfuß
		$f = new Feedback();
		$f->setTrick($t)->setActionId(26)->setMax(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(27)->setText('Das ist nicht gut. Der Standfuß sollte hinter dem Fußballen auf der Gabel stehen und den Glidingfuß bei der Kontrolle des Einrades zu unterstützen. Durch Absenken der Ferse das Einrad nach vorne drücken bzw. durch Absenken der Fußspitze nach vorne und damit die Neigung des Einrads kontrollieren.')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(28)->setText('Der Standfuß unterstützt den Glidingfuß bei der Kontrolle des Einrades. Durch Absenken der Ferse das Einrad nach vorne drücken bzw. durch Absenken der Fußspitze nach vorne und damit die Neigung des Einrads kontrollieren.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(29)->setText('Das ist nicht gut. Der Standfuß sollte hinter dem Fußballen auf der Gabel stehen und den Glidingfuß bei der Kontrolle des Einrades zu unterstützen. Durch Absenken der Ferse das Einrad nach vorne drücken bzw. durch Absenken der Fußspitze nach vorne und damit die Neigung des Einrads kontrollieren.')->setValue(0)->save();

		// kontrollfuß
		$f = new Feedback();
		$f->setTrick($t)->setActionId(30)->save();

		$v = new Value();
		$v->setFeedback($f)->setRange(31)->setText('Wenn der Fuß nicht auf der Gabel aufsetzt, kann er das Einrad nicht kontrollieren. Beste Position ist hier der Fuß mit Zehenspitzen auf dem Reifen und hinter den Fußballen setzt er auf der Gabel auf um darüber die Neigung des Einrads zu kontrollieren.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(32)->setText('Der Kontrollfuß steuert das Einrad. Der Kontrollfuß sitzt hinter den Fußballen auf der Gabel auf und kann durch absenken der Ferse das Einrad nach vorne drücken bzw. durch absenken der Fußspitze nach hinten und darüber die Neigung des Einrads kontrollieren.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(33)->setText('Wenn der Fuß nicht auf der Gabel aufsetzt, kann er das Einrad nicht kontrollieren. Beste Position ist hier der Fuß mit Zehenspitzen auf dem Reifen und hinter den Fußballen setzt er auf der Gabel auf um darüber die Neigung des Einrads zu kontrollieren. Setzt aber die Ferse auf kann das Einrad nicht nach vorne geneigt werden.')->save();
			
	}

	private function create1ftWWtoSW() {
		$t = new Trick();
		$t->setTitle('1ft Wheel Walk to Standwalk');
		$t->save();
		
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(7)->setActionId(15)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(19)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(22)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(23)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(26)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(30)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(4)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(4)->setActionId(1)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(4)->setActionId(2)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(4)->setActionId(3)->save();
		
		// feedback
			
		// oberkörper
		$f = new Feedback();
		$f->setTrick($t)->setActionId(15)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(16)->setText('Dein Oberkörper ist \'n bisschen weit zu vorne, mehr nach hinten.')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(17)->setText('Alles bestens mit deinem Oberkörper.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(18)->setText('Dein Oberkörper ist \'n bisschen zu weit hinten, mehr nach vorne.')->setValue(0)->save();
			
		// schultern
		$f = new Feedback();
		$f->setTrick($t)->setActionId(19)->setMax(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(20)->setText('Durch die Innenrotierten Schultern, musst du zusätzlich Körperspannung im Rücken aufbauen, um die Oberkörperposition zu stabilisieren. Rotiere die Schultern nach außen, das hilft dir dabei.')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(21)->setText('Außenrotierte Schulter unterstützen die Oberkörperposition, das machst du gut so.')->setValue(5)->save();
			
		// arme
		$f = new Feedback();
		$f->setTrick($t)->setActionId(22)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Sehr schön, durchgestreckte Arme zeigen Körperspannung und zeugen von einem ausgeprägten Kraftpotential.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Schon zu schwach die Ämrchen durchzustrecken? Das ist aber mehr drinne.')->save();
		
		// handflächen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(23)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(24)->setText('Mit Handflächen nach unten signalisierst du dem Zuschauer du hast keine Interesse an der Kommunikation mit ihm. Hat er dann noch Interesse dir zuzuschauen?')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(25)->setText('Mit Handflächen nach oben signalisierst du dem Zuschauer deine Kommunikationsbereitschaft und erzählst ihm so, der Zuschauer sei dir nicht egal, gut so.')->setValue(5)->save();
		
		// standfuß
		$f = new Feedback();
		$f->setTrick($t)->setActionId(26)->setMax(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(27)->setText('Das ist nicht gut. Der Standfuß sollte hinter dem Fußballen auf der Gabel stehen und den Glidingfuß bei der Kontrolle des Einrades zu unterstützen. Durch Absenken der Ferse das Einrad nach vorne drücken bzw. durch Absenken der Fußspitze nach vorne und damit die Neigung des Einrads kontrollieren.')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(28)->setText('Der Standfuß unterstützt den Glidingfuß bei der Kontrolle des Einrades. Durch Absenken der Ferse das Einrad nach vorne drücken bzw. durch Absenken der Fußspitze nach vorne und damit die Neigung des Einrads kontrollieren.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(29)->setText('Das ist nicht gut. Der Standfuß sollte hinter dem Fußballen auf der Gabel stehen und den Glidingfuß bei der Kontrolle des Einrades zu unterstützen. Durch Absenken der Ferse das Einrad nach vorne drücken bzw. durch Absenken der Fußspitze nach vorne und damit die Neigung des Einrads kontrollieren.')->setValue(0)->save();
		
		// kontrollfuß
		$f = new Feedback();
		$f->setTrick($t)->setActionId(30)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(31)->setText('Wenn der Fuß nicht auf der Gabel aufsetzt, kann er das Einrad nicht kontrollieren. Beste Position ist hier der Fuß mit Zehenspitzen auf dem Reifen und hinter den Fußballen setzt er auf der Gabel auf um darüber die Neigung des Einrads zu kontrollieren.')->setMistake('fatal')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(32)->setText('Der Kontrollfuß steuert das Einrad. Der Kontrollfuß sitzt hinter den Fußballen auf der Gabel auf und kann durch absenken der Ferse das Einrad nach vorne drücken bzw. durch absenken der Fußspitze nach hinten und darüber die Neigung des Einrads kontrollieren.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(33)->setText('Wenn der Fuß nicht auf der Gabel aufsetzt, kann er das Einrad nicht kontrollieren. Beste Position ist hier der Fuß mit Zehenspitzen auf dem Reifen und hinter den Fußballen setzt er auf der Gabel auf um darüber die Neigung des Einrads zu kontrollieren. Setzt aber die Ferse auf kann das Einrad nicht nach vorne geneigt werden.')->setMistake('fatal')->save();
		
		// beine drücken hoch
		$f = new Feedback();
		$f->setTrick($t)->setActionId(1)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Die Beine sind das einzige, was dafür sorgt, dass der Körper aufgerichtet wird.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Die Beine sind das einzige, was dafür sorgt, dass der Körper aufgerichtet wird.')->save();
		
		// oberkörperhebel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(2)->setInverted(true)->setMistake('fatal')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Das ist ein gefährliches Spiel mit dem Oberkörper. Dadurch werden Energien erzeugt die später wieder mit dem Körper abgefangen werden müssen, und fast allen Fällen plumpst man dabei. Das gelingt auch keinem Profi, die verzichten daher darauf. Mit dem Oberkörper hochhebeln ist wie sich selbst ein Bein zu stellen, lass es daher bleiben.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Kein Hebeln, kein Problem.')->save();
		
		// hand drückt am sattel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(3)->setInverted(true)->setMistake('fatal')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Die Beine sind das einzige, was dafür sorgt, dass der Körper aufgerichtet wird. Die Hand kann nur aus falschem Grund an den Sattel geraten sein und gehört dort auch wieder weg.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Genau, keine Hand am Sattel. Die Beine sind das einzige, was dafür sorgt, dass der Körper aufgerichtet wird.')->save();
		
		// hand am sattel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(4)->setInverted(true)->setMistake('fatal')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Die Hand am Sattel, damit das Einrad nicht wegflutscht, gell? Dafür ist aber der Fuß zuständig. Die Hand verhindert nur weitere Schritte.')->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Genau, keine Hand am Sattel. Die Füße kontrollieren das Einrad.')->save();
		
	}
	
	private function createGlidingToStandgliding() {
		$t = new Trick();
		$t->setTitle('Gliding to Standgliding');
		$t->save();
	
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(7)->setActionId(15)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(19)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(22)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(23)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(26)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(30)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(4)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(4)->setActionId(1)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(4)->setActionId(2)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(4)->setActionId(3)->save();
	
		// feedback
			
		// oberkörper
		$f = new Feedback();
		$f->setTrick($t)->setActionId(15)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(16)->setText('Dein Oberkörper ist \'n bisschen weit zu vorne, mehr nach hinten.')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(17)->setText('Alles bestens mit deinem Oberkörper.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(18)->setText('Dein Oberkörper ist \'n bisschen zu weit hinten, mehr nach vorne.')->setValue(0)->save();
			
		// schultern
		$f = new Feedback();
		$f->setTrick($t)->setActionId(19)->setMax(5)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(20)->setText('Durch die Innenrotierten Schultern, musst du zusätzlich Körperspannung im Rücken aufbauen, um die Oberkörperposition zu stabilisieren. Rotiere die Schultern nach außen, das hilft dir dabei.')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(21)->setText('Außenrotierte Schulter unterstützen die Oberkörperposition, das machst du gut so.')->setValue(5)->save();
			
		// arme
		$f = new Feedback();
		$f->setTrick($t)->setActionId(22)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Sehr schön, durchgestreckte Arme zeigen Körperspannung und zeugen von einem ausgeprägten Kraftpotential.')->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Schon zu schwach die Ämrchen durchzustrecken? Das ist aber mehr drinne.')->save();
	
		// handflächen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(23)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(24)->setText('Mit Handflächen nach unten signalisierst du dem Zuschauer du hast keine Interesse an der Kommunikation mit ihm. Hat er dann noch Interesse dir zuzuschauen?')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(25)->setText('Mit Handflächen nach oben signalisierst du dem Zuschauer deine Kommunikationsbereitschaft und erzählst ihm so, der Zuschauer sei dir nicht egal, gut so.')->setValue(5)->save();
	
		// standfuß
		$f = new Feedback();
		$f->setTrick($t)->setActionId(26)->setMax(5)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(27)->setText('Das ist nicht gut. Der Standfuß sollte hinter dem Fußballen auf der Gabel stehen und den Glidingfuß bei der Kontrolle des Einrades zu unterstützen. Durch Absenken der Ferse das Einrad nach vorne drücken bzw. durch Absenken der Fußspitze nach vorne und damit die Neigung des Einrads kontrollieren.')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(28)->setText('Der Standfuß unterstützt den Glidingfuß bei der Kontrolle des Einrades. Durch Absenken der Ferse das Einrad nach vorne drücken bzw. durch Absenken der Fußspitze nach vorne und damit die Neigung des Einrads kontrollieren.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(29)->setText('Das ist nicht gut. Der Standfuß sollte hinter dem Fußballen auf der Gabel stehen und den Glidingfuß bei der Kontrolle des Einrades zu unterstützen. Durch Absenken der Ferse das Einrad nach vorne drücken bzw. durch Absenken der Fußspitze nach vorne und damit die Neigung des Einrads kontrollieren.')->setValue(0)->save();
	
		// kontrollfuß
		$f = new Feedback();
		$f->setTrick($t)->setActionId(30)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(31)->setText('Wenn der Fuß nicht auf der Gabel aufsetzt, kann er das Einrad nicht kontrollieren. Beste Position ist hier der Fuß mit Zehenspitzen auf dem Reifen und hinter den Fußballen setzt er auf der Gabel auf um darüber die Neigung des Einrads zu kontrollieren.')->setMistake('fatal')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(32)->setText('Der Kontrollfuß steuert das Einrad. Der Kontrollfuß sitzt hinter den Fußballen auf der Gabel auf und kann durch absenken der Ferse das Einrad nach vorne drücken bzw. durch absenken der Fußspitze nach hinten und darüber die Neigung des Einrads kontrollieren.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(33)->setText('Wenn der Fuß nicht auf der Gabel aufsetzt, kann er das Einrad nicht kontrollieren. Beste Position ist hier der Fuß mit Zehenspitzen auf dem Reifen und hinter den Fußballen setzt er auf der Gabel auf um darüber die Neigung des Einrads zu kontrollieren. Setzt aber die Ferse auf kann das Einrad nicht nach vorne geneigt werden.')->setMistake('fatal')->save();
	
		// beine drücken hoch
		$f = new Feedback();
		$f->setTrick($t)->setActionId(1)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Die Beine sind das einzige, was dafür sorgt, dass der Körper aufgerichtet wird.')->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Die Beine sind das einzige, was dafür sorgt, dass der Körper aufgerichtet wird.')->save();
	
		// oberkörperhebel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(2)->setInverted(true)->setMistake('fatal')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Das ist ein gefährliches Spiel mit dem Oberkörper. Dadurch werden Energien erzeugt die später wieder mit dem Körper abgefangen werden müssen, und fast allen Fällen plumpst man dabei. Das gelingt auch keinem Profi, die verzichten daher darauf. Mit dem Oberkörper hochhebeln ist wie sich selbst ein Bein zu stellen, lass es daher bleiben.')->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Kein Hebeln, kein Problem.')->save();
	
		// hand drückt am sattel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(3)->setInverted(true)->setMistake('fatal')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Die Beine sind das einzige, was dafür sorgt, dass der Körper aufgerichtet wird. Die Hand kann nur aus falschem Grund an den Sattel geraten sein und gehört dort auch wieder weg.')->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Genau, keine Hand am Sattel. Die Beine sind das einzige, was dafür sorgt, dass der Körper aufgerichtet wird.')->save();
	
		// hand am sattel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(4)->setInverted(true)->setMistake('fatal')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Die Hand am Sattel, damit das Einrad nicht wegflutscht, gell? Dafür ist aber der Fuß zuständig. Die Hand verhindert nur weitere Schritte.')->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Genau, keine Hand am Sattel. Die Füße kontrollieren das Einrad.')->save();
	
	}

	private function createAerial() {
		$t = new Trick();
		$t->setTitle('Aerial');
		$t->save();
		
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(6)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(7)->save();

		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(45)->save();
		
		// feedback
		
		// beinstreckung
		$f = new Feedback();
		$f->setTrick($t)->setActionId(6)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Nene, das Bein gehört durchgestreckt, wenn es frei hängt!')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Genau, das Bein gehört durchgestreckt, wenn es frei hängt! Du machst es super')->save();
		
		// fußspitze
		$f = new Feedback();
		$f->setTrick($t)->setActionId(7)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(8)->setText('Da ist ja garnix los im Fuß! Die Fußspitze gehört mit dem Bein gestreckt')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(9)->setText('Yes! Die Fußspitze gehört zur Beinstreckung dazu. Läuft.')->setValue(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(10)->setText('Da ist zwar Power in der Fußspitze, aber die in der falschen Richtung. Durchstrecken, nicht anziehen.')->setValue(0)->save();
		
		// krätsch-winkel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(45)->setMax(4)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("<45")->setText('Oi, da ist ja quasi nix passiert. Nur so ein kleiner Hopser, höher und mehr Krätsch-Winkel.')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("45-89")->setText('Ok, das ist jetzt so der Anfängerbereich. Darfs noch ein bissje mehr sein? Ja!')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("90-135")->setText('Mindestens 90° sollten es sein. Jup')->setValue(2)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("136-179")->setText('Ok, langsam nähert es sich einem schönen Spagat an.')->setValue(3)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(">=180")->setText('Bombe, ein schöner Spagat in der Luft.')->setValue(4)->save();
		
		
	}
	
	private function createUnispin() {
		$t = new Trick();
		$t->setTitle('Unispin');
		$t->save();
	
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(6)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(7)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(45)->save();
	
		// feedback
	
		// beinstreckung
		$f = new Feedback();
		$f->setTrick($t)->setActionId(6)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Nene, das Bein gehört durchgestreckt, wenn es frei hängt!')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Genau, das Bein gehört durchgestreckt, wenn es frei hängt! Du machst es super')->save();
	
		// fußspitze
		$f = new Feedback();
		$f->setTrick($t)->setActionId(7)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(8)->setText('Da ist ja garnix los im Fuß! Die Fußspitze gehört mit dem Bein gestreckt')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(9)->setText('Yes! Die Fußspitze gehört zur Beinstreckung dazu. Läuft.')->setValue(5)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(10)->setText('Da ist zwar Power in der Fußspitze, aber die in der falschen Richtung. Durchstrecken, nicht anziehen.')->setValue(0)->save();
	
		// krätsch-winkel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(45)->setMax(4)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("<45")->setText('Oi, da ist ja quasi nix passiert. Nur so ein kleiner Hopser, höher und mehr Krätsch-Winkel.')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("45-89")->setText('Ok, das ist jetzt so der Anfängerbereich. Darfs noch ein bissje mehr sein? Ja!')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("90-135")->setText('Mindestens 90° sollten es sein. Jup')->setValue(2)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("136-179")->setText('Ok, langsam nähert es sich einem schönen Spagat an.')->setValue(3)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(">=180")->setText('Bombe, ein schöner Spagat in der Luft.')->setValue(4)->save();
	
	
	}
	
	private function createHoWAerial() {
		$t = new Trick();
		$t->setTitle('Hopping on Wheel Aerial');
		$t->save();
	
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(6)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(7)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(45)->save();
	
		// feedback
	
		// beinstreckung
		$f = new Feedback();
		$f->setTrick($t)->setActionId(6)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Nene, das Bein gehört durchgestreckt, wenn es frei hängt!')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Genau, das Bein gehört durchgestreckt, wenn es frei hängt! Du machst es super')->save();
	
		// fußspitze
		$f = new Feedback();
		$f->setTrick($t)->setActionId(7)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(8)->setText('Da ist ja garnix los im Fuß! Die Fußspitze gehört mit dem Bein gestreckt')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(9)->setText('Yes! Die Fußspitze gehört zur Beinstreckung dazu. Läuft.')->setValue(5)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(10)->setText('Da ist zwar Power in der Fußspitze, aber die in der falschen Richtung. Durchstrecken, nicht anziehen.')->setValue(0)->save();
	
		// krätsch-winkel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(45)->setMax(4)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("<45")->setText('Oi, da ist ja quasi nix passiert. Nur so ein kleiner Hopser, höher und mehr Krätsch-Winkel.')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("45-89")->setText('Ok, das ist jetzt so der Anfängerbereich. Darfs noch ein bissje mehr sein? Ja!')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("90-135")->setText('Mindestens 90° sollten es sein. Jup')->setValue(2)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("136-179")->setText('Ok, langsam nähert es sich einem schönen Spagat an.')->setValue(3)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(">=180")->setText('Bombe, ein schöner Spagat in der Luft.')->setValue(4)->save();
	
	
	}

	private function createSoSSwing() {
		$t = new Trick();
		$t->setTitle('Seat-on-Side Swing');
		$t->save();
		
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(6)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(7)->save();
		
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(45)->save();
		
		// feedback
		
		// beinstreckung
		$f = new Feedback();
		$f->setTrick($t)->setActionId(6)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Nene, das Bein gehört durchgestreckt, wenn es frei hängt!')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Genau, das Bein gehört durchgestreckt, wenn es frei hängt! Du machst es super')->save();
		
		// fußspitze
		$f = new Feedback();
		$f->setTrick($t)->setActionId(7)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(8)->setText('Da ist ja garnix los im Fuß! Die Fußspitze gehört mit dem Bein gestreckt')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(9)->setText('Yes! Die Fußspitze gehört zur Beinstreckung dazu. Läuft.')->setValue(5)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(10)->setText('Da ist zwar Power in der Fußspitze, aber die in der falschen Richtung. Durchstrecken, nicht anziehen.')->setValue(0)->save();

		// bein-winkel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(45)->setMax(4)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("<45")->setText('War was?')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("45-89")->setText('Ok, das ist jetzt so der Anfängerbereich. Aber noch nicht im lohnenswerten Bereich.')->setValue(0)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("90-110")->setText('Mindestens 90° sollten es sein. Jup')->setValue(2)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange("110-145")->setText('Sogar bis zum Kopf, sehr gut.')->setValue(3)->save();
		
		$v = new Value();
		$v->setFeedback($f)->setRange(">145")->setText('Woah, das Bein ist ja "up-in-space" bist du krass.')->setValue(4)->save();
		
		
	}
	
	private function createHoWSwing() {
		$t = new Trick();
		$t->setTitle('Hopping on Wheel Swing');
		$t->save();
	
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(6)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(7)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(45)->save();
	
		// feedback
	
		// beinstreckung
		$f = new Feedback();
		$f->setTrick($t)->setActionId(6)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Nene, das Bein gehört durchgestreckt, wenn es frei hängt!')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Genau, das Bein gehört durchgestreckt, wenn es frei hängt! Du machst es super')->save();
	
		// fußspitze
		$f = new Feedback();
		$f->setTrick($t)->setActionId(7)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(8)->setText('Da ist ja garnix los im Fuß! Die Fußspitze gehört mit dem Bein gestreckt')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(9)->setText('Yes! Die Fußspitze gehört zur Beinstreckung dazu. Läuft.')->setValue(5)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(10)->setText('Da ist zwar Power in der Fußspitze, aber die in der falschen Richtung. Durchstrecken, nicht anziehen.')->setValue(0)->save();
	
		// bein-winkel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(45)->setMax(4)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("<45")->setText('War was?')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("45-89")->setText('Ok, das ist jetzt so der Anfängerbereich. Aber noch nicht im lohnenswerten Bereich.')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("90-110")->setText('Mindestens 90° sollten es sein. Jup')->setValue(2)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("110-145")->setText('Sogar bis zum Kopf, sehr gut.')->setValue(3)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(">145")->setText('Woah, das Bein ist ja "up-in-space" bist du krass.')->setValue(4)->save();
	
	
	}
	
	private function createHoWKick() {
		$t = new Trick();
		$t->setTitle('Hopping on Wheel Kick');
		$t->save();
	
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(6)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(7)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(45)->save();
	
		// feedback
	
		// beinstreckung
		$f = new Feedback();
		$f->setTrick($t)->setActionId(6)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Nene, das Bein gehört durchgestreckt, wenn es frei hängt!')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Genau, das Bein gehört durchgestreckt, wenn es frei hängt! Du machst es super')->save();
	
		// fußspitze
		$f = new Feedback();
		$f->setTrick($t)->setActionId(7)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(8)->setText('Da ist ja garnix los im Fuß! Die Fußspitze gehört mit dem Bein gestreckt')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(9)->setText('Yes! Die Fußspitze ist zwar geil, aber beim kicken ist es komisch. Da gehört die Fußspitze geflext.')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(10)->setText('BAM. Es muss BAM machen. So kickt man da oben.')->setValue(5)->save();
	
		// bein-winkel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(45)->setMax(4)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("<45")->setText('War was?')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("45-89")->setText('Ok, das ist jetzt so der Anfängerbereich. Aber noch nicht im lohnenswerten Bereich.')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("90-110")->setText('Mindestens 90° sollten es sein. Jup')->setValue(2)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("110-145")->setText('Sogar bis zum Kopf, sehr gut.')->setValue(3)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(">145")->setText('Woah, das Bein ist ja "up-in-space" bist du krass.')->setValue(4)->save();
	
	
	}
	
	private function createSoSKick() {
		$t = new Trick();
		$t->setTitle('Seat-on-Side Kick');
		$t->save();
	
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(6)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(7)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(45)->save();
	
		// feedback
	
		// beinstreckung
		$f = new Feedback();
		$f->setTrick($t)->setActionId(6)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Nene, das Bein gehört durchgestreckt, wenn es frei hängt!')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Genau, das Bein gehört durchgestreckt, wenn es frei hängt! Du machst es super')->save();
	
		// fußspitze
		$f = new Feedback();
		$f->setTrick($t)->setActionId(7)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(8)->setText('Da ist ja garnix los im Fuß! Die Fußspitze gehört mit dem Bein gestreckt')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(9)->setText('Yes! Die Fußspitze ist zwar geil, aber beim kicken ist es komisch. Da gehört die Fußspitze geflext.')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(10)->setText('BAM. Es muss BAM machen. So kickt man da oben.')->setValue(5)->save();
	
		// bein-winkel
		$f = new Feedback();
		$f->setTrick($t)->setActionId(45)->setMax(4)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("<45")->setText('War was?')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("45-89")->setText('Ok, das ist jetzt so der Anfängerbereich. Aber noch nicht im lohnenswerten Bereich.')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("90-110")->setText('Mindestens 90° sollten es sein. Jup')->setValue(2)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange("110-145")->setText('Sogar bis zum Kopf, sehr gut.')->setValue(3)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(">145")->setText('Woah, das Bein ist ja "up-in-space" bist du krass.')->setValue(4)->save();
	
	}
	
	private function createStandwalk() {
		// Wheel Walk 1ft
		$t = new Trick();
		$t->setTitle('Standwalk');
		$t->save();
	
		// items
		$i = new Item();
		$i->setTrick($t)->setGroupId(6)->setActionId(11)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(7)->setActionId(15)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(19)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(1)->setActionId(22)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(23)->save();
	
		$i = new Item();
		$i->setTrick($t)->setGroupId(6)->setActionId(44)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(2)->setActionId(44)->save();
			
		$i = new Item();
		$i->setTrick($t)->setGroupId(3)->setActionId(44)->save();
	
		// feedback
			
		// füße aufsetzen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(11)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(12)->setText('Sehr schön, die Fußspitzen setzen zuerst auf.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(13)
		->setText('Die Fußspitzen sollen zuerst aufsetzen, nicht die Fersen. Andere Tricks brauchen das in der Reihenfolge.')
		->setValue(0)
		->setMistake('fatal')->save();

		// oberkörper
		$f = new Feedback();
		$f->setTrick($t)->setActionId(15)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(16)->setText('Dein Oberkörper ist \'n bisschen weit zu vorne, mehr nach hinten.')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(17)->setText('Alles bestens mit deinem Oberkörper.')->setValue(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(18)->setText('Dein Oberkörper ist \'n bisschen zu weit hinten, mehr nach vorne.')->setValue(0)->save();
			
		// schultern
		$f = new Feedback();
		$f->setTrick($t)->setActionId(19)->setMax(5)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(20)->setText('Durch die Innenrotierten Schultern, musst du zusätzlich Körperspannung im Rücken aufbauen, um die Oberkörperposition zu stabilisieren. Rotiere die Schultern nach außen, das hilft dir dabei.')->setValue(0)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(21)->setText('Außenrotierte Schulter unterstützen die Oberkörperposition, das machst du gut so.')->setValue(5)->save();
			
		// arme
		$f = new Feedback();
		$f->setTrick($t)->setActionId(22)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Sehr schön, durchgestreckte Arme zeigen Körperspannung und zeugen von einem ausgeprägten Kraftpotential.')->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Schon zu schwach die Ämrchen durchzustrecken? Das ist aber mehr drinne.')->save();
	
		// handflächen
		$f = new Feedback();
		$f->setTrick($t)->setActionId(23)->setMax(5)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(24)->setText('Mit Handflächen nach unten signalisierst du dem Zuschauer du hast keine Interesse an der Kommunikation mit ihm. Hat er dann noch Interesse dir zuzuschauen?')->setValue(0)->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(25)->setText('Mit Handflächen nach oben signalisierst du dem Zuschauer deine Kommunikationsbereitschaft und erzählst ihm so, der Zuschauer sei dir nicht egal, gut so.')->setValue(5)->save();
	
		// walking-rhythmus
		$f = new Feedback();
		$f->setTrick($t)->setActionId(44)->save();
	
		$v = new Value();
		$v->setFeedback($f)->setRange(1)->setText('Super, ein kontinuierliche Bewegung im Fuß sieht nicht nur gut aus, sondern erlaubt auch eine leichtere Kontrolle des Tricks und verleiht dem Trick etwas Majestätisches.')->save();
			
		$v = new Value();
		$v->setFeedback($f)->setRange(0)->setText('Deine Fuß ist wohl noch etwas zickig. Nimm dir für jeden Schritt Zeit.')->save();
	}
}
