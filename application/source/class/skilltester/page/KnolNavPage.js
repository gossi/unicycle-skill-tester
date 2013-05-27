qx.Class.define("skilltester.page.KnolNavPage", {
	extend : qx.ui.mobile.page.NavigationPage,
	implement: [skilltester.registry.IRegistryItem],
	
	construct : function() {
		this.base(arguments);
		
		this.set({
			id: "knol-nav",
			title : "Lexikon",
			showBackButton : true,
			showBackButtonOnTablet : true,
			backButtonText : "Back"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},

	members : {
		_initialize : function() {
			this.base(arguments);
			var knols = [{
				title : "Armhaltungen",
				path : "armhaltungen"
			}, {
				title: "Bewegungsfehler",
				path : "bewegungsfehler"
			}, {
				title: "Bewegungswissen",
				path : "bewegungswissen"
			}, {
				title: "Lernfalle",
				path : "lernfalle"
			}, {
				title: "Strukturen in Unicycling Skills",
				path : "strukturen-in-unicycling-skills"
			}, {
				title: "Strukturmodell von Kassat",
				path : "strukturmodell-kassat"
			}, {
				title: "Technikleitbild",
				path : "technikleitbild"
			}, {
				title: "Techniktraining",
				path : "techniktraining"
			}];
			var knolList = new qx.ui.mobile.list.List({
				configureItem : function(item, data, row) {
					item.setTitle(data.title);
					item.setShowArrow(true);
				}
			});
			knolList.setModel(new qx.data.Array(knols));
			knolList.addListener("changeSelection", function(evt) {
				var path = knols[evt.getData()].path;
				qx.core.Init.getApplication().getRouter().execute("/knol/" + path);
			}, this);

			this.getContent().add(knolList);
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