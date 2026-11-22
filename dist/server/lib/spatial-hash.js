"use strict";

/**
 * SpatialHashGrid - 2D spatial partitioning grid for fast proximity queries.
 * Speeds up entity visibility and collision queries from O(N*M) to near O(1).
 */
class SpatialHashGrid {
  constructor(width, height, cellSize = 250) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.grid = new Map();
    this.itemLocations = new Map();
  }
  _getKey(cx, cy) {
    return cx << 16 | cy;
  }
  _getCellRange(x, y, radius) {
    if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
      return {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0
      };
    }
    const r = Math.max(radius || 4, 1);
    const minX = Math.max(0, Math.min(this.cols - 1, Math.floor((x - r) / this.cellSize)));
    const maxX = Math.max(0, Math.min(this.cols - 1, Math.floor((x + r) / this.cellSize)));
    const minY = Math.max(0, Math.min(this.rows - 1, Math.floor((y - r) / this.cellSize)));
    const maxY = Math.max(0, Math.min(this.rows - 1, Math.floor((y + r) / this.cellSize)));
    return {
      minX,
      maxX,
      minY,
      maxY
    };
  }
  insert(item) {
    if (!item || typeof item.x !== 'number' || typeof item.y !== 'number') return;
    const {
      minX,
      maxX,
      minY,
      maxY
    } = this._getCellRange(item.x, item.y, item.radius);
    const keys = [];
    for (let cx = minX; cx <= maxX; cx++) {
      for (let cy = minY; cy <= maxY; cy++) {
        const key = this._getKey(cx, cy);
        let cell = this.grid.get(key);
        if (!cell) {
          cell = new Set();
          this.grid.set(key, cell);
        }
        cell.add(item);
        keys.push(key);
      }
    }
    this.itemLocations.set(item, keys);
  }
  remove(item) {
    const keys = this.itemLocations.get(item);
    if (!keys) return;
    for (let i = 0; i < keys.length; i++) {
      const cell = this.grid.get(keys[i]);
      if (cell) {
        cell.delete(item);
        if (cell.size === 0) {
          this.grid.delete(keys[i]);
        }
      }
    }
    this.itemLocations.delete(item);
  }
  update(item) {
    this.remove(item);
    this.insert(item);
  }
  queryCircle(x, y, radius) {
    const {
      minX,
      maxX,
      minY,
      maxY
    } = this._getCellRange(x, y, radius);
    const results = [];
    const seen = new Set();
    for (let cx = minX; cx <= maxX; cx++) {
      for (let cy = minY; cy <= maxY; cy++) {
        const cell = this.grid.get(this._getKey(cx, cy));
        if (cell) {
          for (let item of cell) {
            if (!seen.has(item)) {
              seen.add(item);
              results.push(item);
            }
          }
        }
      }
    }
    return results;
  }
  queryRect(minXCoord, minYCoord, maxXCoord, maxYCoord) {
    const minX = Math.max(0, Math.min(this.cols - 1, Math.floor(minXCoord / this.cellSize)));
    const maxX = Math.max(0, Math.min(this.cols - 1, Math.floor(maxXCoord / this.cellSize)));
    const minY = Math.max(0, Math.min(this.rows - 1, Math.floor(minYCoord / this.cellSize)));
    const maxY = Math.max(0, Math.min(this.rows - 1, Math.floor(maxYCoord / this.cellSize)));
    const results = [];
    const seen = new Set();
    for (let cx = minX; cx <= maxX; cx++) {
      for (let cy = minY; cy <= maxY; cy++) {
        const cell = this.grid.get(this._getKey(cx, cy));
        if (cell) {
          for (let item of cell) {
            if (!seen.has(item)) {
              seen.add(item);
              results.push(item);
            }
          }
        }
      }
    }
    return results;
  }
  clear() {
    this.grid.clear();
    this.itemLocations.clear();
  }
}
module.exports = SpatialHashGrid;