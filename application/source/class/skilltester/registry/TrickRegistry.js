qx.Class.define("skilltester.registry.TrickRegistry", {

	type: "singleton",
	extend: skilltester.registry.AbstractRegistry,

	construct : function() {
		this.base(arguments);
	},

	members : {
		_slugs: Object.create(null),

		/**
		 * 
		 * @param {skilltester.tricks.Trick} trick
		 */
		add: function (trick) {
			this._addItem(trick);
			this._slugs[trick.getSlug()] = trick.getId();
		},
		
		/**
		 * 
		 * @param {String|skilltester.tricks.Trick} trick 
		 */
		has: function(trick) {
			return this._hasItem(trick);
		},
		
		/**
		 * Returns the trick for the given id or <code>null</code> if the id doesn't exist.
		 * 
		 * @param {String} id
		 * @returns {skilltester.tricks.Trick}
		 */
		get: function(id) {
			return this._getItem(id);
		},
		
		/**
		 * 
		 * @param {String|skilltester.tricks.Trick} trick 
		 */
		remove: function(trick) {
			this._removeItem(trick);
		},
		
		/**
		 * 
		 * @returns {qx.type.Array<skilltester.tricks.Trick>}
		 */
		getTricks: function() {
			return this._getItems();
		},
		
		/**
		 * Returns all trick ids
		 * 
		 * @returns {String[]}
		 */
		getIds: function() {
			return this._getIds();
		},
		
		/**
		 * Returns the trick for the given slug or <code>null</code> if the slug doesn't exist.
		 *  
		 * @param {String} slug
		 * @returns {skilltester.tricks.Trick}
		 */
		getBySlug: function(slug) {
			if (slug in this._slugs) {
				return this.get(this._slugs[slug]);
			}
			return null;
		}
	}
});