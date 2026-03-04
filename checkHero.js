require("dotenv").config();
const mongoose = require("mongoose");
const HeroSection = require("./model/HeroSection.js");

async function checkHero() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const hero = await HeroSection.findOne();
        console.log("=== HERO DATA ===");
        console.log(JSON.stringify(hero, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkHero();
