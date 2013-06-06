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
			var pages = [{
				title : "Home",
				path: "/",
				cssClass: "icon-home"
			}, {
				title : "Tests",
				path: "/nav/tests",
				cssClass: "icon-beaker"
			}, {
				title : "Skill-Levels",
				path: "/nav/skill-levels",
				cssClass: "icon-trophy"
			}, {
				title : "Lexikon",
				path : "/nav/knol",
				cssClass: "icon-book"
			}, {
				title : "Anleitung",
				path : "/nav/anleitung",
				cssClass: "icon-medkit"
			}, {
				title : "Info",
				path : "/about",
				cssClass: "icon-info-sign"
			}];
			var navList = new qx.ui.mobile.list.List({
				configureItem : function(item, data, row) {
					item.setTitle(data.title);
					item.setShowArrow(true);
					item.setDefaultCssClass(data.cssClass);
				}
			});
			navList.setModel(new qx.data.Array(pages));
			navList.addListener("changeSelection", function(evt) {
				var path = pages[evt.getData()].path;
				qx.core.Init.getApplication().getRouter().execute(path, {});
			}, this);

			this.getContent().add(navList);
		}
	}
});