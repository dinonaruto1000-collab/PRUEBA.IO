const util = require("./util");

function getPosition(isUniform, radius, uniformPositions) {
    return isUniform ? util.uniformPosition(uniformPositions, radius) : util.randomPosition(radius);
}

function isVisibleEntity(entity, player, addThreshold = true) {
    const screenW = (player.screenWidth && player.screenWidth > 0) ? player.screenWidth : 1920;
    const screenH = (player.screenHeight && player.screenHeight > 0) ? player.screenHeight : 1080;
    const entityHalfSize = entity.radius + (addThreshold ? entity.radius * 0.1 : 0);
    return util.testRectangleRectangle(
        entity.x, entity.y, entityHalfSize, entityHalfSize,
        player.x, player.y, screenW / 2, screenH / 2);
}

module.exports = {
    getPosition,
    isVisibleEntity
}
