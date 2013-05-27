qx.Class.define("skilltester.page.AboutPage", {
	extend : skilltester.page.ContentPage,
	
	construct: function() {
		this.base(arguments);
		
		this.set({
			id: "about",
			title: "Über den Unicycle Skill Tester",
			showBackButton : true,
			showBackButtonOnTablet : false,
			backButtonText : "Navigation"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},
	
	members: {
		_initialize: function() {
			this.base(arguments);
			
			this._html.setHtml('<article><p>Gebaut vom gossi with <i class="icon-heart"></i></p>'+
					'<ul class="icons-ul"><li><i class="icon-li icon-home"></i><a href="http://einradfahren.de">einradfahren.de</a></li>'+
					'<li><i class="icon-li icon-home"></i><a href="http://gos.si">gos.si</a></li>'+
					'<li><i class="icon-li icon-envelope"></i>gossi<i></i>@einradfahren.de</li>'+
					'<li><i class="icon-li icon-facebook-sign"></i><a href="https://www.facebook.com/UnicycleSkillTesterApp">Skill Tester auf Facebook</a></li>'+
					'</ul></article>');
			
//			this.getContent().add(html);
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