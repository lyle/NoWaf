Array.prototype.getRandomElement = function()
{
	var x = rangedRandom(0, this.length-1);
	return this[x];
}

function rangedRandom(from, to)
{
	from = from || 0;
	to = to || 1000;
	var range = to - from;
	return Math.round((Math.random() * range) + from);
}

myGlobalVar = "hello";

//function addProtoFunc(name, func)
//{
//	for (e in ds.dataClasses)
//	{
//		ds[e][name] = func;
//	}
//}

//function test(x)
//{
//	return x*x;
//}

//addProtoFunc("mytest", test);