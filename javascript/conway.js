const DELTAS = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

class Grid {
  constructor() {
    this.width = 80;
    this.height = 64;
    this.size = 10;
    this.speed = 200;
    this.cells = this.init();
    this.prev = null;
  }

  init() {
    const cellArray = [];
    for (let i = 0; i < this.width; i++) {
      const cellColumn = [];
      for (let j = 0; j < this.height; j++) {
        const cell = new Cell(i, j, Math.random() < 0.5);
        cellColumn.push(cell);
      }
      cellArray.push(cellColumn);
    }
    return cellArray;
  }

  update() {
    this.prev = structuredClone(this.cells);
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const cell = this.cells[i][j];
        const numAliveNeighbors = this.aliveNeighbors(i, j);
        cell.update(numAliveNeighbors);
      }
    }
  }

  aliveNeighbors(x, y) {
    const cell = this.prev[x][y];
    let numAliveNeighbors = 0;
    for (const d of DELTAS) {
      // check for horizontal wrap
      let nx = x + d[0];
      if (nx < 0) {
        nx = this.width + nx;
      } else if (nx >= this.width) {
        nx = 0 + (nx - this.width);
      }

      // check for vertical wrap
      let ny = y + d[1];
      if (ny < 0) {
        ny = this.height + ny;
      } else if (ny >= this.height) {
        ny = 0 + (ny - this.height);
      }

      if (this.prev[nx][ny].alive === true) {
        numAliveNeighbors++;
      }
    }
    return numAliveNeighbors;
  }

  draw() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const x = i * this.size;
        const y = j * this.size;
        if (this.cells[i][j].alive === true) {
          context.fillRect(x, y, this.size, this.size);
        } else {
          context.clearRect(x, y, this.size, this.size);
        }
      }
    }
  }

  loop() {
    setTimeout(() => {
      this.draw();
      this.update();
      this.loop();
    }, this.speed);
  }
}

class Cell {
  constructor(x, y, alive) {
    this.x = x;
    this.y = y;
    this.alive = alive;
  }

  update(numAliveNeighbors) {
    if (this.alive === true) {
      if (numAliveNeighbors < 2) {
        // Any live cell with fewer than two live neighbors dies,
        // as if by underpopulation.
        this.alive = false;
      } else if (numAliveNeighbors < 4) {
        // Any live cell with two or three live neighbors lives on
        // to the next generation.
        this.alive = true;
      } else {
        // Any live cell with more than three live neighbors dies,
        // as if by overpopulation.
        this.alive = false;
      }
    } else {
      if (numAliveNeighbors === 3) {
        // Any dead cell with exactly three live neighbors becomes
        // alive, as if by reproduction.
        this.alive = true;
      } else {
        this.alive = false;
      }
    }
  }
}

const grid = new Grid();
grid.loop();
