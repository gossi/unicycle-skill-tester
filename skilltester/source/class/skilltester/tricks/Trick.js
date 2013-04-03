qx.Class.define("skilltester.tricks.Trick", {

	type : "abstract",
	includes : [ qx.core.MEvent, qx.core.MProperty ],

	properties : {
		name : {
			inheritable : true
		}
	},

	construct : function() {
		this.set(arguments[0]);
	},

	members : {

	}
});