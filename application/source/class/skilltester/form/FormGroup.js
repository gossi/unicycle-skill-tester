qx.Class.define("skilltester.form.FormGroup", {

	extend: qx.ui.mobile.form.Group,
	
	members : {
		_getTagName : function() {
			return "ul";
		}
	}
});