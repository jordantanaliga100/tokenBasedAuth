import { MongoClient } from 'mongodb'

const mongoUri =
    process.env.MONGODB_CONN_STRING ||
    `mongodb://${process.env.MONGO_DB_USER || 'root'}:${
        process.env.MONGO_DB_PASS || 'secret'
    }@${process.env.MONGO_DB_HOST || 'localhost'}:${
        process.env.MONGO_DB_PORT || '27017'
    }/${process.env.MONGO_DB_NAME || 'mydb'}?authSource=admin`

let mongoClient: MongoClient | null = null

export const connectMongo = async () => {
    try {
        // Initialize new connection
        mongoClient = new MongoClient(mongoUri)
        await mongoClient.connect()

        console.log('✅ Connected to MongoDB!')
        return mongoClient.db(process.env.MONGO_DB_NAME || 'mydb')
    } catch (error) {
        if (error instanceof Error) {
            console.error('❌ PostgreSQL Connection Error:', error?.message)
        } else {
            console.error('❌ PostgreSQL Connection Error:', error)
            throw error
        }
    }
}
