#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define ROWS 24
#define COLS 80

const int deltas[8][2] = {
	{0, 1}, {1, 1}, {1, 0}, {1, -1},
	{0, -1}, {-1, -1}, {-1, 0}, {-1, 1}
};

int count_neighbors(int x, int y, char grid[ROWS][COLS]);
void next_generation(char grid[ROWS][COLS]);
void print_grid(char grid[ROWS][COLS]);

int main(void)
{
	int x, y;
	char grid[ROWS][COLS];

	for (x = 0; x < ROWS; x++) {
		for (y = 0; y < COLS; y++) {
			grid[x][y] = rand() % 2 == 0 ? '@' : ' ';
		}
	}

	for (;;) {
		print_grid(grid);
		next_generation(grid);
		printf("\e[1;1H\e[2J");
		sleep(1);
	}

	return 0;
}

int count_neighbors(int x, int y, char grid[ROWS][COLS])
{
	int d, nx, ny;
	int neighbors;

	neighbors = 0;
	for (d = 0; d < 8; d++) {
		nx = x + deltas[d][0];
		ny = y + deltas[d][1];

		if (nx < 0) {
			nx = ROWS - 1;
		} else if (nx > ROWS - 1) {
			nx = 0;
		}

		if (ny < 0) {
			ny = COLS - 1;
		} else if (ny > COLS - 1) {
			ny = 0;
		}

		if (grid[nx][ny] == '@') {
			neighbors++;
		}
	}

	return neighbors;
}

void next_generation(char grid[ROWS][COLS])
{
	int x, y, n;
	char prev_grid[ROWS][COLS];

	memcpy(prev_grid, grid, sizeof(char) * ROWS * COLS);

	for (x = 0; x < ROWS; x++) {
		for (y = 0; y < COLS; y++) {
			n = count_neighbors(x, y, prev_grid);
			if (prev_grid[x][y] == '@') {
				grid[x][y] = (n == 2 || n == 3) ? '@' : ' ';
			} else {
				grid[x][y] = (n == 3) ? '@' : ' ';
			}
		}
	}
}

void print_grid(char grid[ROWS][COLS])
{
	int x, y;

	for (x = 0; x < ROWS; x++) {
		for (y = 0; y < COLS; y++) {
			printf("%c", grid[x][y]);
		}
		printf("\n");
	}
}
