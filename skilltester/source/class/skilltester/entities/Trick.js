qx.Class.define("skilltester.entities.Trick", {

	extend: qx.core.Object,
	include : [ skilltester.registry.MRegistryItem],
	implement: [skilltester.registry.IRegistryItem],

	construct : function(config) {
		this._actionIds = new qx.type.Array();
		this.base(arguments);
		this.set(config);
		skilltester.registry.TrickRegistry.getInstance().add(this);
	},
	
	properties: {
		slug: {
			init: null
		},
		items: {
//			transform: "_transformItems",
			apply: "_applyItems",
			init: {}
		},
		feedback: {
			init: {}
		}
	},

	members : {
		_actionIds: null,
		_groups : null,
		
		_applyItems: function(value) {
			Object.keys(value).forEach(function(group) {
				value[group].forEach(function (id) {
					if (!this._actionIds.contains(id)) {
						this._actionIds.push(id);
					}
				}, this);
			}, this);
		},
		
		/**
		 * 
		 * @param {String} id
		 */
		addGroup: function (id) {
			if (!this.hasGroup()) {
				this.getItems().set(id, []);
				this._groups = null;
			}
		},
		
		/**
		 * 
		 * @param {String} id 
		 */
		hasGroup: function(id) {
			return id in this.getItems();
		},
		
		/**
		 * 
		 * @param {String} id
		 */
		removeGroup: function(id) {
			if (this.hasGroup(id)) {
				delete this.getItems()[id];
				this._groups = null;
			}
		},
		
		/**
		 * 
		 * @returns {qx.type.Array<skilltester.entities.Group>}
		 */
		getGroups: function() {
			if (this._groups === null) {
				var reg = skilltester.registry.GroupRegistry.getInstance();
				this._groups = new qx.type.Array();
				Object.keys(this.getItems()).forEach(function(id) {
					this._groups.push(reg.get(id));
				}, this);
			}
			return this._groups;
		},
		
		getGroupCount: function() {
			return Object.keys(this.getItems()).length;
		},
		
		/**
		 * Asks for the existence of an action id for the whole trick or for a dedicated group.
		 * 
		 * @param {String} actionId
		 * @param {String?} groupId
		 */
		hasAction: function(actionId, groupId) {
			if (typeof(groupId) === "undefined") {
				return this._actionIds.contains(actionId);
			} else if (this.hasGroup(groupId)) {
				return this.getItems().get(groupId).contains(actionId);	
			}
			
			return false;
		},

		/**
		 * Returns the action ids for the given group id or <code>null</code> if the 
		 * group doesn't exist
		 * 
		 * @param {String} id the group id
		 * @returns {String[]}
		 */
		getActionIds: function(id) {
			if (typeof(id) === "undefined") {
				return this._actionIds;
			} else if (this.hasGroup(id)) {
				return this.getItems()[id];
			}
			return null;
		},
		
		/**
		 * Returns the actions for the given group id or <code>null</code> if the 
		 * group doesn't exist
		 * 
		 * @param {String} id the group id
		 * @returns {qx.type.Array<skilltester.entities.Action>}
		 */
		getActions: function(id) {
			var reg = skilltester.registry.ActionRegistry.getInstance();
			if (!id) {
				var actions = new qx.type.Array();
				this.getActionIds().forEach(function(id) {
					actions.push(reg.get(id));
				}, this);
				return actions;
			} else if (this.hasGroup(id)) {
				var actions = new qx.type.Array();
				this.getItems()[id].forEach(function(id) {
					actions.push(reg.get(id));
				}, this);
				return actions;
			}
			return null;
		},
		
		/**
		 * Returns the amount of actions for a given group id or <code>null</code> 
		 * if the group doesn't exist
		 * 
		 * @param id
		 * @returns
		 */
		getActionCount: function(id) {
			if (this.hasGroup(id)) {
				return this.getItems()[id].length;
			}
			return null;
		},
		
		/**
		 * Adds one or multiple actions to a given group
		 * 
		 * @param {String} groupId
		 * @param {String|String[]} actionId
		 */
		addAction: function(groupId, actionId) {
			if (!this.hasGroup(groupId)) {
				this.addGroup(groupId);
			}
			
			var group = this.getItems().get(groupId);
			
			if (Array.isArray(actionId)) {
				actionId.forEach(function(actionId) {
					if (!this.hasAction(actionId, groupId)) {
						group.push(actionId);
					}
				}, this);
			} else {
				if (!this.hasAction(actionId, groupId)) {
					group.push(actionId);
				}
			}
		},
		
		_doApplyTitle: function (value) {
			if (this.getSlug() == null) {
				var slug = value.toLowerCase();
				slug = slug.replace(/ /g, '-');
				this.setSlug(slug);
			}
		}
	}
});