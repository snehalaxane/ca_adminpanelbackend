const mongoose = require("mongoose");

const historyIntroSchema = new mongoose.Schema({
    title: { type: String, default: "Our History" },
    description: { type: String, default: "Tracing our journey of excellence and commitment over the decades." },
    backgroundImage: { type: String, default: "" },
    enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("HistoryIntro", historyIntroSchema);
