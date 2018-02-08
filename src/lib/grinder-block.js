const UNIT_MULT = 100;

export default class GrinderBlock {
  constructor(DOMElement) {
    this.DOMElement = DOMElement;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.readAttributes();
  }

  getAttr(name, defaultValue) {
    const { DOMElement: el } = this;
    return el.hasAttribute(name) ? el.getAttribute(name) : defaultValue;
  }

  readAttributes() {
    const size = this.getAttr("data-size", "0,0").split(",");
    this.width = (size[0] | 0) * UNIT_MULT;
    this.height = ((size[1] || size[0]) | 0) * UNIT_MULT;
    this.ratio = this.width / this.height;
    this.background = this.getAttr("data-color", "white");
  }

  updateStyle() {
    let styleBuff = `
        position: relative;
        float: left;
        width: ${this.width}px;
        height: ${this.height}px;
        left: ${this.x}px;
        top: ${this.y}px;
        background-color: ${this.background};
    `;
    this.DOMElement.setAttribute("style", styleBuff);
  }
}
