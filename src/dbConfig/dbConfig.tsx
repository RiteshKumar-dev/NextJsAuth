import mongoose from "mongoose";

const connectDb = async () => {
  const dbURI = `${process.env.MONGODB_URL}`;
  let retries = 3;

  while (retries) {
    try {
      const connectionInstance = await mongoose.connect(dbURI);
      console.log(
        `MongoDB connected successfully to host: ${connectionInstance.connection.host}`
      );
      break; // Exit loop once connected
    } catch (error) {
      retries -= 1;
      if (error instanceof Error) {
        console.error(`MongoDB connection error: ${error.message}`);
      } else {
        console.error("MongoDB connection error:", error);
      }

      if (retries === 0) {
        console.error("All MongoDB connection attempts failed. Exiting...");
        process.exit(1); // Exit if no retries left
      } else {
        console.warn(
          `Retrying MongoDB connection... (${retries} retries left)`
        );
        await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before retrying
      }
    }
  }
};

// Event listeners for connection errors and disconnects
mongoose.connection.on("error", (error) => {
  console.error(`MongoDB encountered an error: ${error.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB connection lost. Retrying...");
  connectDb(); // Attempt to reconnect if disconnected
});

export default connectDb;
