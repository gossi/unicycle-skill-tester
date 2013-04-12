qx.Class.define("skilltester.page.NavPage", {
	extend : qx.ui.mobile.page.NavigationPage,
	implement: [skilltester.registry.IRegistryItem],

	construct : function() {
		this.base(arguments);
		
		this.set({
			id: "nav",
			title : "Navigation"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},

	members : {
		_initialize : function() {
			this.base(arguments);
			var pages = [ {
				title : "Tests",
				path: "tests"
			}, {
				title : "Wissen",
				path : "knol"
			} ];
			var navList = new qx.ui.mobile.list.List({
				configureItem : function(item, data, row) {
					item.setTitle(data.title);
					item.setShowArrow(true);
				}
			});
			navList.setModel(new qx.data.Array(pages));
			navList.addListener("changeSelection", function(evt) {
				var path = pages[evt.getData()].path;
				qx.core.Init.getApplication().getRouter().execute("/nav/" + path, {});
			}, this);

			this.getContent().add(navList);
		}
	}
});