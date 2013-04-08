qx.Class.define("skilltester.tricks.Tricks", {

	extend: qx.core.Object,
	construct: function() {
		this.base(arguments);
	},
	
	members: {
		_tricks : Object.create(null),
		
		/**
		 * 
		 * @param {skilltester.tricks.Trick} trick
		 */
		add: function (trick) {
			this._tricks[trick.getId()] = trick;
		},
		
		/**
		 * 
		 * @param {String|skilltester.tricks.Trick} trick
		 */
		has: function (trick) {
			if (trick instanceof skilltester.tricks.Trick) {
				trick = trick.getId();
			}
			
			return this._tricks[trick] !== undefined;
		},
		
		/**
		 * Returns the trick for the given id or null
		 * 
		 * @param {String} trickId
		 */
		get: function (trickId) {
			if (this.has(trickId)) {
				return this._tricks[trickId];
			}
			return null;
		},
		
		remove: function (trick) {
			if (trick instanceof skilltester.tricks.Trick) {
				trick = trick.getId();
			}
			
			if (this.has(trick)) {
				delete this._tricks[trick];
			}
		},
		
		/**
		 * 
		 * @returns {skilltester.tricks.Trick[]}
		 */
		toArray: function() {
			var tricks = [];
			Object.keys(this._tricks).forEach(function (id) {
				tricks.push(this._tricks[id]);
			}, this);
			return tricks;
		}
	}
});
