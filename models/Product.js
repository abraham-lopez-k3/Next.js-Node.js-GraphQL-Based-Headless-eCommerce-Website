const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* brand: {
  type: Schema.Types.ObjectId,
  ref: "Brand",
}, */ 
const specificationSchema = new Schema({
  key: {
    type: String,
  },
  attributeId: {
    type: Schema.Types.ObjectId,
    ref: "ProductAttribute"
  },
  value: {
    type: String,
  },
  attributeValueId: {
    type: Schema.Types.ObjectId,
    ref: "ProductAttribute"
  },
  group: {
    type: String,
  },
}, {_id: false})

// Create Schema
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  categoryId: [],
  categoryTree: [],
  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    default: null,
  },
  sku: {
    type: String,
  },
  short_description: {
    type: String,
  },
  description: {
    type: String,
  },
  shippingDetails: {},
  manufactureDetails: {},
  quantity: {
    type: Number,
  },
  pricing: {
    price: {
      type: Number,
      default: 0,
    },
    sellprice: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
  },
  url: {
    type: String,
  },
  meta: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    keywords: {
      type: String,
    },
  },
  // feature_image: {},
  // gallery_image: [
  //   {
  //     original: {
  //       type: String,
  //     },
  //     large: {
  //       type: String,
  //     },
  //     medium: {
  //       type: String,
  //     },
  //     thumbnail: {
  //       type: String,
  //     },
  //   },
  // ],
  feature_image: String,
  gallery_image: [String],
  
  status: {
    type: String,
  },
  shipping: {
    height: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
    depth: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 0,
    },
    shippingClass: {
      type: Schema.ObjectId,
    },
  },
  taxClass: {
    type: Schema.ObjectId,
  },
  featured_product: {
    type: Boolean,
  },
  product_type: {
    virtual: {
      type: Boolean,
    },
    downloadable: {
      type: Boolean,
    },
  },
  custom_field: [
    {
      key: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  specifications: [specificationSchema],
  date: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    default: 0
  },
  updated: {
    type: Date,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
