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
		routing : {
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

			var tricks = new skilltester.tricks.Tricks();
			tricks.add(new skilltester.tricks.WheelWalkToStandWalk());
			tricks.add(new skilltester.tricks.StandWalk());
			
			var trickPage = new skilltester.page.TrickPage();
			var start = new skilltester.page.Start();

			// navigation
			var go = function(e) {
				var data = e.getData();
				if (data.target) {
					router.execute(data.target);
				}
			},
			goBack = function(e) {
				router.execute("/nav");
			};
			var nav = new skilltester.page.Nav();
			nav.addListener("go", go, this);
			
			var trickNav = new skilltester.page.TricksNav();
			trickNav.setTricks(tricks.toArray());
			trickNav.addListener("back", goBack, this);
			trickNav.addListener("go", go, this);
			
			var knolNav = new skilltester.page.KnolNav();
			knolNav.addListener("back", goBack, this);
			knolNav.addListener("go", go, this);

			var manager = new qx.ui.mobile.page.Manager();
			manager.addMaster([ nav, trickNav, knolNav ]);
			manager.addDetail([ start, trickPage ]);

			start.show();
			trickNav.show();

			// Initialize the navigation
			var router = new qx.application.Routing();
			this.setRouting(router);

			router.onGet("/", function(data) {
				nav.show();
				start.show();
			}, this);
			
			router.onGet("/nav", function(data) {
				nav.show({reverse: true});
			});

			router.onGet("/nav/knol", function(data) {
				knolNav.show();
			}, this);
			
			router.onGet("/nav/tricks", function(data) {
				trickNav.show();
			}, this);
			
			router.onGet("/trick/{id}", function(data) {
				trickNav.show();
				trickPage.setTrick(tricks.get(data.params.id));
				trickPage.show();
			}, this);
			
			router.onGet("/knol/{id}", function(data) {
				knolNav.show();
				console.log(data.params.id);
			}, this);

			router.init();
		}
	}
});
