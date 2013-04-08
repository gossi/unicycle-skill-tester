qx.Class.define("skilltester.page.Nav", {
	extend : qx.ui.mobile.page.NavigationPage,

	events : {
		"go" : "qx.event.type.Data"
	},

	construct : function() {
		this.base(arguments);
		this.set({
			title : "Navigation"
		});
	},

	members : {
		_initialize : function() {
			this.base(arguments);
			var pages = [ {
				title : "Tricks",
				path: "tricks"
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
				this.fireDataEvent("go", {target: "/nav/" + path});
			}, this);

			this.getContent().add(navList);
		}
	}
});