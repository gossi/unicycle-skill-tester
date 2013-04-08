qx.Class.define("skilltester.tricks.WheelWalkToStandWalk", {
	
	extend: skilltester.tricks.Trick,

	construct: function() {
		this.base(arguments, {
			name: "Wheel Walk to Stand Walk"
		});
		
		var standUp = new skilltester.groups.StandUp();
		var standUpId = standUp.getId();
		this.addGroup(standUp);
		this.addAction(new skilltester.actions.HandOnSeat(), [standUpId]);
		this.addAction(new skilltester.actions.ExtendUpperBody(), [standUpId]);
		this.addAction(new skilltester.actions.ExtendLegs(), [standUpId]);
	},
	
	members: {
		
	}
});
