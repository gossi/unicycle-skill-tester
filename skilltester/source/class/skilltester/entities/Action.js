qx.Class.define("skilltester.entities.Action", {

	extend: qx.core.Object,
	include : [skilltester.registry.MRegistryItem],
	implement: [skilltester.registry.IRegistryItem],

	properties : {
		type : {
			inheritable : true,
			init: "boolean",
			check: ["boolean", "int", "radio"]
		},
		mistake : {
			inheritable : true,
			init: "none",
			check: ["none", "fatal", "critical"]
		},
		items: {
			init: []
		}
	},

	construct : function(config) {
		this.base(arguments);
		this.set(config);
		skilltester.registry.ActionRegistry.getInstance().add(this);
	},

	members : {
		_options : null,
		/**
		 * 
		 * @param {String} id
		 */
		addOption: function(id) {
			if (this.hasOption(id)) {
				this.getItems().push(id);
				this._options = null;
			}
		},
		
		/**
		 * 
		 * @param {String} id 
		 */
		hasOption: function(id) {
			return this.getItems().indexOf(id) !== -1;
		},
		
		/**
		 * 
		 * @param {String} id
		 */
		removeOption: function(id) {
			var index = this.getItems().indexOf(id);
			if (index !== -1) {
				this.getItems().slice(index, 1);
				this._options = null;
			}
		},
		
		/**
		 * 
		 * @returns {int}
		 */
		getOptionCount: function() {
			return this.__getActionCount();
		},
		
		getOptions: function() {
			if (this._options === null) {
				var reg = skilltester.registry.ActionRegistry.getInstance();
				this._options = new qx.type.Array();
				this.getItems().forEach(function(id) {
					this._options.push(reg.get(id));
				}, this);
			}
			
			return this._options;
		}
	}
});