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
			init: {},
			apply: "_applyParams"
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
		_evaluationBox : null,
		_evaluation : null,
		_feedbackBox : null,
		_feedback : null,
		_distributionBox : null,
		_distributionContent: null,
		
		_distribution: null,
		_test: null,
		
		_initialize: function() {
			this.base(arguments);
			
			this._evaluationContent = new qx.ui.mobile.embed.Html();
			this._evaluationBox = new qx.ui.mobile.form.Group();
//			this._evaluationBox.add(new qx.ui.mobile.form.Title("Bewertung"));
			this._evaluationBox.add(this._evaluationContent);
			this._evaluationBox.addCssClass("evaluation");
			
			this._distributionContent = new qx.ui.mobile.embed.Html();
			this._distributionBox = new qx.ui.mobile.form.Group();
			this._distributionBox.add(new qx.ui.mobile.form.Title("Punkte-Verteilung"));
			this._distributionBox.add(this._distributionContent);
			this._distributionBox.addCssClass("distribution");
			
			this._feedback = new qx.ui.mobile.embed.Html();
			this._feedbackBox = new qx.ui.mobile.form.Group();
			this._feedbackBox.add(new qx.ui.mobile.form.Title("Feedback"));
			this._feedbackBox.add(this._feedback);
			
			var isMobile = qx.core.Environment.get("device.type") === 'mobile';
			
			if (isMobile) {
				this.getContent().add(this._evaluationBox);
				this.getContent().add(this._distributionBox);	
			} else {
				var top = new qx.ui.mobile.container.Composite();
				top.setLayout(new qx.ui.mobile.layout.HBox());
				
				top.add(this._evaluationBox, {flex: 1});
				top.add(this._distributionBox, {flex: 2});
				this.getContent().add(top);
			}
			this.getContent().add(this._feedbackBox);
			this.getContent().addCssClass("result-page");
		},
		
		/**
		 * 
		 * @param {skilltester.tricks.Trick} trick
		 */
		_applyTrick: function(trick) {
			if (trick !== null) {
				this.setTitle("Testergebnis für " + trick.getTitle());
				this._test = new skilltester.test.SkillTest();
				this._test.setTrick(trick);
				this._test.setParams(this.getParams());
			}
		},
		
		_applyParams: function(params) {
			if (this._test !== null) {
				this._test.setParams(params);
			}
		},
		
		_start: function() {
			this.base(arguments);
			
			var mark;
			var score = this._test.getScore();
			var mistakes = this._test.getMistakes();
			if (mistakes.fatal.length > 0) {
				mark = 6;
			} else if (mistakes.others.length > 0) {
				mark = 5;
			} else {
				mark = this._test.getMark();
			}
			
			// evaluation
			var evaluation = '<div class="markBox"><h2>Note</h2><span class="mark" data-value="' + 
			mark +'">' + mark + '</span></div>';
			evaluation += '<aside><h2>Punkte</h2>'+
			'<span class="score-reached">'+score+'</span>'+
			'</aside>';
			evaluation += '<aside><h2>Fehler</h2>'+
			'<span class="score-reached">'+ mistakes.all.length + '</span>' +
			'</aside>';
			this._evaluationContent.setHtml(evaluation);
			
			// build distribution UI
//			var tbl = '<table><thead><tr><th>Aktion</th><th>Erreichte Punkte</th>'+
//				'<th>Mögliche Punkte</th></tr></thead></tbody><tbody>';
			var dist = '';
			
			var reg = skilltester.registry.ActionRegistry.getInstance(),
				distribution = this._test.getDistribution();
			Object.keys(distribution).forEach(function(id) {
				var action = reg.get(id);
				var result = distribution[id];
				var actual = result.actual;
				var max = result.max;
				
				var value = result.value;
				
				switch (action.getType()) {
				case "boolean":
					value = value ? 'Ja' : 'Nein';
					break;
					
				case "radio":
					var resultAction = reg.get(value);
					value = resultAction.getTitle();
					break;
				}
				
				dist += '<div>' + action.getTitle() + '</div>'+
				'<div class="result">' + value + '<span class="score">'+
				'<span class="score-reached">'+actual+'</span>'+
				'<span class="score-maximum">/'+max+'</span></span></div>';
			}, this);
			
//			tbl += '</tbody></table>';
			
			this._distributionContent.setHtml(dist);
			
			
			this._feedback.setHtml(JSON.stringify(this.getParams()) + JSON.stringify(mistakes));
		},
		
		_back: function(e) {
			var router = qx.core.Init.getApplication().getRouter();
			router.execute("/test/" + this.getTrick().getSlug(), {
				"test": {
					reverse: true
				}
			});
		}
	}
});