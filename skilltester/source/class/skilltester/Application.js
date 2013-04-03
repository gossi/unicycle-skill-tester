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

			// var tricks = Object.create(null);
			var trickPage = new skilltester.page.Trick();
			var start = new skilltester.page.Start();

			var nav = new skilltester.page.Nav();
			nav.addListener("go", function(e) {
				var data = e.getData();
				if (data.target) {
					switch (data.target) {
					case "tricks":
						trickNav.show();
						break;
						
					case "knol":
						knolNav.show();
						break;
					}
				}
			}, this);
			
			var trickNav = new skilltester.page.TricksNav();
			trickNav.addListener("back", function(e) {
				nav.show({reverse: true});
			}, this);
			
			var knolNav = new skilltester.page.KnolNav();
			knolNav.addListener("back", function(e) {
				nav.show({reverse: true});
			}, this);

			var manager = new qx.ui.mobile.page.Manager();
			manager.addMaster([ nav, trickNav, knolNav ]);
			manager.addDetail([ start, trickPage ]);

			start.show();
			knolNav.show();

			// Initialize the navigation
			var router = new qx.application.Routing();
			this.setRouting(router);

			router.onGet("/", function(data) {
				start.show();
			}, this);

			router.onGet("/nav/knol", function(data) {
				knolNav.show();
			}, this);

			router.init();
		}
	}
});
