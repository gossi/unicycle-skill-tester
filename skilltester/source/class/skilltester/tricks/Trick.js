qx.Class.define("skilltester.tricks.Trick", {

	extend: qx.core.Object,
	include : [ qx.core.MProperty ],

	properties : {
		name : {
			inheritable : true,
			apply: '_applyName'
		},
		id : {
			inheritable: true
		}
	},

	construct : function(config) {
		this.base(arguments);
		this.set(config);
	},

	members : {
		_applyName: function (value, old) {
			if (this.getId() == null) {
				var id = value.toLowerCase();
				id = id.replace(/\s/g, '-');
				this.setId(id);
			}
		},
		
		_actions: Object.create(null),
		_groups: Object.create(null),
		
		/**
		 * 
		 * @param {skilltester.groups.Group} group
		 */
		addGroup: function (group) {
			if (!this._groups[group.getId()]) {
				this._groups[group.getId()] = group;
			}
		},
		
		/**
		 * 
		 * @param {String} id 
		 */
		hasGroup: function(id) {
			return Object.prototype.hasOwnProperty(id, this._groups);
		},
		
		getGroup: function(id) {
			return this._groups[id];
		},
		
		/**
		 * 
		 * @param {String|skilltester.groups.Group} group
		 */
		removeGroup: function(group) {
			if (group instanceof skilltester.groups.Group) {
				group = group.getId();
			}
			
			delete this._groups[group];
		},
		
		/**
		 * 
		 * @param {skilltester.actions.Action} action
		 * @param {String[]} groups
		 */
		addAction: function (action, groups) {
			if (!this._actions[action.getId()]) {
				this._actions[action.getId()] = action;
			}
			
			groups.forEach(function (group) {
				if (this.hasGroup(group)) {
					this.getGroup(group).addAction(action);
				}
			}, this);
		},
		
		/**
		 * 
		 * @param {String} id 
		 */
		hasAction: function(id) {
			return Object.prototype.hasOwnProperty(id, this._actions);
		},
		
		/**
		 * 
		 * @param {String|skilltester.actions.Action} action
		 */
		removeAction: function(action) {
			if (action instanceof skilltester.actions.Action) {
				action = action.getId();
			}
			
			Object.keys(this._groups).forEach(function (group) {
				this.getGroup(group).removeAction(action);
			}, true);
			
			delete this._actions[action];
		}
	}
});