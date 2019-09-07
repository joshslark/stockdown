describe('StockDown', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  afterEach(async () => {
    await element(by.text('Clear List')).tap();
  });

  it('should have camera', async () => {
    await expect(element(by.type('RNCamera'))).toBeVisible();
  });

  describe('Feature: Barcode Highlighting', () => {

    it('should highlight barcodes', async () => {
      await expect(element(by.id('barcode0'))).toBeVisible();
    });

    it('should add the barcode to the list upon tapping', async () => {
      await element(by.id('barcode0')).tap();
      await expect(element(by.text('1001-382-486'))).toBeVisible();
    });

    it('should have an Add All button that adds all highlighted barcodes', async () => {
      await element(by.id('addAllBtn')).tap();
      await expect(element(by.text('1001-382-486'))).toBeVisible();
      await expect(element(by.text('1003-238-840'))).toBeVisible();
      await expect(element(by.text('1002-166-126'))).toBeVisible();
    });
  });

  describe('Feature: List Title', () => {

    it('should be editable', async () => {
      await element(by.id('listTitleInput')).tap();
      await element(by.id('listTitleInput')).clearText();
      await element(by.id('listTitleInput')).typeText("Sample List Title");
      await expect(element(by.id('listTitleInput'))).toHaveText("Sample List Title");
    });

  });

  describe('Feature: List Manipulation', () => {

    it('should have a clear list button', async () => {
      await expect(element(by.text('Clear List'))).toBeVisible();
    });

    it('should clear the list upon tapping', async () => {
      await (element(by.id('barcode0'))).tap();
      await expect(element(by.text('1001-382-486'))).toBeVisible();

      await (element(by.id('barcode1'))).tap();
      await expect(element(by.text('1003-238-840'))).toBeVisible();

      await (element(by.id('barcode2'))).tap();
      await expect(element(by.text('1002-166-126'))).toBeVisible();

      await element(by.text('Clear List')).tap();

      await expect(element(by.text('1001-382-486'))).toBeNotVisible();
      await expect(element(by.text('1003-238-840'))).toBeNotVisible();
      await expect(element(by.text('1002-166-126'))).toBeNotVisible();
    });

  });
});
