"use strict";

const util = require('../lib/util');
const { v4: uuidv4 } = require('uuid');
const {getPosition} = require("../lib/entityUtils");
const SpatialHashGrid = require('../lib/spatial-hash');

class Food {
    constructor(position, radius) {
        this.id = uuidv4();
        this.x = position.x;
        this.y = position.y;
        this.radius = radius;
        this.mass = Math.random() + 2;
        this.hue = Math.round(Math.random() * 360);
    }
}

exports.FoodManager = class {
    constructor(foodMass, foodUniformDisposition, gameWidth = 5000, gameHeight = 5000) {
        this.data = [];
        this.foodMass = foodMass;
        this.foodUniformDisposition = foodUniformDisposition;
        this.grid = new SpatialHashGrid(gameWidth, gameHeight, 250);
    }

    addNew(number) {
        const radius = util.massToRadius(this.foodMass);
        while (number--) {
            const position = getPosition(this.foodUniformDisposition, radius, this.data);
            const food = new Food(position, radius);
            this.data.push(food);
            this.grid.insert(food);
        }
    }

    removeExcess(number) {
        while (number-- && this.data.length) {
            const removed = this.data.pop();
            if (removed) {
                this.grid.remove(removed);
            }
        }
    }

    delete(foodsToDelete) {
        if (foodsToDelete && foodsToDelete.length > 0) {
            for (let i = 0; i < foodsToDelete.length; i++) {
                const item = this.data[foodsToDelete[i]];
                if (item) {
                    this.grid.remove(item);
                }
            }
            this.data = util.removeIndexes(this.data, foodsToDelete);
        }
    }

    deleteFoods(foodsList) {
        if (!foodsList || foodsList.length === 0) return;
        const set = new Set(foodsList);
        for (let food of foodsList) {
            this.grid.remove(food);
        }
        this.data = this.data.filter(item => !set.has(item));
    }

    getEatenFoods(cellCircle, isInsideFn) {
        const candidates = this.grid.queryCircle(cellCircle.pos.x, cellCircle.pos.y, cellCircle.r);
        return candidates.filter(food => isInsideFn(food, cellCircle));
    }
};
