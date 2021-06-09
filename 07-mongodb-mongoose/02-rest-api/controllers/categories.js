const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({})
      .select({_id: 0, id: '$_id', title: 1, subcategories: 1})
      .populate('subcategories');

  ctx.body = {categories};
};
