qx.Class.define("skilltester.registry.GroupRegistry", {

	type: "singleton",
	extend: skilltester.registry.AbstractRegistry,

	construct : function() {
		this.base(arguments);
	},

	members : {
		/**
		 * 
		 * @param {skilltester.groups.Group} group
		 */
		add: function (group) {
			this._addItem(group);
		},
		
		/**
		 * 
		 * @param {String|skilltester.groups.Group} group 
		 */
		has: function(group) {
			return this._hasItem(group);
		},
		
		/**
		 * 
		 * @param {String} id
		 * @return {skilltester.groups.Group} 
		 */
		get: function(id) {
			return this._getItem(id);
		},
		
		/**
		 * 
		 * @param {String|skilltester.groups.Group} group 
		 */
		remove: function(group) {
			this._removeItem(group);
		},
		
		/**
		 * 
		 * @returns {qx.type.Array<skilltester.groups.Group>}
		 */
		getAll: function() {
			return this._getItems();
		}
	}
});