qx.Class.define("skilltester.groups.StandUp", {

	extend: skilltester.actions.Action,

	construct : function() {
		this.base(arguments, {
			name: "Effekt: Aufstehen",
			description: "Die Methode um in die Stand-Up Position zu gelangen"
		});
	}
});