qx.Class.define("skilltester.entities.Group", {

	extend: qx.core.Object,
	include : [ skilltester.registry.MRegistryItem],
	implement: [skilltester.registry.IRegistryItem],

	construct : function(config) {
		this.base(arguments);
		this.set(config);
		skilltester.registry.GroupRegistry.getInstance().add(this);
	},

	members : {
	}
});