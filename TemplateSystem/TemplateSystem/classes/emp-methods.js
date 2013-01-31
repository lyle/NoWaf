
emp.addMethod("buildData", "dataClass", function(nbCompanies, progressRef) {
	include ("scripts/buildData.js");
	buildData(nbCompanies, progressRef);
},  "public");


emp.addMethod("getStaff", "entity", function() {
	return this.directReports.toArray("firstname,lastname");
}, "public");

emp.addMethod("getFirstOnes", "dataClass", function(limit) {
	limit = limit || 2000;
	var col = ds.Employee.query("ID < :1", limit);
	return col;
}, "public" );

emp.addMethod("getEmps", "entityCollection", function(from, to) {
	from = from || 0;
	to = to || this.length;
	return this.toArray("firstname,lastname,salary", from, to);
	//return this.toArray(ds.Employee.firstname,ds.Employee.lastname,ds.Employee.salary, from, to);
}, "public" );

