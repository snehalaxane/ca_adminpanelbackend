require("dotenv").config();
const mongoose = require("mongoose");
const TeamIntro = require("./model/TeamIntro");

async function testUpdate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        
        const testText = "TEST_UPDATE_" + new Date().getTime();
        console.log("Attempting to update accentText to:", testText);
        
        const result = await TeamIntro.findOneAndUpdate(
            {},
            { $set: { accentText: testText } },
            { upsert: true, new: true }
        );
        
        console.log("Update result from Mongoose:");
        console.log(JSON.stringify(result, null, 2));
        
        // Raw check
        const raw = await mongoose.connection.db.collection('teamintros').findOne({});
        console.log("Raw DB content check:");
        console.log(JSON.stringify(raw, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error("Test failed:", err);
    }
}

testUpdate();
