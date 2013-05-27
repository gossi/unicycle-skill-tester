var data = {
	"actions": [{
			id: "extend-legs",
			title: "Beine durchstrecken",
			description: "Die Beine werden durchgestreckt"
		},
		{
			id: "accelerate-upper-body",
			title: "Hebeln mit dem Oberkörper",
			description: "Der Oberkörper knickt an der Hälfte ein, um ihn dann noch oben zu beschleunigen. Mit dem Schwung wird der ganze Körper aufgerichtet."
		},
		{
			id: "leaning-upper-body",
			type: "int",
			title: "Hüftknick/Oberkörper Neigung [°]",
			description: "Der Winkel Rumpf-Bein-Winkel: 180° für durchgestreckten Oberkörper, 90° für einen rechten Winkel im Hüftgelenk."
		},
		{
			id: "hand-on-seat",
			title: "Hand am Sattel",
			description: "Eine Hand hält den Sattel vorne am Griff fest."
		},
		
		{
			id: "rev-per-minute",
			type: "int",
			title: "Umdrehungen pro Minute",
			description: "Die Geschwindigkeit gemessen an den Umdrehungen pro Minute"
		},
		
		
		{
			id: "toe-none",
			title: "Nichts",
			description: "Keine wirkliche Muskelaktivität; die Fußspitze labbert."
		},
		{
			id: "point",
			title: "Point",
			description: "Die Fußspitze ist durchgestreckt. Die Wadenmuskulatur ist sichtbar konrahiert und von Fußspitze zum Knie ergibt sich eine gerade Linie."
		},
		{
			id: "flex",
			title: "Flex",
			description: "Die Fußspitze ist angezogen. Die Wadenmuskulatur ist sichtbar gedehnt und der Schienbeinmuskel kontrahiert."
		},
		{
			id: "toe",
			type: "radio",
			title: "Fußspitze",
			items: ["toe-none", "point", "flex"]
		},
		{
			id: "extended-leg",
			title: "Durchgestrecktes Bein?",
			description: "Ist das Bein durchgestreckt? Muskelspannung im Bein ist wahrnehmbar."
		}
	],
	"groups": [
	    {
			id: "stand-up",
			title: "Körper Aufrichten",
			description: "Die Methode um in die Stand-Up Position zu gelangen"
		},
		{
			id: "speed",
			title: "Geschwindigkeit"
		},
		{
			id: "body-tension",
			title: "Körperspannung"
		},
		{
			id: "aesthetics",
			title: "Ästhetik"
		}
	],
	"tricks": [
		{
			title: "Standwalk"
		},
		{
			title: "Wheel Walk to Stand Walk",
			items: {
				"stand-up": ["extend-legs", "leaning-upper-body", "accelerate-upper-body", "hand-on-seat"]
			},
			feedback: {
				"extend-legs": {
					
				},
				"leaning-upper-body": {
					values: {
						"<90": {
							value: 0
						},
						"90-135": {
							value: 0,
							mistake: "critical"
						},
						"135-170": {
							value: 0.5
						},
						"171-190": {
							value: 5,
							feedback: "Das ist die ideale Haltung."
						}
					},
					max: 5
				},
				"accelerate-upper-body": {
					inverted: true,
					mistake: "critical"
				},
				"hand-on-seat": {
					values: {
						1: "Hand ist Bösester Fehler, nur für Luschen.",
						0: "Sauber, niemals die Hand."
					},
					inverted: true,
					mistake: "fatal"
				}
			}
		},
		{
			title: "Spin 1ft ext",
			items: {
				"speed": ["rev-per-minute"],
				"body-tension": ["extended-leg", "toe"]
			},
			feedback: {
				"rev-per-minute": {
					values: {
						"<45": {
							value: 0,
							feedback: "Sehr viel üben du noch musst."
						},
						"45-60": {
							value: 1,
							feedback: "Du fährst den Spin mit Basisgeschwindigkeit"
						},
						"61-80": {
							value: 2,
							feedback: "Oha, dein Spin ist ja schon ein bisschen schnell - Geb noch weiter Gas!"
						},
						"81-100": {
							value: 3,
							feedback: "Nun, dein Spin hat ja schon eine Stramme Geschwindigkeit, ein bisschen mehr geht noch!"
						},
						"101-120": {
							value: 4,
							feedback: "Das ist ja mal ein Spin mit Dampf!"
						},
						">120": {
							value: 5,
							feedback: "Boah Krass, ein Spin mit Volldampf!"
						}
					},
					max: 5,
					percent: 25
				},
				"extended-leg": {
					weight: 1
				},
				"toe": {
					values: {
						"toe-none": {
							value: 0
						},
						"point": {
							value: 5
						},
						"flex": {
							value: 0
						}
					},
					max: 5
				},
				conditionals: [{
					conditions: {
						and: {
							"extended-leg" : "on",
							"toe": "point"
						}
					},
					feedback: ["Dein Bein muss sicherlich so starr wie ein Holzbein anfühlen, oder? Aber so ist es richtig. Die Streckung zeugt von trainierter Körperspannung."]
				}]
			}
		}
	]
};