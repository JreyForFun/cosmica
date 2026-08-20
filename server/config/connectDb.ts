import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string)
        console.log(`Database Connected: ${conn.connection.host} | ${conn.connection.name}`)
    } catch(e){
        console.error(e);
        process.exit(1);
    }
}

export default connectDB;