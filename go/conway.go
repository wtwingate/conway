package main

import (
	"fmt"
	"math/rand/v2"
	"time"
)

const ROWS = 24
const COLS = 80

type Matrix [ROWS][COLS]byte

var next_state = [2][9]byte{
	{0, 0, 0, 1, 0, 0, 0, 0, 0}, // Dead cell states
	{0, 0, 1, 1, 0, 0, 0, 0, 0}, // Living cell states
}

var neighbors = [8][2]int{
	{-1, -1}, {-1, 0}, {-1, 1}, {0, -1}, {0, 1}, {1, -1}, {1, 0}, {1, 1},
}

func main() {
	matrix := init_matrix()
	for {
		print_matrix(matrix)
		matrix = next_matrix(matrix)
		time.Sleep(500 * time.Millisecond)
	}
}

func init_matrix() Matrix {
	matrix := Matrix{}
	for r := range ROWS {
		for c := range COLS {
			if rand.Float64() > 0.5 {
				matrix[r][c] = 1
			} else {
				matrix[r][c] = 0
			}
		}
	}
	return matrix
}

func print_matrix(matrix Matrix) {
	fmt.Print("\033[H\033[2J")
	for r := range ROWS {
		for c := range COLS {
			if matrix[r][c] == 1 {
				fmt.Print("@")
			} else {
				fmt.Print(" ")
			}
		}
		fmt.Print("\n")
	}
	fmt.Print("\n")
}

func next_matrix(matrix Matrix) Matrix {
	next_matrix := Matrix{}
	for r := range ROWS {
		for c := range COLS {
			s := matrix[r][c]
			n := count_neighbors(r, c, matrix)
			next_matrix[r][c] = next_state[s][n]
		}
	}
	return next_matrix
}

func count_neighbors(r, c int, matrix Matrix) int {
	count := 0
	for _, coords := range neighbors {
		nr := r + coords[0]
		if nr < 0 {
			nr = ROWS - 1
		} else if nr >= ROWS {
			nr = 0
		}

		nc := c + coords[1]
		if nc < 0 {
			nc = COLS - 1
		} else if nc >= COLS {
			nc = 0
		}

		count += int(matrix[nr][nc])
	}
	return count
}
