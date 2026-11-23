var io = require('socket.io-client');
var render = require('./render');
var ChatClient = require('./chat-client');
var Canvas = require('./canvas');
var global = require('./global');
var skinPresets = require('./skin-presets');

var playerNameInput = document.getElementById('playerNameInput');
var socket;
var currentSkin = 'neon-alien';

var debug = function (args) {
    if (console && console.log) {
        console.log(args);
    }
};

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    global.mobile = true;
}

// Linear Interpolation & Smooth Camera
var LERP_FACTOR = 0.22;
var camera = {
    x: 0,
    y: 0,
    init: false
};
var interpolatedCells = new Map();

function startGame(type) {
    global.playerName = (playerNameInput.value || '').replace(/(<([^>]+)>)/ig, '').substring(0, 25);
    global.playerType = type;
    global.playerSkin = currentSkin;

    global.screen.width = window.innerWidth;
    global.screen.height = window.innerHeight;

    document.getElementById('startMenuWrapper').style.display = 'none';
    document.getElementById('gameAreaWrapper').style.opacity = 1;

    camera.init = false;
    interpolatedCells.clear();

    if (!socket) {
        // Backend URL for Socket.io. By default use the same origin (Netlify static site).
        // Override by defining a global variable BACKEND_URL_ENV in your build if the server is hosted elsewhere.
        var DEFAULT_BACKEND = window.location.origin;
        var BACKEND_URL = (typeof BACKEND_URL_ENV !== "undefined" && BACKEND_URL_ENV) ? BACKEND_URL_ENV : DEFAULT_BACKEND;
        socket = io(BACKEND_URL, { query: "type=" + type });
        setupSocket(socket);
    }
    if (!global.animLoopHandle) {
        animloop();
    }
    socket.emit('respawn');
    window.chat.socket = socket;
    window.chat.registerFunctions();
    window.canvas.socket = socket;
    global.socket = socket;
}

function validNick() {
    var regex = /^\w*$/;
    debug('Regex Test', regex.exec(playerNameInput.value));
    return regex.exec(playerNameInput.value) !== null;
}

function initSkinSelector() {
    var container = document.getElementById('skinPresets');
    if (!container) return;
    container.innerHTML = '';

    skinPresets.PRESETS.forEach(function (preset) {
        var chip = document.createElement('div');
        chip.className = 'skin-chip' + (preset.id === currentSkin ? ' selected' : '');
        chip.dataset.skinId = preset.id;
        chip.innerHTML = '<span class="chip-icon">' + preset.icon + '</span><span class="chip-name">' + preset.name + '</span>';
        chip.onclick = function () {
            document.querySelectorAll('.skin-chip').forEach(function (c) { c.classList.remove('selected'); });
            chip.classList.add('selected');
            currentSkin = preset.id;
            var customInput = document.getElementById('customSkinInput');
            if (customInput) customInput.value = '';
            updateAvatarPreview();
        };
        container.appendChild(chip);
    });

    var customInput = document.getElementById('customSkinInput');
    if (customInput) {
        customInput.oninput = function () {
            var val = this.value.trim();
            if (val.length > 0) {
                document.querySelectorAll('.skin-chip').forEach(function (c) { c.classList.remove('selected'); });
                currentSkin = val;
            } else {
                currentSkin = 'neon-alien';
                var first = document.querySelector('.skin-chip[data-skin-id="neon-alien"]');
                if (first) first.classList.add('selected');
            }
            updateAvatarPreview();
        };
    }

    if (playerNameInput) {
        playerNameInput.oninput = updateAvatarPreview;
    }

    updateAvatarPreview();
}

function updateAvatarPreview() {
    var canvas = document.getElementById('avatarPreview');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var cx = w / 2;
    var cy = h / 2;
    var radius = 46;

    // Background circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#0a1020';
    ctx.fill();

    var img = render.getSkinImage(currentSkin);
    if (img) {
        ctx.save();
        ctx.clip();
        ctx.drawImage(img, cx - radius, cy - radius, radius * 2, radius * 2);
        ctx.restore();
    } else {
        // Redraw when loaded
        var skinUrl = skinPresets.resolveSkinUrl(currentSkin);
        if (skinUrl) {
            var retryImg = new Image();
            retryImg.crossOrigin = 'Anonymous';
            retryImg.onload = function () {
                updateAvatarPreview();
            };
            retryImg.src = skinUrl;
        }
    }

    // Glowing neon border
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();

    // Player name text
    var nick = (playerNameInput && playerNameInput.value.trim()) ? playerNameInput.value.trim() : 'YOU';
    ctx.save();
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeText(nick, cx, cy);
    ctx.fillText(nick, cx, cy);
    ctx.restore();
}

window.onload = function () {
    var btn = document.getElementById('startButton'),
        btnS = document.getElementById('spectateButton'),
        nickErrorText = document.querySelector('#startMenu .input-error');

    initSkinSelector();

    btnS.onclick = function () {
        startGame('spectator');
    };

    btn.onclick = function () {
        if (validNick()) {
            nickErrorText.style.opacity = 0;
            startGame('player');
        } else {
            nickErrorText.style.opacity = 1;
        }
    };

    var settingsMenu = document.getElementById('settingsButton');
    var settingsDrawer = document.getElementById('settings');

    settingsMenu.onclick = function () {
        if (settingsDrawer.style.maxHeight && settingsDrawer.style.maxHeight !== '0px') {
            settingsDrawer.style.maxHeight = '0px';
            settingsDrawer.style.opacity = '0';
        } else {
            settingsDrawer.style.maxHeight = '350px';
            settingsDrawer.style.opacity = '1';
        }
    };

    playerNameInput.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === global.KEY_ENTER) {
            if (validNick()) {
                nickErrorText.style.opacity = 0;
                startGame('player');
            } else {
                nickErrorText.style.opacity = 1;
            }
        }
    });
};

var playerConfig = {
    border: 6,
    textColor: '#FFFFFF',
    textBorder: '#000000',
    textBorderSize: 3,
    defaultSize: 30
};

var player = {
    id: -1,
    x: global.screen.width / 2,
    y: global.screen.height / 2,
    screenWidth: global.screen.width,
    screenHeight: global.screen.height,
    target: { x: global.screen.width / 2, y: global.screen.height / 2 }
};
global.player = player;

var foods = [];
var viruses = [];
var fireFood = [];
var users = [];
var leaderboard = [];
var target = { x: player.x, y: player.y };
global.target = target;

window.canvas = new Canvas();
window.chat = new ChatClient();

var visibleBorderSetting = document.getElementById('visBord');
if (visibleBorderSetting) visibleBorderSetting.onchange = function () { global.borderDraw = this.checked; };

var showMassSetting = document.getElementById('showMass');
if (showMassSetting) showMassSetting.onchange = function () { global.toggleMassState = this.checked ? 1 : 0; };

var continuitySetting = document.getElementById('continuity');
if (continuitySetting) continuitySetting.onchange = function () { global.continuity = this.checked; };

var roundFoodSetting = document.getElementById('roundFood');
if (roundFoodSetting) roundFoodSetting.onchange = function () { /* rounded food */ };

var c = window.canvas.cv;
var graph = c.getContext('2d');

var feedBtn = document.getElementById('feed');
if (feedBtn) {
    feedBtn.onclick = function () {
        if (socket) socket.emit('1');
        if (window.canvas) window.canvas.reenviar = false;
    };
}

var splitBtn = document.getElementById('split');
if (splitBtn) {
    splitBtn.onclick = function () {
        if (socket) socket.emit('2');
        if (window.canvas) window.canvas.reenviar = false;
    };
}

function handleDisconnect() {
    if (socket) socket.close();
    if (!global.kicked) {
        render.drawErrorMessage('Disconnected!', graph, global.screen);
    }
}

function setupSocket(socket) {
    socket.on('pongcheck', function () {
        var latency = Date.now() - global.startPingTime;
        debug('Latency: ' + latency + 'ms');
        window.chat.addSystemLine('Ping: ' + latency + 'ms');
    });

    socket.on('connect_error', handleDisconnect);
    socket.on('disconnect', handleDisconnect);

    socket.on('welcome', function (playerSettings, gameSizes) {
        player.id = playerSettings.id;
        player.hue = playerSettings.hue;
        if (typeof playerSettings.x === 'number') player.x = playerSettings.x;
        if (typeof playerSettings.y === 'number') player.y = playerSettings.y;
        if (playerSettings.cells) player.cells = playerSettings.cells;
        player.name = global.playerName;
        player.skin = currentSkin;
        player.screenWidth = global.screen.width || window.innerWidth;
        player.screenHeight = global.screen.height || window.innerHeight;
        player.target = window.canvas.target;
        global.player = player;
        window.chat.player = player;

        socket.emit('gotit', player);
        global.gameStart = true;
        window.chat.addSystemLine('Connected to Open Agar // Arcade Edition!');
        window.chat.addSystemLine('Type <b>-help</b> for commands.');
        if (global.mobile) {
            var chatbox = document.getElementById('chatbox');
            if (chatbox && chatbox.parentNode) {
                chatbox.parentNode.removeChild(chatbox);
            }
        }
        c.focus();
        if (gameSizes) {
            global.game.width = gameSizes.width;
            global.game.height = gameSizes.height;
        }
        resize();
    });

    socket.on('playerDied', function (data) {
        var pName = isUnnamedCell(data.playerEatenName || data.name) ? 'An unnamed cell' : (data.playerEatenName || data.name);
        window.chat.addSystemLine('{GAME} - <b>' + pName + '</b> was eaten');
    });

    socket.on('playerDisconnect', function (data) {
        window.chat.addSystemLine('{GAME} - <b>' + (isUnnamedCell(data.name) ? 'An unnamed cell' : data.name) + '</b> disconnected.');
    });

    socket.on('playerJoin', function (data) {
        window.chat.addSystemLine('{GAME} - <b>' + (isUnnamedCell(data.name) ? 'An unnamed cell' : data.name) + '</b> joined.');
    });

    socket.on('leaderboard', function (data) {
        leaderboard = data.leaderboard;
        var status = '<span class="title">LEADERBOARD</span>';
        for (var i = 0; i < leaderboard.length; i++) {
            status += '<br />';
            if (leaderboard[i].id == player.id) {
                if (leaderboard[i].name.length !== 0)
                    status += '<span class="me">' + (i + 1) + '. ' + leaderboard[i].name + "</span>";
                else
                    status += '<span class="me">' + (i + 1) + ". An unnamed cell</span>";
            } else {
                if (leaderboard[i].name.length !== 0)
                    status += (i + 1) + '. ' + leaderboard[i].name;
                else
                    status += (i + 1) + '. An unnamed cell';
            }
        }
        document.getElementById('status').innerHTML = status;
    });

    socket.on('serverMSG', function (data) {
        window.chat.addSystemLine(data);
    });

    socket.on('serverSendPlayerChat', function (data) {
        window.chat.addChatLine(data.sender, data.message, false);
    });

    // Handle movement packet from server
    socket.on('serverTellPlayerMove', function (playerData, userData, foodsList, massList, virusList) {
        if (global.playerType == 'player') {
            player.x = playerData.x;
            player.y = playerData.y;
            player.hue = playerData.hue;
            player.massTotal = playerData.massTotal;
            player.cells = playerData.cells;
            player.skin = playerData.skin || currentSkin;
        }
        users = userData;
        foods = foodsList;
        viruses = virusList;
        fireFood = massList;
    });

    // Death
    socket.on('RIP', function () {
        global.gameStart = false;
        render.drawErrorMessage('GAME OVER', graph, global.screen);
        window.setTimeout(function () {
            document.getElementById('gameAreaWrapper').style.opacity = 0;
            var startMenu = document.getElementById('startMenuWrapper');
            startMenu.style.display = 'flex';
            if (global.animLoopHandle) {
                window.cancelAnimationFrame(global.animLoopHandle);
                global.animLoopHandle = undefined;
            }
        }, 2200);
    });

    socket.on('kick', function (reason) {
        global.gameStart = false;
        global.kicked = true;
        render.drawErrorMessage(reason || 'You were kicked!', graph, global.screen);
        socket.close();
    });
}

var isUnnamedCell = function (name) {
    return !name || name.length < 1;
};

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function animloop() {
    global.animLoopHandle = window.requestAnimFrame(animloop);
    gameLoop();
}

function gameLoop() {
    if (global.gameStart) {
        // Smooth camera lerp towards player target position
        if (typeof player.x === 'number' && !isNaN(player.x)) {
            if (!camera.init) {
                camera.x = player.x;
                camera.y = player.y;
                camera.init = true;
            } else {
                camera.x += (player.x - camera.x) * LERP_FACTOR;
                camera.y += (player.y - camera.y) * LERP_FACTOR;
            }
        } else {
            camera.x = global.screen.width / 2;
            camera.y = global.screen.height / 2;
        }

        graph.fillStyle = global.backgroundColor || '#080b14';
        graph.fillRect(0, 0, global.screen.width, global.screen.height);

        render.drawGrid(global, camera, global.screen, graph);

        // Draw foods relative to smooth camera
        foods.forEach(function (food) {
            var position = {
                x: food.x - camera.x + global.screen.width / 2,
                y: food.y - camera.y + global.screen.height / 2
            };
            render.drawFood(position, food, graph);
        });

        fireFood.forEach(function (ff) {
            var position = {
                x: ff.x - camera.x + global.screen.width / 2,
                y: ff.y - camera.y + global.screen.height / 2
            };
            render.drawFireFood(position, ff, playerConfig, graph);
        });

        viruses.forEach(function (virus) {
            var position = {
                x: virus.x - camera.x + global.screen.width / 2,
                y: virus.y - camera.y + global.screen.height / 2
            };
            render.drawVirus(position, virus, graph);
        });

        var borders = {
            left: global.screen.width / 2 - camera.x,
            right: global.screen.width / 2 + global.game.width - camera.x,
            top: global.screen.height / 2 - camera.y,
            bottom: global.screen.height / 2 + global.game.height - camera.y
        };

        if (global.borderDraw) {
            render.drawBorder(borders, graph);
        }

        // LERP user cells for fluid 60/120+ FPS animations
        var activeCellKeys = new Set();
        var cellsToDraw = [];

        for (var i = 0; i < users.length; i++) {
            var u = users[i];
            var color = 'hsl(' + u.hue + ', 100%, 50%)';
            var borderColor = 'hsl(' + u.hue + ', 100%, 45%)';
            var userSkin = u.skin || null;

            if (u.id === player.id && !userSkin) {
                userSkin = currentSkin;
            }

            for (var j = 0; j < u.cells.length; j++) {
                var cell = u.cells[j];
                var key = u.id + '_' + j;
                activeCellKeys.add(key);

                var cached = interpolatedCells.get(key);
                if (!cached) {
                    cached = {
                        x: cell.x,
                        y: cell.y,
                        radius: cell.radius,
                        mass: cell.mass
                    };
                    interpolatedCells.set(key, cached);
                } else {
                    cached.x += (cell.x - cached.x) * LERP_FACTOR;
                    cached.y += (cell.y - cached.y) * LERP_FACTOR;
                    cached.radius += (cell.radius - cached.radius) * LERP_FACTOR;
                    cached.mass += (cell.mass - cached.mass) * LERP_FACTOR;
                }

                cellsToDraw.push({
                    color: color,
                    borderColor: borderColor,
                    mass: cached.mass,
                    name: u.name,
                    radius: cached.radius,
                    skin: userSkin,
                    x: cached.x - camera.x + global.screen.width / 2,
                    y: cached.y - camera.y + global.screen.height / 2
                });
            }
        }

        // Ensure current player's cells are drawn even before other users are synced
        var playerInUsers = users.some(function (u) { return u.id === player.id; });
        if (!playerInUsers && global.playerType === 'player' && player.cells && player.cells.length > 0) {
            var myColor = 'hsl(' + player.hue + ', 100%, 50%)';
            var myBorder = 'hsl(' + player.hue + ', 100%, 45%)';
            for (var k = 0; k < player.cells.length; k++) {
                var cCell = player.cells[k];
                var cKey = 'mycell_' + k;
                activeCellKeys.add(cKey);

                var cCached = interpolatedCells.get(cKey);
                if (!cCached) {
                    cCached = {
                        x: cCell.x,
                        y: cCell.y,
                        radius: cCell.radius,
                        mass: cCell.mass
                    };
                    interpolatedCells.set(cKey, cCached);
                } else {
                    cCached.x += (cCell.x - cCached.x) * LERP_FACTOR;
                    cCached.y += (cCell.y - cCached.y) * LERP_FACTOR;
                    cCached.radius += (cCell.radius - cCached.radius) * LERP_FACTOR;
                    cCached.mass += (cCell.mass - cCached.mass) * LERP_FACTOR;
                }

                cellsToDraw.push({
                    color: myColor,
                    borderColor: myBorder,
                    mass: cCached.mass,
                    name: global.playerName,
                    radius: cCached.radius,
                    skin: currentSkin,
                    x: cCached.x - camera.x + global.screen.width / 2,
                    y: cCached.y - camera.y + global.screen.height / 2
                });
            }
        }

        // Clean up unreferenced cells from cache
        for (var cellKey of interpolatedCells.keys()) {
            if (!activeCellKeys.has(cellKey)) {
                interpolatedCells.delete(cellKey);
            }
        }

        cellsToDraw.sort(function (a, b) {
            return a.mass - b.mass;
        });

        render.drawCells(cellsToDraw, playerConfig, global.toggleMassState, borders, graph);

        socket.emit('0', window.canvas.target);
    }
}

window.addEventListener('resize', resize);

function resize() {
    if (!socket) return;

    player.screenWidth = c.width = global.screen.width = global.playerType == 'player' ? window.innerWidth : global.game.width;
    player.screenHeight = c.height = global.screen.height = global.playerType == 'player' ? window.innerHeight : global.game.height;

    if (global.playerType == 'spectator') {
        player.x = global.game.width / 2;
        player.y = global.game.height / 2;
    }

    socket.emit('windowResized', { screenWidth: global.screen.width, screenHeight: global.screen.height });
}
