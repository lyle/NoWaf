WAF.onAfterInit = function() {

     var tpl = {
    
     	name : 'tpl', 

     	getTemplate : function(name) {
           $.ajax({
            url: name + ".html",
            mimeType: 'application/json', // fixes the bug where firefox thinks this should be xml and throws console error on && in the tpls.
            dataType: 'text'}) // sets to async: false because the tpl MUST be loaded before we proceed.
                .error( function() {
                    console.log("error trying to load template the file ");
                })
                .success( function(tplText) {                	
                	var $newdiv = $('<textarea id="'+name+'" style="display:none;"/>');
                    $('body').append($newdiv);
                	$newdiv.html(tplText);
                    tpl.doTemplate(name);
                 });
	
         },
         
         fillTemplate : function(arr, name){
         	var resultHTML = TrimPath.processDOMTemplate(name, { emps : arr } );
		    $('#display').html(resultHTML);   	
         },	
         
         doTemplate : function(name) {

	    	var valInput = document.getElementById('valueToSearch');
			var valueToSearch = valInput.value;
			ds.Employee.query("lastname == :1", valueToSearch+"*", {
				onSuccess: function(e) {
					e.entityCollection.toArray("firstname,lastname,salary", {
						top:40,
						onSuccess: function(e2) {
							e2.result.size = e2.result.length; 
							tpl.fillTemplate(e2.result, name);
						}
					});
				}
			});         
         }
         
         
    }


    function executeTpl(name)
    {
    	//This is not the most efficient way of doing it because the file is charged each time the event is triggered. 
    	//It would be better to load all the events to an array and use the memory to render the info.    
	    tpl.getTemplate(name);
	}
				
		
		
				
	document.getElementById('valueToSearch').addEventListener('click', function(){ 
	                                                                                executeTpl('tpl_simple');
	                                                                   }, false);

	document.getElementById('valueToSearch').addEventListener('keyup', function(){ 
	                                                                                executeTpl('tpl_simple');
	                                                                   }, false);
	                                                                   	
	document.getElementById('reportByTpl1').addEventListener('click', function(){ 
	                                                                                executeTpl('tpl_report1');
	                                                                   }, false);
	                                                                   
	document.getElementById('reportByTpl2').addEventListener('click', function(){ 
	                                                                                executeTpl('tpl_report2');
	                                                                   }, false);
	                                                                   
	document.getElementById('reportByTpl3').addEventListener('click', function(){ 
	                                                                                executeTpl('tpl_report3');
	                                                                   }, false);	                                                                   
}
