const mongoose = require('mongoose');
const Tour = require('./tourModel');
// review // rating // createdAt //  ref to tour // ref to user
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty '],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAT: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to user'],
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
  console.log('Hello ');
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};
reviewSchema.post('save', function (next) {
  this.constructor.calcAverageRatings(this.tour);
  // next();
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
