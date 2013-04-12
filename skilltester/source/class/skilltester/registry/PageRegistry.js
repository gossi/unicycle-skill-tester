qx.Class.define("skilltester.registry.PageRegistry", {

	type: "singleton",
	extend: skilltester.registry.AbstractRegistry,

	construct : function() {
		this.base(arguments);
	},

	members : {
		/**
		 * 
		 * @param {skilltester.pages.Page} page
		 */
		add: function (page) {
			this._addItem(page);
		},
		
		/**
		 * 
		 * @param {String|skilltester.pages.Page} page 
		 */
		has: function(page) {
			return this._hasItem(page);
		},
		
		/**
		 * Returns the page for the given id or <code>null</code> if the id doesn't exist.
		 * 
		 * @param {String} id
		 * @returns {skilltester.pages.Page}
		 */
		get: function(id) {
			return this._getItem(id);
		},
		
		/**
		 * 
		 * @param {String|skilltester.pages.Page} page 
		 */
		remove: function(page) {
			this._removeItem(page);
		},
		
		/**
		 * 
		 * @returns {qx.type.Array<skilltester.pages.Page>}
		 */
		getPages: function() {
			return this._getItems();
		},
		
		/**
		 * Returns all page ids
		 * 
		 * @returns {String[]}
		 */
		getIds: function() {
			return this._getIds();
		}
	}
});