qx.Class.define("skilltester.registry.AbstractRegistry", {

	type: "abstract",
	extend: qx.core.Object,

	construct : function() {
		this.base(arguments);
		this._items = Object.create(null);
	},

	members : {
		_items: null,
		
		/**
		 * 
		 * @param {skilltester.registry.RegistryItem} item
		 */
		_addItem: function (item) {
			if (!this._hasItem(item)) {
				this._items[item.getId()] = item;
			}
		},
		
		/**
		 * 
		 * @param {String|skilltester.registry.IRegistryItem} item 
		 */
		_hasItem: function(item) {
			if (qx.Class.hasInterface(item, skilltester.registry.IRegistryItem)) {
				item = item.getId();
			}

			return item in this._items;
		},
		
		/**
		 * Returns the item for the given id
		 * 
		 * @param {String} id
		 * @returns {skilltester.registry.IRegistryItem}
		 */
		_getItem: function(id) {
			if (this._hasItem(id)) {
				return this._items[id];
			}
			return null;
		},
		
		/**
		 * 
		 * @param {String|skilltester.registry.IRegistryItem} item
		 */
		_removeItem: function(item) {
			if (qx.Class.hasInterface(item, skilltester.registry.IRegistryItem)) {
				item = item.getId();
			}
			
			delete this._items[item];
		},
		
		/**
		 * 
		 * @returns {qx.type.Array<skilltester.registry.IRegistryItem>}
		 */
		_getItems: function() {
			var values = new qx.type.Array();
			Object.keys(this._items).forEach(function (key) {
				values.push(this._items[key]);
			}, this);
			return values;
		},
		
		/**
		 * 
		 * @returns {String[]}
		 */
		_getIds: function() {
			return Object.keys(this._items);
		}
	}
});