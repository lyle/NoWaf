WAF.onAfterInit = function() {
	
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
					}
				});
			}
		});
	}
	
	document.getElementById('performQuery').addEventListener("click", performTheQuery );
	document.getElementById('valueToSearch').addEventListener('keyup', performTheQuery);
}
