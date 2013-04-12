qx.Class.define("skilltester.page.TestPage", {
	extend : qx.ui.mobile.page.NavigationPage,
	implement: [skilltester.registry.IRegistryItem],
	
	properties: {
		trick: {
			check: "skilltester.entities.Trick",
			apply: "_applyTrick"
		}
	},
	
	construct: function() {
		this.base(arguments);
		
		this.set({
			id : 'test',
			showBackButton : true,
			showBackButtonOnTablet : false,
			backButtonText : "Back"
		});
		
		skilltester.registry.PageRegistry.getInstance().add(this);
	},
	
	members: {
//		_initialize: function() {
//			this.base(arguments);
//		},
		
		_back: function(e) {
			qx.core.Init.getApplication().getRouter().execute("/nav/tests", {
				"test-nav": {
					reverse: true
				}
			});
		},
		
		/**
		 * 
		 * @param {skilltester.tricks.Trick} trick
		 */
		_applyTrick: function(trick) {
			this.setTitle("Test: " + trick.getTitle());
		},
		
		_start: function() {
			this.base(arguments);
			this.getContent().removeAll();
			var actions = {};
			
			// groups
			this.getTrick().getGroups().forEach(function (group) {
				if (this.getTrick().getActionCount(group.getId()) > 0) {
					var title = new qx.ui.mobile.form.Title(group.getTitle());
					var contents = new skilltester.form.FormGroup([], false);
					contents.addCssClass("noMargin");
				
					this.getContent().add(title);
					this.getContent().add(contents);
					
					this.getTrick().getActions(group.getId()).forEach(function (action) {
						var row = new qx.ui.mobile.form.Row();
						row.setLayout(new qx.ui.mobile.layout.VBox());
						
						// label + value
						var top = new qx.ui.mobile.container.Composite();
						top.setLayout(new qx.ui.mobile.layout.HBox());
						
						var label = new qx.ui.mobile.form.Label(action.getTitle());
						top.add(label, {flex: 1});
						
						row.add(top);

						// desc + image
						var explanation = new qx.ui.mobile.container.Composite();
						explanation.setLayout(new qx.ui.mobile.layout.VBox());
						
						var desc = new qx.ui.mobile.basic.Label(action.getDescription());
						desc.addCssClass("description");
						explanation.add(desc);
						row.add(explanation);
						
						// value
						switch (action.getType()) {
						case "boolean":
							var value = new qx.ui.mobile.form.ToggleButton(false, "JA", "NEIN");
							label.setLabelFor(value.getId());
							top.add(value);
							actions[action.getId()] = value;
							break;
							
						case "int":
							var value = new qx.ui.mobile.form.NumberField().set({
								step: 1
							});
							value.addCssClass("intInput");
							label.setLabelFor(value.getId());
							top.add(value);
							actions[action.getId()] = value;
							break;
							
						case "radio":
							var radioCol = new qx.ui.mobile.container.Composite();
							radioCol.setLayout(new qx.ui.mobile.layout.VBox());
							radioCol.addCssClass("options");
							var radios = new qx.ui.mobile.form.RadioGroup();
							actions[action.getId()] = radios;
							
							action.getOptions().forEach(function(option) {
								var optRow = new qx.ui.mobile.form.Row();
								optRow.setLayout(new qx.ui.mobile.layout.HBox().set({alignX: "left"}));
								
								var radio = new qx.ui.mobile.form.RadioButton();
								radio.setModel(option);
								radios.add(radio);
								optRow.add(radio);
								
								var explanation = new qx.ui.mobile.container.Composite();
								explanation.setLayout(new qx.ui.mobile.layout.VBox());
								
								var title = new qx.ui.mobile.form.Label(option.getTitle());
								title.addCssClass("title");
								title.setLabelFor(radio.getId());
								explanation.add(title);
								
								var desc = new qx.ui.mobile.form.Label(option.getDescription());
								desc.addCssClass("description");
								desc.setLabelFor(radio.getId());
								explanation.add(desc);
								
								optRow.add(explanation);
								radioCol.add(optRow);
							}, this);
							
							row.add(radioCol);
							break;
						}

						contents.add(row);
					}, this);
				}
			}, this);
			
			if (this.getTrick().getGroupCount() > 0) {
				this.getContent().add(new qx.ui.mobile.basic.Label("&nbsp; "));
				var submit = new qx.ui.mobile.form.Button("Auswerten");
				submit.addListener("tap", function(e) {
					this._submit(actions);
				}, this);
				this.getContent().add(submit);
			}
		},
		
		_submit: function(actions) {
			var query = this._prepareQuery(actions);
			
			// TODO: save test on the server...
			
			// finally, go to the results page
			qx.core.Init.getApplication().getRouter().execute("/result/" + this.getTrick().getSlug() + "/" + query, {});
		},
		
		_prepareQuery: function(actions) {
			var reg = skilltester.registry.ActionRegistry.getInstance();
			var params = [];
			Object.keys(actions).forEach(function(id) {
				var action = reg.get(id);
				var value = '';
				
				switch (action.getType()) {
				case "boolean":
					value = actions[id].getValue() ? '1' : '0';
					break;
					
				case "int":
					value = actions[id].getValue();
					break;
					
				case "radio":
					value = actions[id].getModelSelection().toArray()[0].getId();
					break;
				}
				
				params.push(id + "=" + value);
			}, this);
			
			return params.join(",");
		}
	}
});