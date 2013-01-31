
function buildModel(destFile)
{
	var model = { dataClasses : []};
	for (var i = 0; i < 10; ++i)
	{
		var cl = { className: "Class"+i, collectionName: "Class"+i+"Collection", attributes: [] };
		model.dataClasses.push(cl);
		cl.attributes.push({ name : "ID", kind: "storage", type: "long", autosequence:true, primKey: true});
		for (var j = 0; j < 20; ++j)
		{
			var att = { name: "att"+i, kind : "storage", type : "string" };
			cl.attributes.push(att);
		}
	}
	
	var json = JSON.stringify(model);
	var xml = JSONToXml(json, "json-bag", "EntityModelCatalog");
	
	saveText(xml, destFile);
}


buildModel(new File("f:\\Model.waModel"));
"done"
