/**
 * Pet movement configuration.
 * Edit values here to change how the dog roams without touching movement logic.
 * Pass partial overrides to createMovementConfig() from main.js if needed.
 */

const OFFSCREEN_SPACE = 400 // amount it's allowed to go offscreen

export const PET_MOVEMENT_CONFIG = {
    /** DOM id of the wrapper element (without #) */
    wrapperId: 'pupper',

    /** Overlay canvas size in pixels */
    canvas: {
        width: 1920,
        height: 1080
    },

    /** Where the dog is allowed to walk (pixel coordinates) */
    bounds: {
        minX: -OFFSCREEN_SPACE,
        maxX: 1920 + OFFSCREEN_SPACE,
        minY: -OFFSCREEN_SPACE,
        maxY: 1080 + OFFSCREEN_SPACE
    },

    /** Starting position when the widget loads */
    initial: {
        x: 860,
        y: 100
    },

    /** CSS properties used to position the wrapper */
    position: {
        axisX: 'left',
        axisY: 'bottom',
        unit: 'px'
    },

    walk: {
        /** Pixels moved per millisecond (higher = faster) */
        speedPxPerMs: 0.14,
        /** Extra delay after walk finishes before next action */
        arrivalBufferMs: 100,
        /** CSS transition timing function */
        easing: 'linear',
        /** If true, duration scales with distance; if false, uses fixedDurationMs */
        scaleDurationByDistance: true,
        /** Used when scaleDurationByDistance is false */
        fixedDurationMs: 800,
        /** Min/max cap when scaling by distance */
        minDurationMs: 400,
        maxDurationMs: 36000
    },

    /**
     * Weighted random actions. Higher weight = picked more often.
     * Set weight to 0 to disable an action.
     */
    actions: {
        walk: { weight: 2, enabled: true },
        sniff: { weight: 1, enabled: true },
        sit: { weight: 1, enabled: false }
    },

    sniff: {
        minDurationMs: 1500,
        maxDurationMs: 3500
    },

    sit: {
        minDurationMs: 2000,
        maxDurationMs: 4000
    },

    /** Delay before the first roam cycle starts */
    startup: {
        delayMs: 800
    },

    /** CSS class names applied to the wrapper for states */
    classes: {
        walking: 'walking',
        sniffing: 'sniffing',
        sitting: 'sitting',
        faceLeft: 'face-left',
        faceRight: 'face-right'
    },

    /**
     * Optional hooks. Replace with your own functions to extend behavior.
     * Return false from beforeAction to skip the default handler for that action.
     */
    hooks: {
        beforeAction: () => {
            console.log('before action')
        },
        onWalkStart: () => {
            console.log('walk start')
        },
        onWalkComplete: () => {
            console.log('walk complete')
        },
        onSniffStart: () => {
            console.log('sniff start')
        },
        onSitStart: () => {
            console.log('sitting')
        }
    }
}

/**
 * Deep-merge overrides into the default movement config.
 * @param {Partial<typeof PET_MOVEMENT_CONFIG>} overrides
 * @returns {typeof PET_MOVEMENT_CONFIG}
 */
export function createMovementConfig(overrides = {}) {
    return deepMerge(structuredClone(PET_MOVEMENT_CONFIG), overrides)
}

function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        const value = source[key]
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            target[key] = deepMerge(target[key] ?? {}, value)
        } else {
            target[key] = value
        }
    }
    return target
}
