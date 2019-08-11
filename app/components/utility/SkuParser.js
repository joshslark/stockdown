  // Todo: Pull this out to config
  const hdSkuPrefix = "9807";

  export const recognizeSku = (barcodeData) => {
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
  };

  _recognizePrefix = (barcodeData) => {
    var sku = [];
    if(!barcodeData) {
      return false;
    }

    sku["Prefix"] = barcodeData.substring(0,4);
    // Entire Sku
    sku["Full"] = barcodeData.substring(4);

    if (sku["Prefix"] === hdSkuPrefix) {
            return sku; 
    }
    console.log(`SkuPrefix was ${sku["Prefix"]}`);
    return false;
  };
