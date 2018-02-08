import BreakpointPartition from "./partition";
import GrinderBlock from "./grinder-block";

const DEFAULT_CONFIG = {
  el: document.body,
  gutter: 2,
  blockSelector: ".block"
};

export default class Grinder {
  constructor(config = {}) {
    this.config = Object.assign(DEFAULT_CONFIG, config);
    this.rows = 0;
    this.idealHeight = 0;
    this.blocks = [];
    this.bindEvents();
    this.update();
  }

  bindEvents() {
    this.resizeHandler = this.resizeHandler || this.onResize.bind(this);
    window.addEventListener("resize", this.resizeHandler);
  }

  onResize() {
    this.update();
  }

  readBlocks() {
    const { config } = this;
    let elements = [...config.el.querySelectorAll(config.blockSelector)];
    this.blocks = elements.map(el => {
      return new GrinderBlock(el);
    });
  }

  updateBlocks() {
    this.blocks.forEach(b => b.updateStyle());
  }

  reflow() {
    const { rows, blocks, idealHeight } = this;
    const { gutter, width } = this.config;
    if (rows < 1) {
      blocks.forEach(b => {
        b.width = parseInt(idealHeight * b.ratio, 10) - gutter * 2;
        b.height = idealHeight;
      });
    } else {
      const weights = blocks.map(b => parseInt(b.ratio * 100, 0));
      const partitions = BreakpointPartition(weights, rows);
      let current = 0;
      partitions.forEach(row => {
        const totalRatio = row.reduce((sum, cell, i) => {
          return sum + blocks[current + i].ratio;
        }, 0);
        row.forEach(() => {
          const block = blocks[current++];
          block.width =
            parseInt(width / totalRatio * block.ratio, 10) - gutter * 2;
          block.height = parseInt(width / totalRatio, 10);
        });
      });
    }
  }

  update() {
    this.readBlocks();
    this.updateMetrics();
    this.reflow();
    this.updateBlocks();
  }

  updateMetrics() {
    const { blocks, config } = this;
    const rect = config.el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const idealHeight = parseInt(height / 2, 10);
    const idealWidth = blocks.reduce((sum, block) => {
      return sum + block.ratio * idealHeight;
    }, 0);
    this.rows = Math.round(idealWidth / width);
    this.idealHeight = idealHeight;
    config.width = width;
    config.height = height;
  }
}
