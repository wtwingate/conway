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
  cells;
  prev;
  speed;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = this.init();
    this.prev = null;
    this.speed = 200;
  }

  init() {
    const cells = [];
    for (let i = 0; i < this.width; i++) {
      const column = [];
      for (let j = 0; j < this.height; j++) {
        const cell = new Cell(i, j, Math.random() < 0.5);
        column.push(cell);
      }
      cells.push(column);
    }
    return cells;
  }

  update() {
    this.prev = structuredClone(this.cells);
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const cell = this.cells[i][j];
        const numNeighbors = this.livingNeighbors(i, j);
        cell.update(numNeighbors);
      }
    }
  }

  livingNeighbors(x, y) {
    const cell = this.prev[x][y];
    let neighbors = 0;
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
        ny = this.width + ny;
      } else if (ny >= this.width) {
        ny = 0 + (ny - this.width);
      }

      if (this.prev[nx][ny].alive === true) {
        neighbors++;
      }
    }
    return neighbors;
  }

  draw() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const x = i * 10;
        const y = j * 10;
        if (this.cells[i][j].alive === true) {
          context.fillRect(x, y, 10, 10);
        } else {
          context.clearRect(x, y, 10, 10);
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
  x;
  y;
  alive;

  constructor(x, y, alive) {
    this.x = x;
    this.y = y;
    this.alive = alive;
  }

  update(n) {
    if (this.alive === true) {
      if (n < 2) {
        // Any live cell with fewer than two live neighbors dies,
        // as if by underpopulation.
        this.alive = false;
      } else if (n < 4) {
        // Any live cell with two or three live neighbors lives on
        // to the next generation.
        this.alive = true;
      } else {
        // Any live cell with more than three live neighbors dies,
        // as if by overpopulation.
        this.alive = false;
      }
    } else {
      if (n === 3) {
        // Any dead cell with exactly three live neighbors becomes
        // alive, as if by reproduction.
        this.alive = true;
      } else {
        this.alive = false;
      }
    }
  }
}

const grid = new Grid(80, 80);
grid.loop();
