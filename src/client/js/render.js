"use strict";

const skinPresets = require('./skin-presets');

const FULL_ANGLE = 2 * Math.PI;
const imageCache = {};
let wobbleClock = 0;

const getSkinImage = (skinIdOrUrl) => {
    if (!skinIdOrUrl) return null;
    const url = skinPresets.resolveSkinUrl(skinIdOrUrl);
    if (!url) return null;

    if (imageCache[url]) {
        return imageCache[url].complete && imageCache[url].naturalWidth !== 0 ? imageCache[url] : null;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    imageCache[url] = img;
    return null;
};

const drawRoundObject = (position, radius, graph) => {
    graph.beginPath();
    graph.arc(position.x, position.y, Math.max(radius, 1), 0, FULL_ANGLE);
    graph.closePath();
    graph.fill();
    graph.stroke();
};

const drawFood = (position, food, graph) => {
    graph.fillStyle = 'hsl(' + food.hue + ', 100%, 60%)';
    graph.strokeStyle = 'hsl(' + food.hue + ', 100%, 75%)';
    graph.lineWidth = 1;
    drawRoundObject(position, food.radius, graph);
};

const circlePoint = (origo, radius, theta) => ({
    x: origo.x + radius * Math.cos(theta),
    y: origo.y + radius * Math.sin(theta)
});

const drawVirus = (position, virus, graph) => {
    graph.save();
    graph.strokeStyle = virus.stroke || '#33ff33';
    graph.fillStyle = virus.fill || '#19D119';
    graph.lineWidth = virus.strokeWidth || 6;
    graph.shadowColor = virus.stroke || '#33ff33';
    graph.shadowBlur = 8;

    let sides = 24;
    graph.beginPath();
    for (let i = 0; i < sides; i++) {
        let theta = (i / sides) * FULL_ANGLE;
        // Spiky virus outline
        let r = i % 2 === 0 ? virus.radius : virus.radius * 0.85;
        let point = circlePoint(position, r, theta);
        if (i === 0) {
            graph.moveTo(point.x, point.y);
        } else {
            graph.lineTo(point.x, point.y);
        }
    }
    graph.closePath();
    graph.fill();
    graph.stroke();
    graph.restore();
};

const drawFireFood = (position, mass, playerConfig, graph) => {
    graph.strokeStyle = 'hsl(' + mass.hue + ', 100%, 45%)';
    graph.fillStyle = 'hsl(' + mass.hue + ', 100%, 55%)';
    graph.lineWidth = playerConfig.border + 2;
    drawRoundObject(position, mass.radius - 1, graph);
};

const valueInRange = (min, max, value) => Math.min(max, Math.max(min, value));

const cellTouchingBorders = (cell, borders) =>
    cell.x - cell.radius <= borders.left ||
    cell.x + cell.radius >= borders.right ||
    cell.y - cell.radius <= borders.top ||
    cell.y + cell.radius >= borders.bottom;

const regulatePoint = (point, borders) => ({
    x: valueInRange(borders.left, borders.right, point.x),
    y: valueInRange(borders.top, borders.bottom, point.y)
});

const buildCellPath = (cell, borders, graph, addWobble) => {
    const pointCount = Math.max(30, Math.min(60, 30 + ~~(cell.mass / 15)));
    const points = [];
    const wobbleIntensity = addWobble && cell.radius > 20 ? Math.min(cell.radius * 0.04, 5) : 0;

    for (let i = 0; i < pointCount; i++) {
        let theta = (i / pointCount) * FULL_ANGLE;
        let currentRadius = cell.radius;
        if (wobbleIntensity > 0) {
            // Organic jelly wave
            currentRadius += Math.sin(theta * 6 + wobbleClock * 2.5) * wobbleIntensity;
        }
        let point = circlePoint(cell, currentRadius, theta);
        points.push(borders ? regulatePoint(point, borders) : point);
    }

    graph.beginPath();
    graph.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        graph.lineTo(points[i].x, points[i].y);
    }
    graph.closePath();
};

const drawCells = (cells, playerConfig, toggleMassState, borders, graph) => {
    wobbleClock += 0.05;

    for (let cell of cells) {
        const touchesBorder = borders && cellTouchingBorders(cell, borders);
        const skinImg = getSkinImage(cell.skin);

        graph.save();

        // 1. Build the cell contour (with elastic jelly effect and border regulation)
        buildCellPath(cell, touchesBorder ? borders : null, graph, !touchesBorder);

        // 2. Fill base color
        graph.fillStyle = cell.color;
        graph.fill();

        // 3. Draw skin image if available
        if (skinImg) {
            graph.save();
            graph.clip();
            graph.drawImage(
                skinImg,
                cell.x - cell.radius,
                cell.y - cell.radius,
                cell.radius * 2,
                cell.radius * 2
            );
            graph.restore();
        }

        // 4. Draw neon arcade border
        graph.lineWidth = Math.max(3, Math.min(8, cell.radius * 0.06));
        graph.strokeStyle = cell.borderColor || '#00e5ff';
        graph.shadowColor = cell.borderColor || '#00e5ff';
        graph.shadowBlur = 10;
        graph.stroke();

        graph.restore();

        // 5. Draw player name
        let fontSize = Math.max(cell.radius / 3.2, 12);
        graph.save();
        graph.lineWidth = playerConfig.textBorderSize || 3;
        graph.fillStyle = '#FFFFFF';
        graph.strokeStyle = '#000000';
        graph.miterLimit = 1;
        graph.lineJoin = 'round';
        graph.textAlign = 'center';
        graph.textBaseline = 'middle';
        graph.font = 'bold ' + fontSize + 'px sans-serif';
        graph.strokeText(cell.name, cell.x, cell.y);
        graph.fillText(cell.name, cell.x, cell.y);

        // 6. Draw mass if enabled
        if (toggleMassState === 1) {
            graph.font = 'bold ' + Math.max(fontSize / 3 * 2, 10) + 'px sans-serif';
            let yOffset = cell.name.length > 0 ? fontSize : 0;
            graph.strokeText(Math.round(cell.mass), cell.x, cell.y + yOffset);
            graph.fillText(Math.round(cell.mass), cell.x, cell.y + yOffset);
        }
        graph.restore();
    }
};

const drawGrid = (global, player, screen, graph) => {
    graph.save();
    graph.lineWidth = 1;
    graph.strokeStyle = global.lineColor || '#00e5ff';
    graph.globalAlpha = 0.08;
    graph.beginPath();

    const gridSize = screen.height / 18;
    for (let x = -player.x % gridSize; x < screen.width; x += gridSize) {
        graph.moveTo(x, 0);
        graph.lineTo(x, screen.height);
    }

    for (let y = -player.y % gridSize; y < screen.height; y += gridSize) {
        graph.moveTo(0, y);
        graph.lineTo(screen.width, y);
    }

    graph.stroke();
    graph.restore();
};

const drawBorder = (borders, graph) => {
    graph.save();
    graph.lineWidth = 3;
    graph.strokeStyle = '#ff007f';
    graph.shadowColor = '#ff007f';
    graph.shadowBlur = 12;
    graph.beginPath();
    graph.moveTo(borders.left, borders.top);
    graph.lineTo(borders.right, borders.top);
    graph.lineTo(borders.right, borders.bottom);
    graph.lineTo(borders.left, borders.bottom);
    graph.closePath();
    graph.stroke();
    graph.restore();
};

const drawErrorMessage = (message, graph, screen) => {
    graph.fillStyle = 'rgba(10, 10, 20, 0.9)';
    graph.fillRect(0, 0, screen.width, screen.height);
    graph.textAlign = 'center';
    graph.fillStyle = '#00f0ff';
    graph.shadowColor = '#00f0ff';
    graph.shadowBlur = 15;
    graph.font = 'bold 36px sans-serif';
    graph.fillText(message, screen.width / 2, screen.height / 2);
};

module.exports = {
    drawFood,
    drawVirus,
    drawFireFood,
    drawCells,
    drawErrorMessage,
    drawGrid,
    drawBorder,
    getSkinImage
};
