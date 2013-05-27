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
		_summaryBox : null,
		_evaluation : null,
		_feedbackBox : null,
		_feedback : null,
		_evaluationBox : null,
		_evaluationContent: null,
		
		_distribution: null,
		_test: null,
		
		_initialize: function() {
			this.base(arguments);
			
			var summary = new qx.ui.mobile.container.Composite();
			this._summaryContent = new qx.ui.mobile.embed.Html();
			this._summaryBox = new qx.ui.mobile.form.Group();
			this._summaryBox.add(this._summaryContent);
			summary.addCssClass("summary");
			summary.add(this._summaryBox);
			
			this._evaluationContent = new qx.ui.mobile.embed.Html();
			this._evaluationBox = new qx.ui.mobile.form.Group();
			this._evaluationBox.add(new qx.ui.mobile.form.Title("Bewertung"));
			this._evaluationBox.addCssClass("evaluation");
			this._evaluationBox.add(this._evaluationContent);
			
			var isMobile = qx.core.Environment.get("device.type") === 'mobile';
			
			if (isMobile) {
				this.getContent().add(summary);
				this.getContent().add(this._evaluationBox);	
			} else {
				var top = new qx.ui.mobile.container.Composite();
				top.setLayout(new qx.ui.mobile.layout.HBox());
				
				top.add(summary, {flex: 1});
				top.add(this._evaluationBox, {flex: 2});
				this.getContent().add(top);
			}
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
			var fatals = mistakes.fatal.length > 0; 
			if (fatals) {
				mark = 6;
			} else if (mistakes.others.length > 0) {
				mark = 5;
			} else {
				mark = this._test.getMark();
			}
			
			// summary
			var summary = '<div class="markBox"><h2>Note</h2><span class="mark" data-value="' + 
			mark +'">' + mark + '</span></div>';
			summary += '<aside><h2>Punkte</h2>'+
			'<span class="score-reached">'+score+'</span>'+
			'</aside>';
			summary += '<aside><h2>Fehler</h2>'+
			'<span class="score-reached">'+ mistakes.all.length + '</span>' +
			'</aside>';
			this._summaryContent.setHtml(summary);
			
			// evaluation
			var evaluation = '';
			var reg = skilltester.registry.ActionRegistry.getInstance(),
				distribution = this._test.getDistribution();
			
			distribution[-1] = {
				"actual": fatals ? 0 : 25,
				"max": 25,
				"value": mistakes.fatal.length
			};
			
			var all = this._test.getAllFeedback();
			all[-1] = mistakes.fatal.length > 0
				? 'Uh oh, da geht was gewaltig schief, also richtig gewaltig schief. Dringend die Fehler zuerst ausbessern'
				: 'Keine Fehler? Freie Fahrt.';
			
			Object.keys(distribution).forEach(function(id) {
				id = parseInt(id, 10);
				var action = reg.get(id);
				var result = distribution[id];
				var actual = result.actual;
				var max = result.max;
				var value = result.value, resultAction = action;
				
				switch (action.getType()) {
				case "boolean":
					value = value ? 'Ja' : 'Nein';
					break;
					
				case "int":
					if (value == -1) {
						value = "Nicht vorhanden";
					}
					break;
					
				case "radio":
					resultAction = reg.get(value);
					value = resultAction.getTitle();
					break;
				}
				
				var feedback = '-- Feedback noch nicht vorhanden --';
				if (action.getId() in all) {
					feedback = all[action.getId()];
				}

				var indicator = 'ok';
				if (actual < max) {
					indicator = 'can-do-better';
				}

				if (mistakes.all.indexOf(id) !== -1 || id === -1 ? fatals : false) {
					indicator = 'mistake';
				}
				
				if (action.getType() == 'int' && value == "Nicht vorhanden") {
					feedback = 'Hoppla, nichts eingegeben?';
				}

				evaluation += '<div>' + action.getTitle() + '</div>'+
				'<div class="result"><span class="value value-'+indicator+'">' + value + '</span>'+
				'<span class="score"><span class="score-reached">'+actual+'</span>'+
				'<span class="score-maximum">/'+max+'</span></span>'+
				'<p class="feedback-text">' + feedback + '</p>'+
				'</div>';
			}, this);
			
			this._evaluationContent.setHtml(evaluation);
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