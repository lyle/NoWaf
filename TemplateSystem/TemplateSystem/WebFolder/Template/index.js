//include ("WebFolder/Template/jquery.min.js");
//include ("WebFolder/Template/template.js");

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
	
	function getValues() {
		var valInput = document.getElementById('valueToSearch');
		var valueToSearch = valInput.value;
		debugger;
		ds.Employee.query("lastname == :1", valueToSearch+"*", {
			top :10,
			onSuccess: function(e) {
				debugger;
				return e.entityCollection;
			}
		});
	}
	
	function getTemplate(event) {
        $.ajax({
            url: "tpl_simple.html",
            mimeType: 'application/json', // fixes the bug where firefox thinks this should be xml and throws console error on && in the tpls.
            dataType: 'text',
            async: false }) // sets to async: false because the tpl MUST be loaded before we proceed.
                .error( function() {
                    console.log("error");
                })
                .success( function(tplText) {
                    return tplText;
        } );
	
     }
	
	 function renderTemplate(event) {
	    var val = getValues();
	     debugger;
		var resultingHTML = TrimPath.processDOMTemplate(getTemplate(), getValues());
	 
	    $('div#results').html(resultingHTML);
	 }
	
	
	
	document.getElementById('performQuery').addEventListener("click", performTheQuery );
	document.getElementById('valueToSearch').addEventListener('keyup', performTheQuery);

	document.getElementById('templateRequest').addEventListener("click", renderTemplate);


}
