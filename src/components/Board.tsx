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
    console.log(this.cells);
  }

  get emptyCells() {
    return this.cells.filter((cell) => cell.tile == null);
  }
  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.emptyCells.length);
    return this.emptyCells[randomIndex];
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
}

class Tile {
  private tileElement: any;
  private value: number;
  private _x: any;
  private _y: any;

  constructor(tileContainer: HTMLElement, value = Math.random() > 0.5 ? 2 : 4) {
    this.tileElement = document.createElement("div");
    this.tileElement.classList.add("tile");
    tileContainer.append(this.tileElement);
    this.value = value;
  }

  /*/ set Tilevalue(v: any) {
    this.value = v;
    this.tileElement.textcontent = v;
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
  }/*/

  set x(value: any) {
    this._x = value;
    this.tileElement.style.setProperty("--x", value);
  }

  set y(value: any) {
    this._y = value;
    this.tileElement.style.setProperty("--y", value);
  }
}

export default function Board() {
  useEffect(() => {
    console.log("Board component mounted or updated");
    const gameBoardDiv = document.getElementById("game-board");
    if (gameBoardDiv) {
      const grid = new Grid(gameBoardDiv);

      grid.randomEmptyCell().tile = new Tile(gameBoardDiv);
    }
  }, []);

  return <div className="mx-14 my-28" id="game-board"></div>;
}
