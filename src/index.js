import System from './System.js'

// Attach to THREE
if (typeof window !== 'undefined' && typeof window.THREE === 'object') {
    window.THREE.Ike = {
        System
    }
}

export default {
    System
}