export const typeDefs = `#graphql

    type Object {
        id: ID!,
        type: String!,
        relationships: [Relationship!]
    }

    type Relationship{
        origin: ID!
        destination: ID!
        x: Float!
        y: Float!
        z: Float!
    }

    type Query {
        relationships: [Relationship]
        objects: [Object]
        object(id: ID!): Object
    }

    type Mutation {
        deleteObject(id: ID!): [Object]
        changeType(id: ID!, type: String!): Object
        moveObject(origin: ID!, destination: ID!, vector: ObjectTranforms!): Relationship
    }

    input ObjectTranforms{
        x: Float!,
        y: Float!,
        z: Float!
    }

`
