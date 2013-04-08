qx.Class.define("skilltester.actions.HandOnSeat", {

	extend: skilltester.actions.Action,

	construct : function() {
		this.base(arguments, {
			name: "Hand am Sattel",
			description: "Eine Hand hält den Sattel vorne am Griff fest",
			mistake: "fatal"
		});
	}
});