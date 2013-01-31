
var city = model.addClass("City", "Cities");
city.addAttribute("ID", "storage", "long", "key auto");
city.addAttribute("name", "storage", "string");

model.Company.addAttribute("location", "relatedEntity", "City", "City");

city.addAttribute("companies", "relatedEntities", "Companies", "location", { reversePath:true } );

model.Employee.addAttribute("workingPlace", "relatedEntity", "City", "employer.location");

//city.addAttribute("workForce", "relatedEntities", "Employees", "companies.employees");

city.addAttribute("workForce", "relatedEntities", "Employees", "workingPlace", { reversePath:true } );

