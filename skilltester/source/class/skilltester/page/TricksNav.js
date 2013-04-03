qx.Class.define("skilltester.page.TricksNav", {
	extend : qx.ui.mobile.page.NavigationPage,

	construct : function() {
		this.base(arguments);
		this.set({
			title : "Tricks",
			showBackButton : true,
			showBackButtonOnTablet: true,
			backButtonText : "Back"
		});
	},

	members : {
		_initialize : function() {
			this.base(arguments);
			var tricks = [ {
				title : "Stand Walk"
			}, {
				title : "Gliding"
			} ];
			var trickList = new qx.ui.mobile.list.List({
				configureItem : function(item, data, row) {
					item.setTitle(data.title);
					item.setShowArrow(true);
				}
			});
			trickList.setModel(new qx.data.Array(tricks));

			this.getContent().add(trickList);
		}
	}
});