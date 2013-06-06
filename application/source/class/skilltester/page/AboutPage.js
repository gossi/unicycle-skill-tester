qx.Class.define("skilltester.page.AboutPage", {
	extend : skilltester.page.ContentPage,
	
	construct: function() {
		this.base(arguments);
		
		this.set({
			id: "about",
			file: "about",
			title: "Über den Unicycle Skill Tester",
			showBackButton : true,
			showBackButtonOnTablet : false,
			backButtonText : "Navigation"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},
	
	members: {
//		_initialize: function() {
//			this.base(arguments);
//		},
		
		_getFolderPrefix: function() {
			return 'general';
		},
		
		_back: function(e) {
			qx.core.Init.getApplication().getRouter().execute("/nav", {
				"nav": {
					reverse: true
				}
			});
		}
	}
});