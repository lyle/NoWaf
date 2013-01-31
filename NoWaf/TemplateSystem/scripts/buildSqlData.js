function buildData(nbEmpToCreate)
{
	var lastNames, firstNames, compNames;
	
	function importCompaniesNames()
	{
		var result = [];
		var file = File(getFolder().path+"dataToImport/Companies.txt");
		var text = loadText(file);
		if (text != null)
		{
			var arr = text.split("\r");
			arr.forEach(function(item) {
				item.split("\t").forEach(function(compName) {
					result.push(compName);
				});
			});
		}
		return result;
	}
	
	
	function importLastNames()
	{
		var file = File(getFolder().path+"dataToImport/LastNames.txt");
		var result = null;
		var text = loadText(file);
		if (text != null)
		{
			var arr = text.split("\r");
			result = arr;
		}
		
		return result;
	}


	function importFirstNames()
	{
		var file = File(getFolder().path+"dataToImport/FirstNames.txt");
		var result = null;
		var text = loadText(file);
		if (text != null)
		{
			var arr = text.split("\r");
			result = { men: [], women:[] };
			arr.forEach(function(item)
			{
				var subarr = item.split("\t");
				if (subarr.length > 1)
				{
					if (subarr[1] == "1")
						result.women.push(subarr[0]);
					else
						result.men.push(subarr[0]);
				}
				
			});
		}
		
		return result;
	}
	
	
	//  --------------------- ---------------------
	
	
	lastNames = importLastNames();
	firstNames = importFirstNames();
	compNames = importCompaniesNames();
		
	for (var i = 1; i < nbEmpToCreate; ++i)
	{
		var lastname = lastNames.getRandomElement();
		var sex = rangedRandom(0,1);
		var firstname = (sex == 1) ? firstNames.women.getRandomElement() : firstNames.men.getRandomElement();
		
		var emp = new ds.people({
			
			firstname: firstname,
			lastname: lastname,
			woman: (sex == 1),
			birthdate: new Date(rangedRandom(1940, 1990), rangedRandom(0, 11), rangedRandom(0,27)),
			salary: rangedRandom(220, 800) * 100
		});
		
		try
		{
			emp.save();
		}
		catch (err)
		{
			var x = i;
		}
	}
		
}


buildData(150)

