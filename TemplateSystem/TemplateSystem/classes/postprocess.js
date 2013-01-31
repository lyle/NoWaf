function addProtoFunc(name, applyTo, func, scope)
{
	for (e in model)
	{
		var cl = model[e];
		if (typeof cl === 'object')
		{
			if (cl.addMethod != null)
			{
				cl.addMethod(name, applyTo, func, scope);
			}
		}
	}
}


function test(x)
{
	return x*x;
}


for (var i = 0; i < 100; ++i)
{
	var cl = model.addClass("class"+i, "classes"+i);
	cl.addAttribute("ID", "storage", "long", "key auto");
	for (var j = 0; j < 20; j++)
	{
		cl.addAttribute("att"+j, "storage", "string");
	}
}

addProtoFunc("mytest", "dataClass", test, "public");
