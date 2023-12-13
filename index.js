import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import { typeDefs } from './schema.js'
import db from './db.js'


const resolvers = {
    Query: {
        objects(){
            return db.objects
        },
        object(_, args){
            return db.objects.find((object) => object.id === args.id)
        },
        relationships(){
            return db.relationships
        }
    },

    Object: {
        relationships(parent){
            return db.relationships.filter((r) => r.origin === parent.id || r.destination === parent.id)
        }    
    },

    Mutation:{
        deleteObject(_, args){
            db.objects = db.objects.filter((o) => o.id !== args.id)
            //db.relationships = db.relationships.filter((r) => r.origin !== args.id || r.destination !== args.id)
            return db.objects
        },
        changeType(_, args){
            db.objects = db.objects.map((o) => {
                if (o.id === args.id){
                    return {...o, ...args}
                }

                return o

            })

            return db.objects.find((o) => o.id === args.id)
        },
        moveObject(_, args){
                db.relationships = db.relationships.map((r) => {
                    if (r.origin === args.origin && r.destination === args.destination){
                        r.x = r.x + args.vector.x
                        r.y = r.y + args.vector.y
                        r.z = r.z + args.vector.z
                    }
    
                    return r
    
                })
    
                return db.relationships.find((r) => r.origin === args.origin && r.destination === args.destination)
         }

    }
}

// Server setup

const server = new ApolloServer({
    typeDefs,
    resolvers

})

const { url } = startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log('Server read at port', 4000)