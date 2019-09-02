describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have camera', async () => {
    await expect(element(by.type('RNCamera'))).toBeVisible();
  });

  it('should have clear list button', async () => {
    await element(by.text('Clear List')).tap();
    // List shall clear
  });
});
