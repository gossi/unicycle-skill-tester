qx.Class.define("skilltester.page.SkillLevelsNavPage", {
	extend : qx.ui.mobile.page.NavigationPage,
	implement: [skilltester.registry.IRegistryItem],
	
	construct : function() {
		this.base(arguments);
		
		this.set({
			id: "skill-levels-nav",
			title : "Skill-Levels",
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
					qx.core.Init.getApplication().getRouter().execute("/skill-level/" + path);
				}
			};
			
			// base
			this.getContent().add(new qx.ui.mobile.form.Title("Base Levels"));
			var list = new qx.ui.mobile.list.List({
				configureItem : controller.configureItem
			});
			list.setModel(new qx.data.Array([{
				title : "Base Level 1",
				path : "base-level-1"
			}, {
				title: "Base Level 2",
				path : "base-level-2"
			}, {
				title: "Base Level 3",
				path : "base-level-3"
			}]));
			list.addListener("changeSelection", controller.changeSelection, this);

			this.getContent().add(list);
			
			// freestyle
			this.getContent().add(new qx.ui.mobile.form.Title("Freestyle Levels"));
			list = new qx.ui.mobile.list.List({
				configureItem : controller.configureItem
			});
			var data = new qx.data.Array();
			for (var i = 1; i <= 9; i++) {
				data.push({
					title : "Freestyle Level " + i,
					path : "freestyle-level-" + i
				});
			}
			list.setModel(data);
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