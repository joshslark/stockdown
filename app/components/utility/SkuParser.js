// Todo: Pull this out to config
const hdSkuPrefix = "9807"

recognizeSku (barcodeData) {
	// Example
	// 98071001100100
	var sku = [];
	sku = _recognizePrefix(barcodeData);
	if (!sku) {
		return false;
	}

	// Example: 1001-100-100
	if (sku["Full"].length === 10) {

		sku["First"] = sku["Full"].slice(0,4);
		sku["Middle"] = sku["Full"].slice(4,7);
		sku["Last"] = sku["Full"].slice(-3);

		return sku["First"] + '-'
			+ sku["Middle"] + '-'
			+ sku["Last"];

	// Example: 999-901
	} else if (sku["Full"].length === 6) {

		sku["First"] = sku["Full"].slice(0,3);
		sku["Last"] = sku["Full"].slice(-3);

		return sku["First"] + '-'
			+ sku ["Last"];
	} else {
		return false;
	}
}

_recognizePrefix (sku) {
	sku["Prefix"] = barcodeData.substring(0,3);
	// Entire Sku
	sku["Full"] = barcodeData.substring(4);

	if (sku["Prefix"] === hdSkuPrefix) {
		return sku; 
	}

	return false;
}
	

