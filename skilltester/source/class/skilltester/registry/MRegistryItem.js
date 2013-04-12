qx.Mixin.define("skilltester.registry.MRegistryItem", {

	include : [ qx.core.MProperty ],

	properties : {
		id : {
			inheritable : true
		},
		title : {
			inheritable : true,
			apply: '_applyTitle'
		},
		description : {
			inheritable : true
		}
	},
	
//	construct : function(config) {
//		this.base(arguments);
//		this.set(config);
//	},

	members : {
		_applyTitle: function (value) {
			if (this.getId() == null) {
				var id = value.toLowerCase();
				id = id.replace(/ /g, '-');
				this.setId(id);
			}
			
			if ('_doApplyTitle' in this &&
					typeof(this['_doApplyTitle']) === "function") {
				this._doApplyTitle(value);
			}
		}
		
//		_doApplyTitle: function() {}
	}
});