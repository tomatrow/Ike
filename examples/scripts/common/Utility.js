/*
 * calculateSkinIndices(vertexIndex, bones, vertices) : bone indexes that affect the vertex. Up to four.
 * calculateSkinWeight(boneIndex, vertexIndex, bones, vertices): the weight the vertex has to the bone
 */
function rig(geometry, bones, calculateSkinIndices, calculateSkinWeight) {
    const vertices = geometry.vertices
    const skinIndices = vertices.map((v, i) => {
        return calculateSkinIndices(i, bones, vertices)
    })
    const skinWeights = skinIndices.map((indexes, vertexIndex) => {
        return indexes.map(boneIndex => calculateSkinWeight(boneIndex, vertexIndex, bones, vertices))
    })

    const vectorizedSkinMap = skinMap => skinMap.map(arr => new THREE.Vector4(...arr))

    // add to geometry
    geometry.skinWeights.push(...vectorizedSkinMap(skinWeights))
    geometry.skinIndices.push(...vectorizedSkinMap(skinIndices))
}