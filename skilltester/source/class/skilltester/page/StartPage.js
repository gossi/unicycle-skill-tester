qx.Class.define("skilltester.page.StartPage", {
	extend : qx.ui.mobile.page.NavigationPage,
	implement: [skilltester.registry.IRegistryItem],
	
	construct: function() {
		this.base(arguments);
		
		this.set({
			id: "start",
			title: "Unicycle Skill Tester",
			showBackButton : true,
			showBackButtonOnTablet : false,
			backButtonText : "Navigation"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},
	
	members: {
		_initialize: function() {
			this.base(arguments);
			
			var html = new qx.ui.mobile.embed.Html();
			html.setHtml("Hello World");
			
			this.getContent().add(html);
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