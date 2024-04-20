const DELTAS = [
  (0, 1),
  (1, 1),
  (1, 0),
  (1, -1),
  (0, -1),
  (-1, -1),
  (-1, 0),
  (-1, 1),
];

class Grid {
  current;
  prev;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.current = this.gridInit();
    this.prev = null;
  }

  gridInit() {
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

  gridUpdate() {
    this.prev = this.current;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const cell = this.current[i][j];
        cell.alive = this.isCellAlive(i, j);
      }
    }
  }

  isCellAlive(x, y) {
    const cell = this.current[x][y];
    let livingNeighbors = 0;
    for (const d of DELTAS) {
      const nx = x + d[0];
      const ny = y + d[1];
      if (
        nx >= 0 &&
        nx < this.width &&
        ny >= 0 &&
        ny < this.height &&
        this.prev[nx][ny].alive === true
      ) {
        livingNeighbors++;
      }
    }
    if (cell.alive === true) {
      if (livingNeighbors < 2) {
        // Any live cell with fewer than two live neighbors dies,
        // as if by underpopulation.
        return false;
      } else if (livingNeighbors < 4) {
        // Any live cell with two or three live neighbors lives on
        // to the next generation.
        return true;
      } else {
        // Any live cell with more than three live neighbors dies,
        // as if by overpopulation.
        return false;
      }
    } else {
      if (livingNeighbors === 3) {
        // Any dead cell with exactly three live neighbors becomes
        // alive, as if by reproduction.
        return true;
      } else {
        return false;
      }
    }
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
}
