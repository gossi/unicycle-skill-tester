qx.Class.define("skilltester.actions.ExtendUpperBody", {

	extend: skilltester.actions.Action,

	construct : function() {
		this.base(arguments, {
			name: "Hebeln mit dem Oberkörper",
			description: "Der Oberkörper knickt an der Hüfte ein, um ihn dann noch oben zu beschleunigen. Mit dem Schwung wird der ganze Körper aufgerichtet",
			mistake: "critical"
		});
	}
});