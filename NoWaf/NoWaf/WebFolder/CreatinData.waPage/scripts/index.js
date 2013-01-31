
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var imageButton1 = {};	// @buttonImage
// @endregion// @endlock

// eventHandlers// @lock

	imageButton1.click = function imageButton1_click (event)// @startlock
	{// @endlock
		$$("pbar").startListening();
		ds.Employee.buildData({
			onSuccess: function(e) {
				$$("pbar").stopListening();
			}, 
			onError: function(e) {
				$$("pbar").stopListening();
			}},
			nbcomp);
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("imageButton1", "click", imageButton1.click, "WAF");
// @endregion
};// @endlock
