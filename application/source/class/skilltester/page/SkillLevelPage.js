qx.Class.define("skilltester.page.SkillLevelPage", {
	extend : qx.ui.mobile.page.NavigationPage,
	implement: [skilltester.registry.IRegistryItem],
	
	properties: {
		level: {
			init: null
		}
	},
	
	construct: function() {
		this.base(arguments);
		
		this._list = null;
		this._levels = {
			'base-level-1': {
				title: 'Base Level 1',
				items: [{
						title: 'Aufstieg'
					}, {
						title: '10 Umdrehungen fahren'
					}, {
						title: 'Abstieg'
					}]
			},
			'base-level-2': {
				title: 'Base Level 2',
				items: [{
						title: 'Kreis fahren'
					}, {
						title: '10x Hopping'
					}, {
						title: '10x Idling'
					}]
			},
			'base-level-3': {
				title: 'Base Level 3',
				items: [{
						title: 'Eine Acht fahren'
					}, {
						title: '10 Umdrehungen rückwärts fahren'
					}]
			},
			'freestyle-level-1': {
				title: 'Freestyle Level 1',
				items: [{
						title: '1 Anfänger Aufstieg'
					}, {
						title: 'Wheel Walk',
						slug: 'wheel-walk'
					}, {
						title: 'Einbein',
						slug: '1ft'
					}, {
						title: 'Rodeo'
					}]
			},
			'freestyle-level-2': {
				title: 'Freestyle Level 2',
				items: [{
						title: '2 Anfänger Aufstiege'
					}, {
						title: '1ft Wheel Walk',
						slug: '1ft-wheel-walk'
					}, {
						title: '2 Kreise Fahren (max. Durchmesser = Basketball ~3,4m)'
					}, {
						title: 'Rodea'
					}]
			},
			'freestyle-level-3': {
				title: 'Freestyle Level 3',
				items: [{
						title: '3 Anfänger Aufstiege'
					}, {
						title: 'Gliding',
						slug: 'gliding'
					}, {
						title: '2 Kreise rückwärts Fahren'
					}, {
						title: '10 Umdrehungen Spin',
						slug: 'spin'
					}]
			},
			'freestyle-level-4': {
				title: 'Freestyle Level 4',
				items: [{
						title: '1 Fortgeschrittener Aufstieg'
					}, {
						title: 'Koosh-Koosh'
					}, {
						title: '1ft Wheel Walk to Standwalk',
						slug: '1ft-wheel-walk-to-standwalk'
					}, {
						title: 'Standwalk',
						slug: 'standwalk'
					}, {
						title: 'Backturn'
					}, {
						title: '10x Hopping Seat Out'
					}]
			},
			'freestyle-level-5': {
				title: 'Freestyle Level 5',
				items: [{
						title: '2 Fortgeschrittene Aufstiege'
					}, {
						title: 'Stand Up Koosh-Koosh'
					}, {
						title: 'Gliding mit 180° Tipspin to Wheel-Walk'
					}, {
						title: 'Frontturn'
					}, {
						title: '40 Umdrehungen Spin',
						slug: 'spin'
					}, {
						title: 'Drag Seat in-front'
					}, {
						title: 'Aerial',
						slug: 'aerial'
					}]
			},
			'freestyle-level-6': {
				title: 'Freestyle Level 6',
				items: [{
						title: '3 Fortgeschrittene Aufstiege'
					}, {
						title: 'Gliding to Standgliding frh',
						slug: 'gliding-to-standgliding'
					}, {
						title: 'Standgliding',
						slug: 'standgliding'
					}, {
						title: 'Seat-on-side Spin'
					}, {
						title: 'Hopping on Wheel'
					}, {
						title: '180° Hoptwist frh'
					}]
			},
			'freestyle-level-7': {
				title: 'Freestyle Level 7',
				items: [{
						title: '1 Könner Aufstieg'
					}, {
						title: 'Standsidewalk'
					}, {
						title: 'Cross-Over (Kreis)'
					}, {
						title: 'Drag Seat in-back'
					}, {
						title: '90° Unispin'
					}]
			},
			'freestyle-level-8': {
				title: 'Freestyle Level 8',
				items: [{
						title: '2 Könner Aufstiege'
					}, {
						title: 'Coasting'
					}, {
						title: 'Pirouette (min. 2 Umdrehungen)'
					}, {
						title: '180° Unispin',
						slug: 'unispin'
					}]
			},
			'freestyle-level-9': {
				title: 'Freestyle Level 9',
				items: [{
						title: '3 Könner Aufstiege'
					}, {
						title: 'Standcoasting'
					}, {
						title: 'Standgliding Pirouette'
					}, {
						title: '360° Unispin',
						slug: 'unispin'
					}, {
						title: 'Hopping on Wheel 180° Unispin'
					}]
			}
		};
		this.set({
			id : 'skill-level',
			showBackButton : true,
			showBackButtonOnTablet : false,
			backButtonText : "Back"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},
	
	members: {
		_levels: null,
		_list: null,
		_initialize: function() {
			this.base(arguments);
			
			this._list = new qx.ui.mobile.list.List({
				configureItem : function(item, data, row) {
					var slug = 'slug' in data;
					item.setTitle(data.title);
					item.setShowArrow(slug);
//					item.setEnabled(slug);
				}
			});
			this._list.addListener("changeSelection", function(evt) {
				var item = this._levels[this.getLevel()].items[evt.getData()];
				
				if ('slug' in item) {
					qx.core.Init.getApplication().getRouter().execute('/test/' + item.slug, {});
				}
			}, this);

			this.getContent().add(this._list);
		},
		
		_start: function() {
			this.base(arguments);
			
			if (this.getLevel() in this._levels) {
				this._list.setModel(new qx.data.Array(this._levels[this.getLevel()].items));
				this.setTitle(this._levels[this.getLevel()].title);
			}
		},
		
		_back: function(e) {
			qx.core.Init.getApplication().getRouter().execute("/nav/skill-levels", {
				"skill-levels-nav": {
					reverse: true
				}
			});
		}
	}
});