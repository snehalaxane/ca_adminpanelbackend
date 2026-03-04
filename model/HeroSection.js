// const mongoose = require("mongoose");

// const HeroSchema = new mongoose.Schema(
//   {
//     highlightNumber: String,
//     highlightText: String,
//     title: String,
//     subtitle: String,
//     description: String,
//     ctaText: String,
//     ctaLink: String,
//     enabled: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Hero",HeroSchema);

const mongoose = require("mongoose");

const HeroSchema = new mongoose.Schema(
  {
    // highlightNumber: String,
    // highlightText: String,
    // title: String,
    subtitle: String,
    description: String,

    ctas: [
      {
        text: String,
        link: String,
      },
    ],

    stat1: String,
    stat2: String,
    stat3: String,

    presenceTitle: String,
    presenceSubtitle: String,

    imageUrl: String,
    mapImageUrl: String,

    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero", HeroSchema);