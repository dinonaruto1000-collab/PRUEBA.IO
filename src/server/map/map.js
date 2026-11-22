"use strict";

const {isVisibleEntity} = require("../lib/entityUtils");

exports.foodUtils = require('./food');
exports.virusUtils = require('./virus');
exports.massFoodUtils = require('./massFood');
exports.playerUtils = require('./player');

exports.Map = class {
    constructor(config) {
        this.config = config;
        this.food = new exports.foodUtils.FoodManager(config.foodMass, config.foodUniformDisposition, config.gameWidth, config.gameHeight);
        this.viruses = new exports.virusUtils.VirusManager(config.virus);
        this.massFood = new exports.massFoodUtils.MassFoodManager();
        this.players = new exports.playerUtils.PlayerManager();
    }

    balanceMass(foodMass, gameMass, maxFood, maxVirus) {
        const totalMass = this.food.data.length * foodMass + this.players.getTotalMass();

        const massDiff = gameMass - totalMass;
        const foodFreeCapacity = maxFood - this.food.data.length;
        const foodDiff = Math.min(parseInt(massDiff / foodMass), foodFreeCapacity);
        if (foodDiff > 0) {
            console.debug('[DEBUG] Adding ' + foodDiff + ' food');
            this.food.addNew(foodDiff);
        } else if (foodDiff && foodFreeCapacity !== maxFood) {
            console.debug('[DEBUG] Removing ' + -foodDiff + ' food');
            this.food.removeExcess(-foodDiff);
        }

        const virusesToAdd = maxVirus - this.viruses.data.length;
        if (virusesToAdd > 0) {
            this.viruses.addNew(virusesToAdd);
        }
    }

    enumerateWhatPlayersSee(callback) {
        const extractData = (player) => {
            return {
                x: player.x,
                y: player.y,
                cells: player.cells,
                massTotal: Math.round(player.massTotal),
                hue: player.hue,
                id: player.id,
                name: player.name,
                skin: player.skin || null
            };
        };

        for (let currentPlayer of this.players.data) {
            const screenW = (currentPlayer.screenWidth && currentPlayer.screenWidth > 0) ? currentPlayer.screenWidth : 1920;
            const screenH = (currentPlayer.screenHeight && currentPlayer.screenHeight > 0) ? currentPlayer.screenHeight : 1080;
            const halfW = screenW / 2 + 100;
            const halfH = screenH / 2 + 100;

            const foodCandidates = this.food.grid.queryRect(
                currentPlayer.x - halfW,
                currentPlayer.y - halfH,
                currentPlayer.x + halfW,
                currentPlayer.y + halfH
            );
            const visibleFood = foodCandidates.filter(entity => isVisibleEntity(entity, currentPlayer, false));
            const visibleViruses = this.viruses.data.filter(entity => isVisibleEntity(entity, currentPlayer));
            const visibleMass = this.massFood.data.filter(entity => isVisibleEntity(entity, currentPlayer));

            const visiblePlayers = [];
            for (let player of this.players.data) {
                for (let cell of player.cells) {
                    if (isVisibleEntity(cell, currentPlayer)) {
                        visiblePlayers.push(extractData(player));
                        break;
                    }
                }
            }

            callback(extractData(currentPlayer), visiblePlayers, visibleFood, visibleMass, visibleViruses);
        }
    }
};
