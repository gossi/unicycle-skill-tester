qx.Class.define("skilltester.page.ResultPage", {
	extend : qx.ui.mobile.page.NavigationPage,
	implement: [skilltester.registry.IRegistryItem],
	
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
			check: "skilltester.entities.Trick",
			apply: "_applyTrick"
		},
		params: {
			transform: "_transformParams"
		}
	},
	
	construct: function() {
		this.base(arguments);
		
		this.set({
			id: "result",
			showBackButton : true,
			showBackButtonOnTablet : true,
			backButtonText : "Nochmal"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},
	
	members: {
		_markBox : null,
		_mark : null,
		_feedbackBox : null,
		_feedback : null,
		_distributionBox : null,
		_distributionContent: null,
		
		_distribution: null,
		
		_initialize: function() {
			this.base(arguments);
			
			this._markBox = new qx.ui.mobile.form.Group();
			this._markBox.add(new qx.ui.mobile.form.Title("Note"));
			
			this._mark = new qx.ui.mobile.basic.Label();
			this._mark.addCssClass("mark");
			
			this._markBox.add(this._mark);
			
			this._feedback = new qx.ui.mobile.embed.Html();
			this._feedbackBox = new qx.ui.mobile.form.Group();
			this._feedbackBox.add(new qx.ui.mobile.form.Title("Feedback"));
			this._feedbackBox.add(this._feedback);
			
			this._distributionContent = new qx.ui.mobile.embed.Html();
			this._distributionBox = new qx.ui.mobile.form.Group();
			this._distributionBox.add(new qx.ui.mobile.form.Title("Punkte-Verteilung"));
			this._distributionBox.add(this._distributionContent);
			
			this.getContent().add(this._markBox);
			this.getContent().add(this._distributionBox);
			this.getContent().add(this._feedbackBox);
		},
		
		/**
		 * 
		 * @param {skilltester.tricks.Trick} trick
		 */
		_applyTrick: function(trick) {
			this.setTitle("Testergebnis für " + trick.getTitle());
		},
		
		_start: function() {
			this.base(arguments);
			
			var mark;
			var score = this._calculateScore();
			var mistakes = this._getMistakes();
			if (mistakes.fatal.length > 0) {
				mark = 6;
			} else if (mistakes.others.length > 0) {
				mark = 5;
			} else {
				mark = this._getRangeValue(score, skilltester.page.ResultPage.MARKS);
			}
			
			this._feedback.setHtml(JSON.stringify(this.getParams()));
			this._mark.setValue(""+score);
			this._mark.getContainerElement().setAttribute("data-value", mark);
			
			// build distribution UI
			var tbl = '<table><thead><tr><th>Aktion</th><th>Erreichte Punkte</th>'+
				'<th>Mögliche Punkte</th></tr></thead></tbody><tbody>';
			
			var reg = skilltester.registry.ActionRegistry.getInstance();
			Object.keys(this._distribution).forEach(function(id) {
				var action = reg.get(id);
				var values = this._distribution[id];
				var actual = values.actual;
				var max = values.max;
				
				tbl += '<tr><td>'+action.getTitle()+'</td><td>'+actual+'</td><td>'+max+'</td></tr>';
			}, this);
			
			tbl += '</tbody></table>';
			
			this._distributionContent.setHtml(tbl);
		},
		
		_getMistakes: function() {
			var keys = Object.keys(this.getParams()),
				reg = skilltester.registry.ActionRegistry.getInstance(),
				fatals = [], others = [];
			
			keys.forEach(function(id) {
				var action = reg.get(id);
				var mistake = this._getMistake(action);
				if (mistake === "fatal") {
					fatals.push(id);
				} else if (mistake !== "fatal" && mistake !== "none") {
					others.push(id);
				}
			}, this);
			
			return {
				'fatal': fatals,
				'others': others,
				'all': fatals.concat(others)
			};
		},
		
		_getMistake: function(action) {
			if (action.getMistake() === "none") {
				return "none";
			}
			
			var id = action.getId(),
				value = this.getParams()[id];
				feedback = this._getFeedback(id);
			
			switch (action.getType()) {
			case "boolean":
				if (('inverted' in feedback && feedback['inverted'] && !value) 
						|| value) {
					return this.getMistake();
				}
				break;
			
			case "radio":
				return this._getMistake(skilltester.registry.ActionRegistry.getInstance().get(value));
				break;
			}
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
				var value = this._getValue(action, max);
				this._distribution[action.getId()] = {
					'actual': value,
					'max': max
				};
				score += value;
			}, this);
			
			return score;
		},
		
		_getValue: function(action, max, value) {
			var id = action.getId();
			var feedback = this._getFeedback(id);
			value = this.getParams()[id] || value;
				
			switch (action.getType()) {
			case "boolean":
				if (('inverted' in feedback && feedback['inverted'] && !value) 
						|| value) {
					return max;
				}
				break;
				
			case "int":
				if ('values' in feedback) {
					var vobj = this._getRangeValue(value, feedback['values']);
					var val = 0;
					if (typeof(vobj) === "object" && 'value' in vobj) {
						val = vobj['value'];
					}
					
					var lmax = Object.keys(feedback['values']).length;
					if ('max' in feedback) {
						lmax = feedback['max'];
					}
					return Math.round((val/lmax) * max);
				}
				break;
			
			case "radio":
				// update params
				return this._getValue(skilltester.registry.ActionRegistry.getInstance().get(value), max, true);
				break;
			}
			
			return 0;
		},
		
		_getRangeValue: function(needle, haystack) {
			var keys = Object.keys(haystack);
			for (var i = 0; i < keys.length; i++) {
				key = "" + keys[i];
				if (key.startsWith(">=")) {
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
				} else {
					var parts = key.split("-"),
						small = parts[0],
						big = parts[1];
					
					if (needle >= small && needle <= big) {
						return haystack[key];
					}
				}
			}
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
					switch (reg.get(key).getType()) {
					case "boolean":
						value = value === "1";
						break;
						
					case "int":
						var int = parseInt(value, 10);
						value = isNaN(int) ? 0 : int;
						break;
					}
					
					params[key] = value;
				}, this);
				
				return params;
			}
			return value;
		},
		
		_back: function(e) {
			qx.core.Init.getApplication().getRouter().execute("/test/" + this.getTrick().getSlug(), {
				"test": {
					reverse: true
				}
			});
		}
	}
});