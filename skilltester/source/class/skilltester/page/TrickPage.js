qx.Class.define("skilltester.page.TrickPage", {
	extend : qx.ui.mobile.page.NavigationPage,
	
	construct: function() {
		this.base(arguments);
	},
	
	members: {
		_title : null,
		_initialize: function() {
			this.base(arguments);
			
			
		},
		
		/**
		 * 
		 * @param {skilltester.tricks.Trick} trick
		 */
		setTrick: function(trick) {
			this.setTitle(trick.getName());
		}
	}
});