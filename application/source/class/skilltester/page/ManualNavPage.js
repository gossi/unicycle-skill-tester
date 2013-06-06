qx.Class.define("skilltester.page.ManualNavPage", {
	extend : qx.ui.mobile.page.NavigationPage,
	implement: [skilltester.registry.IRegistryItem],
	
	construct : function() {
		this.base(arguments);
		
		this.set({
			id: "manual-nav",
			title : "Anleitung",
			showBackButton : true,
			showBackButtonOnTablet : true,
			backButtonText : "Back"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},

	members : {
		_initialize : function() {
			this.base(arguments);
			
			var controller = {
				configureItem : function(item, data, row) {
					item.setTitle(data.title);
					item.setShowArrow(true);
				},
				
				changeSelection: function(evt) {
					var data = evt.getTarget().getModel().toArray();
					var path = data[evt.getData()].path;
					qx.core.Init.getApplication().getRouter().execute("/anleitung/" + path);
				}
			};
			
			// general
			var list = new qx.ui.mobile.list.List({
				configureItem : controller.configureItem
			});
			list.setModel(new qx.data.Array([{
				title : "Anleitung",
				path : ""
			}, {
				title: "Schnellanleitung",
				path : "schnellanleitung"
			}]));
			list.addListener("changeSelection", controller.changeSelection, this);

			this.getContent().add(list);
			
			// tests
			this.getContent().add(new qx.ui.mobile.form.Title("Tests"));
			list = new qx.ui.mobile.list.List({
				configureItem : controller.configureItem
			});
			list.setModel(new qx.data.Array([{
				title : "Aufbau",
				path : "testaufbau"
			}, {
				title: "Durchführung",
				path : "testdurchfuehrung"
			}, {
				title: "Auswertung",
				path : "auswertung"
			}]));
			list.addListener("changeSelection", controller.changeSelection, this);

			this.getContent().add(list);
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