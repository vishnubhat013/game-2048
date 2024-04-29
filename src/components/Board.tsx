"use client";
import React from "react";
import { useEffect } from "react";

const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

class Grid {
  private cells: Cell[];
  constructor(gridElement: HTMLElement) {
    console.log("Grid constructor called");
    gridElement.style.setProperty("--grid-size", GRID_SIZE.toString());
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
    this.cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      );
    });
  }

  get emptyCells() {
    return this.cells.filter((cell) => cell.tile == null);
  }
  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.emptyCells.length);
    return this.emptyCells[randomIndex];
  }

  get cellsByColumn(): Cell[][] {
    return this.cells.reduce((cellGrid: Cell[][], cell: Cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  get cellsByRow(): Cell[][] {
    return this.cells.reduce((cellGrid: Cell[][], cell: Cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }
}

function createCellElements(gridElement: {
  append: (arg0: HTMLDivElement) => void;
}) {
  console.log("createCellElements called");
  const cells = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.append(cell);
  }
  return cells;
}

class Cell {
  cellElement: any;
  x: any;
  y: any;
  private _tile: any;
  value: any;
  private _mergeTile: any;
  constructor(cellElement: HTMLDivElement, x: number, y: any) {
    this.cellElement = cellElement;
    this.x = x;
    this.y = y;
  }
  get tile() {
    return this._tile;
  }
  set tile(value: any) {
    this._tile = value;
    if (value == null) return;
    this._tile.x = this.x;
    this._tile.y = this.y;
  }

  get mergeTile(): Tile {
    return this._mergeTile;
  }
  set mergeTile(value) {
    this._mergeTile = value;
    if (value == null) return;
    this._mergeTile.x = this.x;
    this._mergeTile.y = this.y;
  }

  canAccept(_tile: any) {
    return (
      this._tile == null ||
      (this.mergeTile == null && this._tile.value == this.value)
    );
  }
}

class Tile {
  private tileElement: any;
  private _x: any;
  private _y: any;
  private _value: any;

  constructor(tileContainer: HTMLElement, value = Math.random() > 0.5 ? 2 : 4) {
    this.tileElement = document.createElement("div");
    this.tileElement.classList.add("tile");
    tileContainer.append(this.tileElement);
    this.value = value;
  }

  set value(v: number) {
    this._value = v;
    this.tileElement.textContent = v;
    const power = Math.log2(v);
    const backgroundLightness = 100 - power * 9;
    this.tileElement.style.setProperty(
      "--background-lightness",
      `${backgroundLightness}%`
    );
    this.tileElement.style.setProperty(
      "--text-lightness",
      `${backgroundLightness <= 50 ? 90 : 10}%`
    );
  }

  set x(_value: any) {
    this._x = _value;
    this.tileElement.style.setProperty("--x", _value);
  }

  set y(_value: any) {
    this._y = _value;
    this.tileElement.style.setProperty("--y", _value);
  }
}

function handleInput(e: { key: any }, grid: Grid) {
  switch (e.key) {
    case "ArrowUp":
      moveUp(grid);
      break;
    case "ArrowDown":
      moveDown(grid);
      break;
    case "ArrowRight":
      moveRight(grid);
      break;
    case "ArrowLeft":
      moveLeft(grid);
      break;
    default:
      break;
  }
}

function moveUp(grid: any) {
  return slidesTiles(grid.cellsByColumn);
}
function moveDown(grid: any) {
  return slidesTiles(
    grid.cellsByColumn.map((column: any) => [...column].reverse())
  );
}
function moveLeft(grid: any) {
  return slidesTiles(grid.cellsByRow);
}
function moveRight(grid: any) {
  return slidesTiles(grid.cellsByRow.map((row: any) => [...row].reverse()));
}

function slidesTiles(cells: (string | any[])[]) {
  cells.forEach((group: string | any[]) => {
    for (let i = 1; i < group.length; i++) {
      const cell = group[i];
      if (cell.tile == null) continue;
      let lastValidcell;
      for (let j = i - 1; j >= 0; j--) {
        const moveToCell = group[j];
        if (!moveToCell.canAccept(cell.tile)) break;
        lastValidcell = moveToCell;
      }

      if (lastValidcell != null) {
        if (lastValidcell.tile != null) {
          lastValidcell.mergeTile = cell.tile;
        } else {
          lastValidcell.tile = cell.tile;
        }
        cell.tile = null;
      }
    }
  });
}

export default function Board() {
  useEffect(() => {
    console.log("Board component mounted or updated");
    const gameBoardDiv = document.getElementById("game-board");
    if (gameBoardDiv) {
      const grid = new Grid(gameBoardDiv);

      grid.randomEmptyCell().tile = new Tile(gameBoardDiv);
      grid.randomEmptyCell().tile = new Tile(gameBoardDiv);
      window.addEventListener("keydown", (event) => {
        handleInput(event, grid);
      });
    }
  }, []);

  return <div className="mx-14 my-28" id="game-board"></div>;
}
