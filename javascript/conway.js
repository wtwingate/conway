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

class Conway {
  constructor(width, height, size) {
    this.width = width;
    this.height = height;
    this.size = size;
    this.speed = 200;
    this.grid = this.create();
  }

  create() {
    const grid = [];
    for (let i = 0; i < this.width; i++) {
      const column = [];
      for (let j = 0; j < this.height; j++) {
        const cell = Math.random() < 0.5;
        column.push(cell);
      }
      grid.push(column);
    }
    return grid;
  }

  update() {
    const newGrid = [];
    for (let x = 0; x < this.width; x++) {
      const newColumn = [];
      for (let y = 0; y < this.height; y++) {
        const cell = this.grid[x][y];
        const numAliveNeighbors = this.aliveNeighbors(x, y);
        newColumn.push(this.liveOrDie(cell, numAliveNeighbors));
      }
      newGrid.push(newColumn);
    }
    this.grid = newGrid;
  }

  aliveNeighbors(x, y) {
    let numAliveNeighbors = 0;
    for (const d of DELTAS) {
      // check for horizontal wrap
      let neighborX = x + d[0];
      if (neighborX < 0) {
        neighborX = this.width + neighborX;
      } else if (neighborX >= this.width) {
        neighborX = 0 + (neighborX - this.width);
      }
      // check for vertical wrap
      let neighborY = y + d[1];
      if (neighborY < 0) {
        neighborY = this.height + neighborY;
      } else if (neighborY >= this.height) {
        neighborY = 0 + (neighborY - this.height);
      }

      if (this.grid[neighborX][neighborY] === true) {
        numAliveNeighbors++;
      }
    }
    return numAliveNeighbors;
  }

  liveOrDie(cell, n) {
    if (cell) {
      return n == 2 || n == 3;
    } else {
      return n == 3;
    }
  }

  draw() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const x_coord = x * this.size;
        const y_coord = y * this.size;
        if (this.grid[x][y]) {
          context.fillRect(x_coord, y_coord, this.size, this.size);
        } else {
          context.clearRect(x_coord, y_coord, this.size, this.size);
        }
      }
    }
  }

  play() {
    setTimeout(() => {
      this.draw();
      this.update();
      this.play();
    }, 250);
  }
}

const game = new Conway(80, 64, 10);
game.play();
