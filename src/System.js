class System {
    constructor(skinnedMesh) {
        if (!skinnedMesh || !skinnedMesh.isSkinnedMesh)
            throw new Error("Invalid Argument: Not a skinned mesh");
    }
}

export default System