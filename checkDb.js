require("dotenv").config();
const mongoose = require("mongoose");
const TeamIntro = require("./model/TeamIntro");

async function checkDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        const intros = await TeamIntro.find().lean();
        console.log(`Found ${intros.length} document(s) in TeamIntro collection`);
        intros.forEach((intro, i) => {
          console.log(`--- Document ${i + 1} ---`);
          delete intro.backgroundImage;
          console.log(JSON.stringify(intro, null, 2));
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkDb();
