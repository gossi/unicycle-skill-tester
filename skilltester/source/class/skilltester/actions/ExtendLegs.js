qx.Class.define("skilltester.actions.ExtendLegs", {

	extend: skilltester.actions.Action,

	construct : function() {
		this.base(arguments, {
			name: "Beine durchstrecken",
			description: "Die Beine werden durchgestreckt"
		});
	}
});