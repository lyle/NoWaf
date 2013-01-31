WAF.onAfterInit = function() {

	var dojoCombo = null,
		dGrid = null
	;
	require([
		"dojo/dom", 
		"dojo/ready", 
		"dgrid/Grid", 
		"dijit/form/Select", 
		"dojo/parser", 
		"dijit/layout/ContentPane", 
		"dijit/layout/BorderContainer"
	], function(dom, ready, Grid, Select){
	    ready(function(){
			dojoCombo = new Select({
	            name: "FirstName",
	            options: [],
	            maxHeight : "200px"
	        }, "employeeDojoSelect");
	        dojoCombo.startup();
	        dGrid = new Grid({
	            columns: {
		            firstname: "First Name",
		            lastname: "Last Name",
		            salary: "Salary"
		        }
			}, "display2");
	        dGrid.startup();
	    });
	});

	
	function displayArray(arr) {
		var html = "";
		arr.forEach(function(elem) {
			html += '<div class="line">'
			html += '<span class="cell-firstname">' + htmlEncode(elem.firstname) + '</span>';
			html += '<span class="cell-lastname">' + htmlEncode(elem.lastname) + '</span>';
			html += '<span class="cell-salary">' + elem.salary + '</span>';
			html += '</div>'
		});
		var display = document.getElementById('display');
		display.innerHTML = html;
	}
	
	function performTheQuery(event) {
		var valInput = document.getElementById('valueToSearch');
		var valueToSearch = valInput.value;
		ds.Employee.query("lastname == :1", valueToSearch+"*", {
			onSuccess: function(e) {
				e.entityCollection.toArray("firstname,lastname,salary", {
					top:40,
					onSuccess: function(e2) {
						displayArray(e2.result);
						if(dojoCombo != null){
							var options = [];
							e2.result.forEach(function(item){
								options.push({label: item.lastname + " " + item.firstname, value: item.lastname});
							}, this);
							dojoCombo.set("options", []); // reset the values
							dojoCombo.addOption(options);
						}
						if(dGrid != null){
							dGrid.renderArray(e2.result);
						}
					}
				});
			}
		});
	}
	
	document.getElementById('performQuery').addEventListener("click", performTheQuery );
	document.getElementById('valueToSearch').addEventListener('keyup', performTheQuery);
}
