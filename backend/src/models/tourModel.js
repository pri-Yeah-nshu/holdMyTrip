const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A tour must have a title"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "A tour must have a description"],
    },
    slug: {
      type: String,
      // unique: true,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A tour must have a creator"],
    },
  },
  {
    timestamps: true,
  }
);

// describe the pre-save middleware to generate slug from title
tourSchema.pre("save", async function () {
  this.slug = slugify(this.title, { lower: true });
  //   next();
});

tourSchema.index({ slug: 1 }, { unique: true });
tourSchema.index({ price: 1 });
tourSchema.index({ duration: 1 });
tourSchema.index({
  name: "text",
  description: "text",
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
