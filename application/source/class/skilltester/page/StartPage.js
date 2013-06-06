qx.Class.define("skilltester.page.StartPage", {
	extend : skilltester.page.ContentPage,
	
	construct: function() {
		this.base(arguments);
		
		this.set({
			id: "start",
			file: "start",
			title: "Unicycle Skill Tester",
			showBackButton : true,
			showBackButtonOnTablet : false,
			backButtonText : "Navigation"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},
	
	members: {
		_initialize: function() {
			this.base(arguments);
			
			this._html.setHtml('<blockquote>Um einen Trick zu stehen muss man kämpfen,<br> '+
					'für einen schönen Trick muss man arbeiten.</blockquote>'+
					'Mit Hilfe der App kannst du: <ol>'+
					'<li>Bewegungsfehler finden, die das weitere Lernen von Einradtricks behindern</li>'+
					'<li>Die Bewegungsqaulität steigern</li></ol>'+
					'<p>Starte direkt ein paar <a href="#/nav/tests">Tests</a> oder les dir zuerst '+
					'die <a href="#/nav/anleitung">Anleitung</a> durch, wie diese App funktioniert.</p>');
			
//			this.getContent().add(html);
		},
		
		_getFolderPrefix: function() {
			return 'general';
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