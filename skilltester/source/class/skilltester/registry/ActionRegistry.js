qx.Class.define("skilltester.registry.ActionRegistry", {

	type: "singleton",
	extend: skilltester.registry.AbstractRegistry,

	construct : function() {
		this.base(arguments);
	},

	members : {
		/**
		 * 
		 * @param {skilltester.actions.Action} action
		 */
		add: function (action) {
			this._addItem(action);
		},
		
		/**
		 * 
		 * @param {String|skilltester.actions.Action} action 
		 */
		has: function(action) {
			return this._hasItem(action);
		},
		
		/**
		 * 
		 * @param {String} id
		 * @returns {skilltester.actions.Action}
		 */
		get: function(id) {
			return this._getItem(id);
		},
		
		/**
		 * 
		 * @param {String|skilltester.actions.Action} action 
		 */
		remove: function(action) {
			this._removeItem(action);
		},
		
		/**
		 * 
		 * @returns {qx.type.Array<skilltester.actions.Action>}
		 */
		getAll: function() {
			return this._getItems();
		}
	}
});