//model.Company = {
//	collectionName: "Companies",
//	
//	ID: { kind:"storage", type:"long", autoSequence:true, primKey:true },
//	name: { kind:"storage", type:"string" }
//};


comp = model.addClass("Company", "Companies")

comp.addAttribute("ID", "storage", "long", "key auto");
comp.addAttribute("name", "storage", "string", "btree").addEventListener("onSet", setToCapitalizeMultiple);
comp.addAttribute("revenues", "storage", "number");
comp.addAttribute("creationDate", "storage", "date");

comp.addAttribute("employees", "relatedEntities", "Employees", "employer", {reversePath:true});

comp.addEventListener("onRemove", function()
{
	/*
	ds.startTransaction();
	var ok = true;
	try
	{
		this.employees.remove();
	}
	catch (err)
	{
		ok = false;
	}
	if (ok)
		ds.commit();
	else
		ds.rollBack();
		*/
		
	if (this.employees.length > 0)
		return { error : 1000, errorMessage:"la societe n'est pas vide" };
});
