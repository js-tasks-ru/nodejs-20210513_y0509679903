const {ObjectID} = require('mongodb');
const {isValidObjectId} = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (subcategory) {
    const products = await Product.aggregate([
      // eslint-disable-next-line new-cap
      {$match: {subcategory: ObjectID(subcategory)}},
      {$project: {
      // eslint-disable-next-line max-len
        _id: 0, id: '$_id', title: 1, description: 1, category: 1, price: 1, subcategory: 1, images: 1,
      }},
    ]);

    ctx.body = {products};
  }

  await next();
};

module.exports.productList = async function productList(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) {
    const products = await Product.find({});

    ctx.body = {products};
  }
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;
  const isValid = isValidObjectId(id);

  if (!isValid) {
    ctx.throw(400);
    return;
  }

  // eslint-disable-next-line new-cap
  const product = await Product.findOne({_id: id});

  if (!product) {
    ctx.throw(404);
    return;
  }

  ctx.body = {product};
};
