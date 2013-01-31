function buildData(nbCompToCreate, progressRef)
{
	var lastNames, firstNames, compNames;
	var nbEmpToCreate = 100000;
	nbCompToCreate = nbCompToCreate || 1000;
	progressRef = progressRef || "buildDataEmp";
	
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
	
	function createRandomEmp(comp, manager, level, maxLevel)
	{
		var nb = 1;
		if (manager != null)
			nb = rangedRandom(2,6);
			
		for (var i = 0; i < nb; ++i)
		{
			var lastname = lastNames.getRandomElement();
			var sex = rangedRandom(0,1);
			var firstname = (sex == 1) ? firstNames.women.getRandomElement() : firstNames.men.getRandomElement();
			
			var emp = new ds.Employee({
				firstname: firstname,
				lastname: lastname,
				woman: (sex == 1),
				birthdate: new Date(rangedRandom(1940, 1990), rangedRandom(0, 11), rangedRandom(0,27)),
				salary: rangedRandom(220, 800) * 100,
				employer: comp
				
			});
			
			if (manager != null)
				emp.manager = manager;
				
			emp.save();
			if (level <= maxLevel)
				createRandomEmp(comp, emp, level+1, maxLevel);
		}
					
	}
	
	//  --------------------- ---------------------
	
	
	lastNames = importLastNames();
	firstNames = importFirstNames();
	compNames = importCompaniesNames();
		
	if (compNames != null)
	{
		for (var i = 0; i < nbCompToCreate; ++i)
		{
			var comp, compName;
			do
			{
				compName = compNames.getRandomElement()+" "+compNames.getRandomElement()+" "+compNames.getRandomElement();
				comp = ds.Company({name: compName });
			} while (comp != null);
			
			comp = new ds.Company({
				name: compName,
				revenues: rangedRandom(5, 100) * 1000000,
				creationDate: new Date(rangedRandom(1900, 2011), rangedRandom(0, 11), rangedRandom(0,27))
			});
			comp.save();
		}
	}
		
	if (lastNames != null && firstNames != null)
	{
		var allCompanies = ds.Company.all();
		var progress = ProgressIndicator(allCompanies.length,"Creating employees on company#{curValue] out of [maxValue}", true, "", progressRef);
		allCompanies.forEach(function(comp,index) {
			progress.setValue(index);
			var nbLevels = rangedRandom(1,5);
			createRandomEmp(comp, null, 0, nbLevels);
		});
		progress.endSession()
	}

}


