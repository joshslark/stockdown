describe("AisleHeader component", () => {
  const getComponent = () => shallow(<AisleHeader number="0"/>);

  it("should render", () => {
    const component = getComponent();
    expect(component)
