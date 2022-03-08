import { filterProducts } from "./filters.js";

export const Category = {
    products: ({ id }, { filter }, { db }) => {
        const productsByCategory = db.products.filter(product => product.categoryId === id);

        return filterProducts(filter, productsByCategory, db.reviews);
    }
};