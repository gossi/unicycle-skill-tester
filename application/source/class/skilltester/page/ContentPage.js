qx.Class.define("skilltester.page.ContentPage", {
	extend : qx.ui.mobile.page.NavigationPage,
	implement: [skilltester.registry.IRegistryItem],
	
	properties: {
		file: {
			init: null
		}
	},
	
	construct: function() {
		this.base(arguments);
		this._html = null;
		this._cache = {};
		this.set({
			id: "content",
			showBackButton : true,
			showBackButtonOnTablet : false
		});
	},
	
	members: {
		_html: null,
		_cache: null,
		_initialize: function() {
			this.base(arguments);
			
			var group = new qx.ui.mobile.form.Group();
			this._html = new qx.ui.mobile.embed.Html();
			
			group.add(this._html);
			this.getContent().add(group);
		},
		
		_start: function() {
			this.base(arguments);
			
			var file = this.getFile();
			if (file !== null) {
				try {
					this._setContent(this._getContent(file));
				} catch(e) {
					this._loadContent(file, function(e) {
						var req = e.getTarget(),
							content = req.getResponse();
						
						// cache the result
						this._cache[file] = content;
						
						this._setContent(content);
					});
				}
			}
		},
		
		_setContent: function(content) {
			var title = content.querySelector('h1');
			this.setTitle(title.textContent);
			
			var article = content.querySelector('article');
			
			// nasty workaround
			var tmp = document.createElement("div");
			tmp.appendChild(article);
			this._html.setHtml(tmp.innerHTML);
		},
		
		_getContent: function(file) {
			if (this._hasContent(file)) {
				return this._cache[file];
			}
			
			throw new Error('Content not available ('+file+')');
		},
		
		_hasContent: function(file) {
			return file in this._cache;
		},
		
		_loadContent: function(file, fn) {
			var req = new qx.io.request.Xhr("../../content/" + this._getFolderPrefix() + '/' + this.getFile() + ".html");
			req.setParser('xml');
			req.addListener("success", fn, this);
			req.send();
		}
	}
});