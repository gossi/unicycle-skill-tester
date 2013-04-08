qx.Class.define("skilltester.groups.Group", {

	extend: qx.core.Object,
	include : [ qx.core.MProperty ],

	properties : {
		name : {
			inheritable : true,
			apply: '_applyName'
		},
		description : {
			inheritable : true
		},
		id : {
			inheritable : true
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
				id = id.replace(' ', '-');
				this.setId(id);
			}
		},
		
		_actions: Object.create(null),
		
		/**
		 * 
		 * @param {skilltester.actions.Action} action
		 */
		addAction: function (action) {
			if (!this._actions[action.getId()]) {
				this._actions[action.getId()] = action;
			}
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
			
			delete this._actions[action];
		}
	}
});