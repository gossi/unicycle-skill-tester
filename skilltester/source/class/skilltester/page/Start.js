qx.Class.define("skilltester.page.Start", {
	extend : qx.ui.mobile.page.NavigationPage,
	
	construct: function() {
		this.base(arguments);
		this.setTitle("Unicycle Skill Tester");
	},
	
	members: {
		_initialize: function() {
			this.base(arguments);
			
			var html = new qx.ui.mobile.embed.Html();
			html.setHtml("Hello World");
			
			this.getContent().add(html);
		}
	}
});