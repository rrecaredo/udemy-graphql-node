import { filterProducts } from "./filters.js";

export const Query = {
    products: (parent, { filter }, { db }) => {
        return filterProducts(filter, db.products, db.reviews);
    },
    product: (parent, { id }, { db }) => {
        return db.products.find(product => product.id === id)
    },
    categories: (parent, args, { db }) => db.categories,
    category: (parent, { id }, { db }) => {
        return db.categories.find(category => category.id === id)
    }
};