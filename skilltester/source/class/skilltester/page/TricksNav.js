qx.Class.define("skilltester.page.TricksNav", {
	extend : qx.ui.mobile.page.NavigationPage,

	events : {
		"go" : "qx.event.type.Data"
	},
	
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
		_tricks : [],
		_trickList : null,
		_initialize : function() {
			this.base(arguments);
			var trickList = new qx.ui.mobile.list.List({
				configureItem : function(item, data, row) {
					item.setTitle(data.getName());
					item.setShowArrow(true);
				}
			});
			trickList.setModel(new qx.data.Array(this._tricks));
			trickList.addListener("changeSelection", function(evt) {
				var path = this._tricks[evt.getData()].getId();
				this.fireDataEvent("go", {target: "/trick/" + path});
			}, this);

			this.getContent().add(trickList);
		},
		
		setTricks: function(tricks) {
			this._tricks = tricks;
			if (this._trickList != null) {
				this._trickList.setModel(new qx.data.Array(tricks));
			}
		}
	}
});