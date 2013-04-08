qx.Class.define("skilltester.actions.Action", {

	extend: qx.core.Object,
	include : [ qx.core.MProperty ],

	properties : {
		id :{
			inheritable : true
		},
		name : {
			inheritable : true,
			apply: '_applyName'
		},
		description : {
			inheritable : true
		},
		type : {
			inheritable : true,
			init: "boolean",
			check: ["boolean", "int", "radio"]
		},
		options : {
			inheritable : true
		},
		mistake : {
			inheritable : true,
			init: "none",
			check: ["none", "fatal", "critical"]
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
		}
	}
});