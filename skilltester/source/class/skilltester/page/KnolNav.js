qx.Class.define("skilltester.page.KnolNav", {
	extend : qx.ui.mobile.page.NavigationPage,

	events : {
		"go" : "qx.event.type.Data"
	},
	
	construct : function() {
		this.base(arguments);
		this.set({
			title : "Wissen",
			showBackButton : true,
			showBackButtonOnTablet : true,
			backButtonText : "Back"
		});
	},

	members : {
		_initialize : function() {
			this.base(arguments);
			var knols = [ {
				title : "V-Arms",
				path : "v-arms"
			} ];
			var knolList = new qx.ui.mobile.list.List({
				configureItem : function(item, data, row) {
					item.setTitle(data.title);
					item.setShowArrow(true);
				}
			});
			knolList.setModel(new qx.data.Array(knols));
			knolList.addListener("changeSelection", function(evt) {
				var path = knols[evt.getData()].path;
				this.fireDataEvent("go", {target: "/knol/" + path});
			}, this);

			this.getContent().add(knolList);
		}
	}
});