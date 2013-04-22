qx.Class.define("skilltester.test.SkillTest", {
	
	extend: qx.core.Object,
	
	statics: {
		MARKS : {
			"<50": 5,
			"50-66": 4,
			"67-80": 3,
			"81-91": 2,
			">91": 1
		}
	},
	
	properties: {
		trick: {
			check: "skilltester.entities.Trick"
		},
		params: {
			init: {},
			transform: "_transformParams"
		}
	},
	
	construct: function() {
		this._score = null;
		this._distribution = null;
		this.base(arguments);
	},
	
	members: {
		_score: null,
		_distribution: null,

		getMistakes: function() {
			var fatals = [], others = [];
			this.getTrick().getActions().forEach(function (action) { 

				var id = action.getId();
				var mistake = null;
				var feedback = this._getFeedback(id);
				var value = this.getParams()[id];
					
				switch (action.getType()) {
				case "boolean":
					if ('mistake' in feedback && !this._isActionPresent(action)) {
						mistake = feedback['mistake'];
					}
					break;
					
				case "int":
				case "radio":
					if ('values' in feedback) {
						var val = this._getRangeObject(value, feedback['values']);
						if (val && 'mistake' in val) {
							mistake = val['mistake'];
						}
					}
					break;
				}

				if (mistake === "fatal") {
					fatals.push(id);
				} else if (mistake !== "fatal" && mistake !== null) {
					others.push(id);
				}
			}, this);
			
			return {
				'fatal': fatals,
				'others': others,
				'all': fatals.concat(others)
			};
		},
		
		_isActionPresent: function(action) {
			var id = action.getId(),
				value = this.getParams()[id],
				feedback = this._getFeedback(id);
			
			if (typeof(value) === "undefined") {
				return false;
			}
			
			switch (action.getType()) {
			case "boolean":
				return 'inverted' in feedback && feedback['inverted'] ? !value : value;
				break;
			}
			
		},
		
		getScore: function() {
			if (this._score === null) {
				this._score = this._calculateScore();
			}
			
			return this._score;
		},
		
		getMark: function() {
			return this._getRangeObject(this.getScore(), skilltester.test.SkillTest.MARKS);
		},
		
		getDistribution: function() {
			if (this._score === null) {
				this._score = this._calculateScore();
			}
			
			return this._distribution;
		},
		
		_calculateScore: function() {
			var actions = this.getTrick().getActions(); 
			
			// weightings
			var weighted = 0;
			var total = 75;
			
			actions.forEach(function(action) {
				var feedback = this._getFeedback(action.getId());
				
				if ('percent' in feedback) {
					total -= feedback['percent'];
				} else {
					weighted++;
				}
			}, this);
			
			// distribution
			var score = 25;
			this._distribution = {};
			actions.forEach(function(action) {
				var feedback = this._getFeedback(action.getId());
				var max;
				
				if ('percent' in feedback) {
					max = feedback['percent'];
				} else {
					var weight = 1;
					if ('weight' in feedback) {
						weight = feedback['weight'];
					}
					max = Math.round((weight / weighted) * total);
				}
				
				// get value
				var actionScore = this._getActionScore(action, max);
				this._distribution[action.getId()] = {
					'value': this.getParams()[action.getId()],
					'actual': actionScore,
					'max': max
				};
				score += actionScore;
			}, this);
			
			return score;
		},
		
		_getActionScore: function(action, max, value) {
			var id = action.getId();
			var feedback = this._getFeedback(id);
			value = this.getParams()[id] || value;
				
			switch (action.getType()) {
			case "boolean":
				if (this._isActionPresent(action)) {
					return max;
				}
				break;
				
			case "int":
			case "radio":
				if ('values' in feedback) {
					var val = this._getRangeScore(value, feedback['values']);
					
					var lmax = Object.keys(feedback['values']).length;
					if ('max' in feedback) {
						lmax = feedback['max'];
					}
					return Math.round((val/lmax) * max);
				}
				break;
			}
			
			return 0;
		},
		
		_getRangeObject: function(needle, haystack) {
			var keys = Object.keys(haystack);
			for (var i = 0; i < keys.length; i++) {
				var key = "" + keys[i];
				
				if (key === needle) {
					return haystack[key];
				} else if (key.startsWith(">=")) {
					var val = parseInt(key.substr(2), 10);
					if (needle >= val) {
						return haystack[key];
					}
				} else if (key.startsWith("<=")) {
					var val = parseInt(key.substr(2), 10);
					if (needle <= val) {
						return haystack[key];
					}
				} else if (key.startsWith(">")) {
					var val = parseInt(key.substr(1), 10);
					if (needle > val) {
						return haystack[key];
					}
				} else if (key.startsWith("<")) {
					var val = parseInt(key.substr(1), 10);
					if (needle < val) {
						return haystack[key];
					}
				} else if (key.contains("-")){
					var parts = key.split("-"),
						small = parts[0],
						big = parts[1];
					
					if (needle >= small && needle <= big) {
						return haystack[key];
					}
				} 
			}
		},
		
		_getRangeScore: function(needle, haystack) {
			var vobj = this._getRangeObject(needle, haystack);
			var val = 0;
			if (typeof(vobj) === "object" && 'value' in vobj) {
				val = vobj['value'];
			}
			return val;
		},
		
		_getFeedback: function(id) {
			var feedback = this.getTrick().getFeedback();
			if (id in feedback) {
				return feedback[id];
			}
			return {};
		},
		
		_transformParams: function(value) {
			if (typeof(value) === "string") {
				var reg = skilltester.registry.ActionRegistry.getInstance();
				var params = {};
				var pairs = value.split(",");
				pairs.forEach(function (pair) {
					var parts = pair.split("=");
					var key = parts[0];
					var value = parts[1];
					var action = reg.get(key);
						if (action !== null) {
						switch (action.getType()) {
						case "boolean":
							value = value === "1";
							break;
							
						case "int":
							var val = parseInt(value, 10);
							value = isNaN(val) ? 0 : val;
							break;
						}
					}
					
					params[key] = value;
				}, this);
				
				return params;
			}
			return value;
		}
	}
});