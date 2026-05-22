/**
 * @typedef {typeof import('./movement-config.js').PET_MOVEMENT_CONFIG} PetMovementConfig
 */

export class PetMovement {
    /** @param {PetMovementConfig} config */
    constructor(config) {
        this.config = config
        this.dog = document.getElementById(config.wrapperId)

        if (!this.dog) {
            throw new Error(`Pet wrapper not found: #${config.wrapperId}`)
        }

        this.currentX = config.initial.x
        this.currentY = config.initial.y
        this.running = false

        this.applyPosition(this.currentX, this.currentY)
    }

    start() {
        if (this.running) return
        this.running = true

        window.setTimeout(() => this.roamFree(), this.config.startup.delayMs)
    }

    stop() {
        this.running = false
    }

    roamFree() {
        if (!this.running) return

        const action = this.pickAction()
        if (!action) {
            window.setTimeout(() => this.roamFree(), 1000)
            return
        }

        const hooks = this.config.hooks
        if (typeof hooks.beforeAction === 'function') {
            const proceed = hooks.beforeAction(action, this)
            if (proceed === false) return
        }

        if (action === 'walk') {
            this.walk()
        } else if (action === 'sniff') {
            this.sniff()
        } else {
            this.sit()
        }
    }

    pickAction() {
        const entries = Object.entries(this.config.actions)
            .filter(([, action]) => action.enabled && action.weight > 0)

        const totalWeight = entries.reduce((sum, [, action]) => sum + action.weight, 0)
        if (totalWeight === 0) return null

        let roll = Math.random() * totalWeight

        for (const [name, action] of entries) {
            roll -= action.weight
            if (roll <= 0) return name
        }

        return entries[entries.length - 1][0]
    }

    walk() {
        const { bounds, walk, classes, position } = this.config
        const targetX = this.randomInRange(bounds.minX, bounds.maxX)
        const targetY = this.randomInRange(bounds.minY, bounds.maxY)

        this.setFacing(targetX)

        const distance = Math.hypot(targetX - this.currentX, targetY - this.currentY)
        const duration = this.getWalkDuration(distance)

        this.dog.style.transition = `${position.axisX} ${duration}ms ${walk.easing}, ${position.axisY} ${duration}ms ${walk.easing}`
        this.setState(classes.walking)

        if (typeof this.config.hooks.onWalkStart === 'function') {
            this.config.hooks.onWalkStart({ targetX, targetY, duration }, this)
        }

        this.applyPosition(targetX, targetY)
        this.currentX = targetX
        this.currentY = targetY

        window.setTimeout(() => {
            if (typeof this.config.hooks.onWalkComplete === 'function') {
                this.config.hooks.onWalkComplete({ x: targetX, y: targetY }, this)
            }
            this.roamFree()
        }, duration + walk.arrivalBufferMs)
    }

    sniff() {
        const { sniff, classes } = this.config
        this.clearMovementState()
        this.setState(classes.sniffing)

        if (typeof this.config.hooks.onSniffStart === 'function') {
            this.config.hooks.onSniffStart(this)
        }

        const duration = this.randomInRange(sniff.minDurationMs, sniff.maxDurationMs)
        window.setTimeout(() => this.roamFree(), duration)
    }

    sit() {
        const { sit, classes } = this.config
        this.clearMovementState()
        this.dog.classList.add(classes.sitting)

        if (typeof this.config.hooks.onSitStart === 'function') {
            this.config.hooks.onSitStart(this)
        }

        const duration = this.randomInRange(sit.minDurationMs, sit.maxDurationMs)
        window.setTimeout(() => {
            this.dog.classList.remove(classes.sitting)
            this.roamFree()
        }, duration)
    }

    getWalkDuration(distance) {
        const { walk } = this.config

        let duration = walk.scaleDurationByDistance
            ? distance / walk.speedPxPerMs
            : walk.fixedDurationMs

        duration = Math.max(walk.minDurationMs, Math.min(walk.maxDurationMs, duration))
        return Math.round(duration)
    }

    setFacing(targetX) {
        const { classes } = this.config

        if (targetX > this.currentX) {
            this.dog.classList.remove(classes.faceLeft)
            this.dog.classList.add(classes.faceRight)
        } else {
            this.dog.classList.remove(classes.faceRight)
            this.dog.classList.add(classes.faceLeft)
        }
    }

    setState(activeClass) {
        const { classes } = this.config
        this.dog.classList.remove(classes.walking, classes.sniffing, classes.sitting)
        this.dog.classList.add(activeClass)
    }

    clearMovementState() {
        const { classes } = this.config
        this.dog.classList.remove(classes.walking, classes.sniffing, classes.sitting)
    }

    applyPosition(x, y) {
        const { position } = this.config
        this.dog.style[position.axisX] = `${x}${position.unit}`
        this.dog.style[position.axisY] = `${y}${position.unit}`
    }

    randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}
