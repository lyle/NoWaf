//@sencha
WAF.onAfterInit = function() {
	
	//create model
	Ext.define('Employee', {
	    extend: 'Ext.data.Model',
	    fields: [
			{name : '__KEY', type : 'int'},
			{name : 'firstname', type : 'string'},
			{name : 'lastname', type : 'string'},
			{name : 'salary', type : 'int'}
	    ]
	});
	
	//init var that will be filled via the proxy of the store
	var data = {
		employees : []
	};
	
	//create store
	var store = Ext.create('Ext.data.Store', {
		storeId : 'employeeStore',
		autoLoad : true,
		model : 'Employee',
		proxy : {
			type : 'memory',
			reader : {
				type : 'json',
				root : 'employees'
			}
		}
	});
	
	//fill data callback for Sencha
	function fillData(result){
		Ext.data.StoreManager.lookup('employeeStore').loadData(result);
	}
	
	Ext.create('Ext.grid.Panel', {
		title: 'List of employees',
		store : store,
		columns : [
			{name : 'firstname', dataIndex : 'firstname', text: 'FirstName'},
			{name : 'lastname', dataIndex : 'lastname', text: 'lastName'},
			{name : 'salary', dataIndex : 'salary', text: 'Salary'}
		],
		width: 500,
		height: 500,
		renderTo : Ext.getBody(),
		cls : 'result-grid'
	});
	
	//exact same performQuery function (except fillData callback used)
	function performTheQuery(event) {
		var valInput = document.getElementById('valueToSearch');
		var valueToSearch = valInput.value;
		ds.Employee.query("lastname == :1", valueToSearch+"*", {
			onSuccess: function(e) {
				e.entityCollection.toArray("firstname,lastname,salary", {
					top:40,
					onSuccess: function(e2) {
						fillData(e2.result);
					}
				});
			}
		});
	}
	
	document.getElementById('performQuery').addEventListener("click", performTheQuery );
	document.getElementById('valueToSearch').addEventListener('keyup', performTheQuery);
	
	//init first values
	performTheQuery('');
}
