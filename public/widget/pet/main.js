import { PET_MOVEMENT_CONFIG } from './movement-config.js'
import { PetMovement } from './movement.js'

const movement = new PetMovement(PET_MOVEMENT_CONFIG)

window.addEventListener('load', () => {
    movement.start()
})