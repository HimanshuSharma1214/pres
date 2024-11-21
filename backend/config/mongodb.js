import mongoose from "mongoose"

const connectDB=async()=>{
  // mongoose.connection.on('connected',()=>console.log("db connected"))
  // await mongoose.connect(`${process.env.MONGO_URI}/prescripto`)
  try {
    mongoose.connection.on('connected', () => console.log("DB connected"));
    await mongoose.connect(`${process.env.MONGO_URI}/prescripto`, {
        
    });
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1); // Exit if DB connection fails
  }
}

export default connectDB