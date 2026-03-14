const mongoose = require("mongoose");

const newsTickerSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        enabled: { type: Boolean, default: true },
        order: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("NewsTicker", newsTickerSchema);
