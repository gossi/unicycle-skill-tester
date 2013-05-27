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
			this.showPage('start');
			router.init();
		},
		
		__navPage : null,
		__knolNavPage : null,
		__testNavPage : null,
		__skillLevelsNavPage : null,
		__startPage : null,
		__testPage : null,
		__resultPage : null,
		__skillLevelPage : null,
		__manualContentPage : null,
		__knolContentPage : null,
		__aboutPage : null,
		
		/**
		 * Creates the pages for this app
		 * @param {qx.ui.mobile.page.Manager} manager
		 */
		__createPages: function(manager) {
			this.__navPage = new skilltester.page.NavPage();
			this.__testNavPage = new skilltester.page.TestNavPage();
			this.__knolNavPage = new skilltester.page.KnolNavPage();
			this.__manualNavPage = new skilltester.page.ManualNavPage();
			this.__startPage = new skilltester.page.StartPage();
			this.__aboutPage = new skilltester.page.AboutPage();
			this.__testPage = new skilltester.page.TestPage();
			this.__resultPage = new skilltester.page.ResultPage();
			this.__manualContentPage = new skilltester.page.ManualContentPage();
			this.__knolContentPage = new skilltester.page.KnolContentPage();
			this.__skillLevelsNavPage = new skilltester.page.SkillLevelsNavPage();
			this.__skillLevelPage = new skilltester.page.SkillLevelPage();

			manager.addMaster([ this.__navPage, this.__testNavPage, this.__knolNavPage, this.__manualNavPage, this.__skillLevelsNavPage ]);
			manager.addDetail([ this.__startPage, this.__testPage, this.__resultPage, this.__manualContentPage, this.__knolContentPage, this.__aboutPage, this.__skillLevelPage ]);
		},

		showPage: function(id, data) {
			var registry = skilltester.registry.PageRegistry.getInstance();
			if (registry.has(id)) {
				var page = registry.get(id), options = {};
				
				if (data && 'customData' in data && data.customData instanceof Object && id in data.customData) {
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
			
			router.onGet("/about", function(data) {
				this.showPage('nav', data);
				this.showPage('about', data);
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
			
			router.onGet("/nav/anleitung", function(data) {
				this.showPage('manual-nav', data);
			}, this);
			
			router.onGet("/nav/skill-levels", function(data) {
				this.showPage('skill-levels-nav', data);
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
			
			router.onGet("/skill-level/{id}", function(data) {
				this.showPage('skill-levels-nav', data);
				
				this.__skillLevelPage.setLevel(data.params.id);
				this.showPage('skill-level', data);
			}, this);
			
			router.onGet("/knol/{id}", function(data) {
				this.showPage('knol-nav', data);
				
				this.__knolContentPage.setFile(data.params.id);
				this.showPage('knol-content', data);
			}, this);
			
			router.onGet("/anleitung/", function(data) {
				this.showPage('manual-nav', data);
				
				this.__manualContentPage.setFile('index');
				this.showPage('manual-content', data);
			}, this);
			
			router.onGet("/anleitung/{id}", function(data) {
				this.showPage('manual-nav', data);
				
				this.__manualContentPage.setFile(data.params.id);
				this.showPage('manual-content', data);
			}, this);
			
			// track
			router.on("/.*", function(data) {
				if (_paq) {
					_paq.push(['trackPageView', '/app' + data.path]);
				}
			});
		},
		
		_createActions: function() {
			if ('actions' in data) {
				data['actions'].forEach(function (action) {
					new skilltester.entities.Action(action);		
				}, this);
			}
			
			// special actions
			new skilltester.entities.Action({
				id: -1,
				title: "Fatale Bewegungsfehler?"
			});
		},
		
		_createGroups: function() {
			if ('groups' in data) {
				data['groups'].forEach(function (group) {
					new skilltester.entities.Group(group);		
				}, this);	
			}
		},
		
		_createTricks: function() {
			if ('tricks' in data) {
				data['tricks'].forEach(function (trick) {
					new skilltester.entities.Trick(trick);		
				}, this);	
			}
		}
	}
});
