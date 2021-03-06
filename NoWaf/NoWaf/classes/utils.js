﻿// an 'onSet' event listener

function setToCapitalize(attributeName) 
{
	if (this[attributeName] != null)
	{
		this[attributeName] = this[attributeName].capitalize();
	}
}


function setToCapitalizeMultiple(attributeName) 
{
	if (this[attributeName] != null)
	{
		var arr = this[attributeName].split(" ");
		for (var i = 0, nb = arr.length; i < nb; ++i)
		{
			arr[i] = arr[i].capitalize();
		}
		
		this[attributeName] = arr.join(" ");
	}
}


// data tools to compute a number of years between now and a date
// -------------------------------------------------------------------------

datetool = {};

datetool.computeAge = function computeAge(date)
{
	if (date == null)
		return null;
	else
	{
		var today = new Date();
		var interval = today.getTime() - date.getTime();
		var nbYears = Math.floor(interval / (1000 * 60 * 60 * 24 * 365.25));
		return nbYears;
	}
}

datetool.buildQuery = function buildQuery(compOperator, valueToCompare, attributeName)
{
	if (valueToCompare == null)
	{
		if (compOperator == "==" || compOperator == "===")
			result = attributeName+" is null";
		else
			result = attributeName+" is not null";
	}
	else
	{
		var today = new Date();
		
		var lowerlimit = new Date(today.getFullYear() - valueToCompare - 1, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes());
		var upperlimit = new Date(today.getFullYear() - valueToCompare, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes());
		
		var result = null;
		switch (compOperator)
			{
				case '=':
				case '==':						
				case '!=':
				case '!==':
					result = attributeName+" >= '"+lowerlimit.toISOString()+"'";
					result += " and "+attributeName+" < '"+upperlimit.toISOString()+"'";
					if (compOperator == '!=' || compOperator == '!==')
						result = "not ("+result+")";
					break;
				
				case '>':
					result = attributeName+" < '"+lowerlimit.toISOString()+"'";
					break;
					
				case '>=':
					result = attributeName+" <= '"+upperlimit.toISOString()+"'";
					break;
					
				case '<':
					result = attributeName+" > '"+upperlimit.toISOString()+"'";
					break;
					
				case '<=':
					result = attributeName+" >= '"+lowerlimit.toISOString()+"'";
					break;
			}
	}
	return result;
};

datetool.buildSortQuery = function(ascending, attributeName)
{
	if (ascending)
		return attributeName+" desc";
	else
		return attributeName;
};


// -----------------------------------------------------------------------------------






