const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TaxSchema = new Schema({
  is_inclusive: {
    type: Boolean,
  },
  global: {
    is_global: {
      type: Boolean,
    },
    overwrite: {
      type: Boolean,
    },
    taxClass: {
      type: Schema.ObjectId,
    },



  },
  taxClass: [
    {
      name: {
        type: String,
      },
      percentage: {
        type: Number,
        // min: 0,
      },
      system: {
        type: Number,
        // default: 0,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
  },
});

var Tax = (module.exports = mongoose.model("Tax", TaxSchema));

module.exports.createTax = async () => {
  const tax = await Tax.findOne({});
  if (tax) {
    return;
  }

  var newTax = new Tax({
    is_inclusive: true,
    global: {
      is_global: true,
    },
    taxClass: [
      {
        name: "Tax Free",
        percentage: 0,
        system: 1,
      },
    ],
  });

  newTax.save(async (err, defaultTax) => {
    if (err) throw err;
    defaultTax.global.taxClass = defaultTax.taxClass[0]._id;
    let result = await defaultTax.save();
    console.log(result);
  });
};
