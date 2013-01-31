// ---- 4D or Wakanda -----


//model.addOutsideCatalog("books", "http://172.19.2.114:7071");

//model.addOutsideCatalog("books", "http://127.0.0.1:8040");

//model.addOutsideCatalog("books", "http://127.0.0.1:8040");

//model.addOutsideCatalog("conf", "http://conf.4D.com");



// ----  sql -----


/* office 
var sqlcat = model.addSQLCatalog("unnom", { 
	hostname: "194.98.194.72",
	user: "wakandaqa",
	password: "wakandaqa",
	database: "benchdb",
	port: 3306,
	ssl: false
});

*/

/*
var people = sqlcat.getClass("people");
var att = people.addAttribute("firstname", "calculated", "string");
att.onGet = function()
{
	return this.first_name.toUpperCase();
}

*/

/* home 
model.addSQLCatalog("unnom", { 
	hostname: "localhost",
	user: "root",
	password: "1111",
	database: "test",
	port: 3306,
	ssl: false
});

*/


