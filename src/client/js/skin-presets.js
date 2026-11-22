"use strict";

// High-resolution SVG data-URIs for built-in Retro / Neon Arcade skins.
// Zero external network requests needed — works 100% offline and instantly.

const createSvgDataUri = (svgContent) => {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgContent.trim());
};

const PRESETS = [
    {
        id: 'neon-alien',
        name: 'Neon Alien',
        icon: '👾',
        glowColor: '#39ff14',
        url: createSvgDataUri(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
                <rect width="200" height="200" fill="#050a08"/>
                <circle cx="100" cy="100" r="90" fill="#0d1f14" stroke="#39ff14" stroke-width="4"/>
                <path d="M60 70 Q100 20 140 70 Q160 120 100 160 Q40 120 60 70 Z" fill="#39ff14" opacity="0.85"/>
                <ellipse cx="80" cy="95" rx="16" ry="24" fill="#050a08" transform="rotate(-15 80 95)"/>
                <ellipse cx="120" cy="95" rx="16" ry="24" fill="#050a08" transform="rotate(15 120 95)"/>
                <circle cx="82" cy="90" r="5" fill="#39ff14"/>
                <circle cx="118" cy="90" r="5" fill="#39ff14"/>
                <circle cx="100" cy="135" r="3" fill="#050a08"/>
            </svg>
        `)
    },
    {
        id: 'cyber-skull',
        name: 'Cyber Skull',
        icon: '💀',
        glowColor: '#00f0ff',
        url: createSvgDataUri(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
                <rect width="200" height="200" fill="#060913"/>
                <circle cx="100" cy="100" r="90" fill="#0a1329" stroke="#00f0ff" stroke-width="4"/>
                <!-- Skull Top -->
                <path d="M60 90 C50 30 150 30 140 90 C140 120 130 135 125 145 L75 145 C70 135 60 120 60 90 Z" fill="#00f0ff" opacity="0.85"/>
                <!-- Eyes -->
                <polygon points="75,85 92,80 87,98" fill="#060913"/>
                <polygon points="125,85 108,80 113,98" fill="#060913"/>
                <!-- Nose -->
                <polygon points="100,105 94,115 106,115" fill="#060913"/>
                <!-- Teeth -->
                <rect x="82" y="130" width="6" height="12" fill="#060913"/>
                <rect x="92" y="130" width="6" height="12" fill="#060913"/>
                <rect x="102" y="130" width="6" height="12" fill="#060913"/>
                <rect x="112" y="130" width="6" height="12" fill="#060913"/>
            </svg>
        `)
    },
    {
        id: 'matrix',
        name: 'Matrix Code',
        icon: '💻',
        glowColor: '#00ff66',
        url: createSvgDataUri(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
                <rect width="200" height="200" fill="#020d04"/>
                <circle cx="100" cy="100" r="90" fill="#031407" stroke="#00ff66" stroke-width="4"/>
                <text x="35" y="55" fill="#00ff66" font-family="monospace" font-size="18" font-weight="bold">1 0 1 0 1</text>
                <text x="25" y="85" fill="#55ff99" font-family="monospace" font-size="20" font-weight="bold">A G A R</text>
                <text x="35" y="115" fill="#00ff66" font-family="monospace" font-size="18" font-weight="bold">0 1 1 0 1</text>
                <text x="30" y="145" fill="#00cc55" font-family="monospace" font-size="18" font-weight="bold">C Y B E R</text>
                <text x="45" y="170" fill="#008833" font-family="monospace" font-size="16" font-weight="bold">1 0 0 1</text>
            </svg>
        `)
    },
    {
        id: 'galaxy',
        name: 'Cosmic Galaxy',
        icon: '🌌',
        glowColor: '#d946ef',
        url: createSvgDataUri(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
                <defs>
                    <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#f43f5e"/>
                        <stop offset="45%" stop-color="#a855f7"/>
                        <stop offset="75%" stop-color="#3b82f6"/>
                        <stop offset="100%" stop-color="#050518"/>
                    </radialGradient>
                </defs>
                <rect width="200" height="200" fill="#050518"/>
                <circle cx="100" cy="100" r="90" fill="url(#nebula)" stroke="#d946ef" stroke-width="4"/>
                <circle cx="70" cy="60" r="3" fill="#ffffff"/>
                <circle cx="140" cy="75" r="2" fill="#ffffff"/>
                <circle cx="60" cy="130" r="2.5" fill="#ffffff"/>
                <circle cx="130" cy="140" r="3" fill="#ffffff"/>
                <circle cx="100" cy="100" r="4" fill="#ffffff"/>
                <circle cx="100" cy="100" r="14" fill="#ffffff" opacity="0.4"/>
            </svg>
        `)
    },
    {
        id: 'vaporwave',
        name: 'Synthwave Sun',
        icon: '🌅',
        glowColor: '#ff007f',
        url: createSvgDataUri(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
                <defs>
                    <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#ffdd00"/>
                        <stop offset="100%" stop-color="#ff007f"/>
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="#11052c"/>
                <circle cx="100" cy="100" r="90" fill="#1a0836" stroke="#ff007f" stroke-width="4"/>
                <!-- Sunset disc -->
                <circle cx="100" cy="100" r="65" fill="url(#sun)"/>
                <!-- Horizontal neon stripes -->
                <rect x="35" y="90" width="130" height="4" fill="#1a0836"/>
                <rect x="35" y="100" width="130" height="6" fill="#1a0836"/>
                <rect x="35" y="112" width="130" height="8" fill="#1a0836"/>
                <rect x="35" y="126" width="130" height="11" fill="#1a0836"/>
                <rect x="35" y="142" width="130" height="14" fill="#1a0836"/>
            </svg>
        `)
    },
    {
        id: 'doge',
        name: 'Neon Doge',
        icon: '🐕',
        glowColor: '#fbbf24',
        url: createSvgDataUri(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
                <rect width="200" height="200" fill="#1c1304"/>
                <circle cx="100" cy="100" r="90" fill="#2d1f05" stroke="#fbbf24" stroke-width="4"/>
                <!-- Ears -->
                <polygon points="50,70 65,30 90,65" fill="#f59e0b"/>
                <polygon points="150,70 135,30 110,65" fill="#f59e0b"/>
                <!-- Face -->
                <ellipse cx="100" cy="115" rx="55" ry="45" fill="#fbbf24"/>
                <!-- Snout -->
                <ellipse cx="100" cy="125" rx="25" ry="20" fill="#fef3c7"/>
                <ellipse cx="100" cy="115" rx="8" ry="6" fill="#1c1304"/>
                <!-- Eyes -->
                <ellipse cx="78" cy="100" rx="9" ry="12" fill="#1c1304"/>
                <circle cx="80" cy="98" r="3" fill="#ffffff"/>
                <ellipse cx="122" cy="100" rx="9" ry="12" fill="#1c1304"/>
                <circle cx="124" cy="98" r="3" fill="#ffffff"/>
                <!-- Eyebrows -->
                <path d="M70 85 Q80 80 90 86" stroke="#b45309" stroke-width="3" fill="none"/>
                <path d="M130 85 Q120 80 110 86" stroke="#b45309" stroke-width="3" fill="none"/>
            </svg>
        `)
    },
    {
        id: 'pixel-heart',
        name: 'Retro Heart',
        icon: '💖',
        glowColor: '#ec4899',
        url: createSvgDataUri(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
                <rect width="200" height="200" fill="#1a0512"/>
                <circle cx="100" cy="100" r="90" fill="#260b1c" stroke="#ec4899" stroke-width="4"/>
                <!-- Pixel Heart Shapes -->
                <path d="M70 60 H90 V75 H70 Z M110 60 H130 V75 H110 Z M55 75 H145 V105 H55 Z M70 105 H130 V120 H70 Z M85 120 H115 V135 H85 Z M95 135 H105 V145 H95 Z" fill="#ec4899"/>
                <rect x="65" y="80" width="15" height="15" fill="#ffffff" opacity="0.6"/>
            </svg>
        `)
    }
];

module.exports = {
    PRESETS,
    getPresetById: function (id) {
        return PRESETS.find(p => p.id === id);
    },
    resolveSkinUrl: function (skinIdOrUrl) {
        if (!skinIdOrUrl) return null;
        const preset = PRESETS.find(p => p.id === skinIdOrUrl);
        return preset ? preset.url : skinIdOrUrl;
    }
};

