qx.Class.define("skilltester.page.KnolContentPage", {
	extend : skilltester.page.ContentPage,
	
	construct: function() {
		this.base(arguments);
		
		this.set({
			id: "knol-content",
			showBackButton : true,
			showBackButtonOnTablet : false,
			backButtonText : "Lexikon"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},
	
	members: {
		
		_getFolderPrefix: function() {
			return 'knol';
		},
		
		_back: function(e) {
			qx.core.Init.getApplication().getRouter().execute("/nav/knol", {
				"knol-nav": {
					reverse: true
				}
			});
		}
	}
});