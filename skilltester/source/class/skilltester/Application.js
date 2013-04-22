/* ************************************************************************

   Copyright:

   License:

   Authors:

 ************************************************************************ */

/* ************************************************************************

 #asset(skilltester/*)
 #asset(qx/mobile/icon/${qx.mobile.platform}/*)
 #asset(qx/mobile/icon/common/*)

 ************************************************************************ */

/**
 * This is the main application class of your custom application "skilltester"
 */
qx.Class.define("skilltester.Application", {
	extend : qx.application.Mobile,

	properties : {
		router : {
			init : null
		}
	},

	members : {
		/**
		 * This method contains the initial application code and gets called
		 * during startup of the application
		 */
		main : function() {
			// Call super class
			this.base(arguments);

			// Enable logging in debug variant
			if (qx.core.Environment.get("qx.debug")) {
				// support native logging capabilities, e.g. Firebug for Firefox
				qx.log.appender.Native;
				// support additional cross-browser console. Press F7 to toggle
				// visibility
				qx.log.appender.Console;
			}

			/*
			 * -------------------------------------------------------------------------
			 * Below is your actual application code... Remove or edit the
			 * following code to create your application.
			 * -------------------------------------------------------------------------
			 */
			
			// Tricks
			this._createActions();
			this._createGroups();
			this._createTricks();
			
			// Pages
			var manager = new qx.ui.mobile.page.Manager();
			this.__createPages(manager);
			
			// Routing and Navigation
			var router = new qx.application.Routing();
			this.setRouter(router);
			this.__createRoutes(router);
			router.init();
		},
		
		__navPage : null,
		__knolNavPage : null,
		__testNavPage : null,
		__startPage : null,
		__testPage : null,
		__resultPage : null,
		
		/**
		 * Creates the pages for this app
		 * @param {qx.ui.mobile.page.Manager} manager
		 */
		__createPages: function(manager) {
			this.__navPage = new skilltester.page.NavPage();
			this.__testNavPage = new skilltester.page.TestNavPage();
			this.__knolNavPage = new skilltester.page.KnolNavPage();
			this.__startPage = new skilltester.page.StartPage();
			this.__testPage = new skilltester.page.TestPage();
			this.__resultPage = new skilltester.page.ResultPage();

			manager.addMaster([ this.__navPage, this.__testNavPage, this.__knolNavPage ]);
			manager.addDetail([ this.__startPage, this.__testPage, this.__resultPage ]);
		},

		showPage: function(id, data) {
			var registry = skilltester.registry.PageRegistry.getInstance();
			if (registry.has(id)) {
				var page = registry.get(id), options = {};
				
				if (data.customData instanceof Object && id in data.customData) {
					options = data.customData[id];
				}
				
				page.show(options);
			}
		},

		/**
		 * Creates the routes for this app
		 * @param {qx.application.Routing} router
		 */
		__createRoutes: function(router) {
			router.onGet("/", function(data) {
				this.showPage('nav', data);
				this.showPage('start', data);
			}, this);
			
			router.onGet("/nav", function(data) {
				this.showPage('nav', data);
			}, this);

			router.onGet("/nav/knol", function(data) {
				this.showPage('knol-nav', data);
			}, this);
			
			router.onGet("/nav/tests", function(data) {
				this.showPage('test-nav', data);
			}, this);
			
			router.onGet("/test/{slug}", function(data) {
				this.__testPage.setTrick(skilltester.registry.TrickRegistry.getInstance().getBySlug(data.params.slug));
				this.showPage('test-nav', data);
				this.showPage('test', data);
			}, this);
			
			router.onGet("/result/{slug}/{params}", function(data) {
				this.__resultPage.resetTrick();
				this.__resultPage.setTrick(skilltester.registry.TrickRegistry.getInstance().getBySlug(data.params.slug));
				this.__resultPage.setParams(data.params.params);
				this.showPage('test-nav', data);
				this.showPage('result', data);
			}, this);
			
			router.onGet("/knol/{id}", function(data) {
				this.showPage('knol', data);
			}, this);
		},
		
		_createActions: function() {
			new skilltester.entities.Action({
				id: "extend-legs",
				title: "Beine durchstrecken",
				description: "Die Beine werden durchgestreckt"
			});
			new skilltester.entities.Action({
				id: "accelerate-upper-body",
				title: "Hebeln mit dem Oberkörper",
				description: "Der Oberkörper knickt an der Hälfte ein, um ihn dann noch oben zu beschleunigen. Mit dem Schwung wird der ganze Körper aufgerichtet."
			});
			new skilltester.entities.Action({
				id: "leaning-upper-body",
				type: "int",
				title: "Hüftknick/Oberkörper Neigung [°]",
				description: "Der Winkel Rumpf-Bein-Winkel: 180° für durchgestreckten Oberkörper, 90° für einen rechten Winkel im Hüftgelenk."
			});
			new skilltester.entities.Action({
				id: "hand-on-seat",
				title: "Hand am Sattel",
				description: "Eine Hand hält den Sattel vorne am Griff fest."
			});
			
			new skilltester.entities.Action({
				id: "rev-per-minute",
				type: "int",
				title: "Umdrehungen pro Minute",
				description: "Die Geschwindigkeit gemessen an den Umdrehungen pro Minute"
			});
			
			
			new skilltester.entities.Action({
				id: "toe-none",
				title: "Nichts",
				description: "Keine wirkliche Muskelaktivität; die Fußspitze labbert."
			});
			new skilltester.entities.Action({
				id: "point",
				title: "Point",
				description: "Die Fußspitze ist durchgestreckt. Die Wadenmuskulatur ist sichtbar konrahiert und von Fußspitze zum Knie ergibt sich eine gerade Linie."
			});
			new skilltester.entities.Action({
				id: "flex",
				title: "Flex",
				description: "Die Fußspitze ist angezogen. Die Wadenmuskulatur ist sichtbar gedehnt und der Schienbeinmuskel kontrahiert."
			});
			new skilltester.entities.Action({
				id: "toe",
				type: "radio",
				title: "Fußspitze",
				items: ["toe-none", "point", "flex"]
			});
			new skilltester.entities.Action({
				id: "extended-leg",
				title: "Durchgestrecktes Bein?",
				description: "Ist das Bein durchgestreckt? Muskelspannung im Bein ist wahrnehmbar."
			});
			
		},
		
		_createGroups: function() {
			new skilltester.entities.Group({
				id: "stand-up",
				title: "Körper Aufrichten",
				description: "Die Methode um in die Stand-Up Position zu gelangen"
			});
			new skilltester.entities.Group({
				id: "speed",
				title: "Geschwindigkeit"
			});
			new skilltester.entities.Group({
				id: "body-tension",
				title: "Körperspannung"
			});
			new skilltester.entities.Group({
				id: "aesthetics",
				title: "Ästhetik"
			});
		},
		
		_createTricks: function() {
			new skilltester.entities.Trick({
				title: "Standwalk"
			});
			new skilltester.entities.Trick({
				title: "Wheel Walk to Stand Walk",
				items: {
					"stand-up": ["extend-legs", "leaning-upper-body", "accelerate-upper-body", "hand-on-seat"]
				},
				feedback: {
					"extend-legs": {
						
					},
					"leaning-upper-body": {
						values: {
							"<90": {
								value: 0
							},
							"90-135": {
								value: 0,
								mistake: "critical"
							},
							"135-170": {
								value: 0.5
							},
							"171-190": {
								value: 5,
								feedback: "Das ist die ideale Haltung."
							}
						},
						max: 5
					},
					"accelerate-upper-body": {
						inverted: true,
						mistake: "critical"
					},
					"hand-on-seat": {
						inverted: true,
						mistake: "fatal"
					}
				}
			});
			new skilltester.entities.Trick({
				title: "Spin 1ft ext",
				items: {
					"speed": ["rev-per-minute"],
					"body-tension": ["extended-leg", "toe"]
				},
				feedback: {
					"rev-per-minute": {
						values: {
							"<45": {
								value: 0,
								feedback: "Sehr viel üben du noch musst."
							},
							"45-60": {
								value: 1,
								feedback: "Du fährst den Spin mit Basisgeschwindigkeit"
							},
							"61-80": {
								value: 2,
								feedback: "Oha, dein Spin ist ja schon ein bisschen schnell - Geb noch weiter Gas!"
							},
							"81-100": {
								value: 3,
								feedback: "Nun, dein Spin hat ja schon eine Stramme Geschwindigkeit, ein bisschen mehr geht noch!"
							},
							"101-120": {
								value: 4,
								feedback: "Das ist ja mal ein Spin mit Dampf!"
							},
							">120": {
								value: 5,
								feedback: "Boah Krass, ein Spin mit Volldampf!"
							}
						},
						max: 5,
						percent: 25
					},
					"extended-leg": {
						weight: 1
					},
					"toe": {
						values: {
							"toe-none": {
								value: 0
							},
							"point": {
								value: 5
							},
							"flex": {
								value: 0
							}
						},
						max: 5
					},
					conditionals: [{
						conditions: {
							and: {
								"extended-leg" : "on",
								"toe": "point"
							}
						},
						feedback: ["Dein Bein muss sicherlich so starr wie ein Holzbein anfühlen, oder? Aber so ist es richtig. Die Streckung zeugt von trainierter Körperspannung."]
					}]
				}
			});
		}
	}
});
