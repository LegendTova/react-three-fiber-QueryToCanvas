let objects = [
    {id: '1', type: "fork"}, // fork
    {id: '2', type: "plate"}, // plate
    {id: '3', type: "knife"}, // knife
    {id: '4', type: "table"} // table
]

let relationships = [
    {origin: '1', destination: '2', x: 20, y:0, z: 0 },
    {origin: '1', destination: '3', x: 40, y:0, z: 0 },
    {origin: '2', destination: '3', x: 20, y:0, z: 0 },
    {origin: '1', destination: '4', x: 20, y:-10, z: -32 },
    {origin: '2', destination: '4', x: 0, y:-10, z: -32 },
    {origin: '3', destination: '4', x: -20, y:-10, z: -32 }

]

export default {objects, relationships}