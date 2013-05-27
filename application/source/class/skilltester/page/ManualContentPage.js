qx.Class.define("skilltester.page.ManualContentPage", {
	extend : skilltester.page.ContentPage,
	
	construct: function() {
		this.base(arguments);
		
		this.set({
			id: "manual-content",
			showBackButton : true,
			showBackButtonOnTablet : false,
			backButtonText : "Anleitung"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},
	
	members: {
		
		_getFolderPrefix: function() {
			return 'anleitung';
		},
		
		_back: function(e) {
			qx.core.Init.getApplication().getRouter().execute("/nav/anleitung", {
				"manual-nav": {
					reverse: true
				}
			});
		}
	}
});