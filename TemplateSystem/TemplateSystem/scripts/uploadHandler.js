
function uploadHandler(request, response)
{
	var parts = request.parts;
	var newEmp = new ds.Employee();
	newEmp.firstname = parts[0].asText;
	newEmp.lastname = parts[1].asText;
	newEmp.salary = parts[2].asText;
	if (parts.length > 3)
		newEmp.photo = parts[3].asPicture;
 	newEmp.save();
}



function uploadHandler2(request, response)
{
	var parts = request.parts;
 	sessionStorage.savedPhoto = parts[0].asPicture;
}

