qx.Class.define("skilltester.page.TestNavPage", {
	extend : qx.ui.mobile.page.NavigationPage,
	implement: [skilltester.registry.IRegistryItem],

	construct : function() {
		this.base(arguments);
	
		this.set({
			id: "test-nav",
			title : "Tests",
			showBackButton : true,
			showBackButtonOnTablet: true,
			backButtonText : "Back"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},

	members : {
		_tricks : null,
		_trickList : null,
		_initialize : function() {
			this.base(arguments);
			this._trickList = new qx.ui.mobile.list.List({
				configureItem : function(item, data, row) {
					item.setTitle(data.getTitle());
					item.setShowArrow(true);
				}
			});
			this._trickList.setModel(new qx.data.Array(skilltester.registry.TrickRegistry.getInstance().getTricks()));
			this._trickList.addListener("changeSelection", function(evt) {
				var tricks = skilltester.registry.TrickRegistry.getInstance().getTricks();
				var path = tricks[evt.getData()].getSlug();
				qx.core.Init.getApplication().getRouter().execute("/test/" + path);
			}, this);

			this.getContent().add(this._trickList);
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