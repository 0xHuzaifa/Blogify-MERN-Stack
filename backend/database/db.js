import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
        
    } catch (error) {
        console.error(`Failed to connect Database, Please try again`, error);
        process.exit(1);
    }
}

export default connectToDB