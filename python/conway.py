from os import system
from random import random
from time import sleep

DELTAS = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]


class Conway:
    def __init__(self, width: int, height: int) -> None:
        self.width = width
        self.height = height
        self.grid = self.create_new_grid()

    def create_new_grid(self):
        grid = []
        for _ in range(self.width):
            column = []
            for _ in range(self.height):
                cell = "@" if random() < 0.5 else " "
                column.append(cell)
            grid.append(column)
        return grid

    def print_grid(self):
        for y in range(self.height):
            for x in range(self.width):
                print(self.grid[x][y], end="")
            print()

    def next_generation(self):
        next_grid = []
        for x in range(self.width):
            next_column = []
            for y in range(self.height):
                n = self.count_neighbors(x, y)
                if self.grid[x][y] == "@":
                    next_column.append("@" if 2 <= n <= 3 else " ")
                else:
                    next_column.append("@" if n == 3 else " ")
            next_grid.append(next_column)
        self.grid = next_grid

    def count_neighbors(self, x, y):
        neighbors = 0
        for d in DELTAS:
            nx = x + d[0]
            nx = self.width - 1 if nx < 0 else nx
            nx = 0 if nx > self.width - 1 else nx

            ny = y + d[1]
            ny = self.height - 1 if ny < 0 else ny
            ny = 0 if ny > self.height - 1 else ny

            if self.grid[nx][ny] == "@":
                neighbors += 1
        return neighbors

    def play_game(self):
        try:
            while True:
                system("clear")
                self.print_grid()
                sleep(0.5)
                self.next_generation()
        except KeyboardInterrupt:
            SystemExit()


if __name__ == "__main__":
    conway = Conway(80, 24)
    conway.play_game()
