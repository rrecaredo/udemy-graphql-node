import { v4 as uuidv4 } from 'uuid'

export const Mutation = {
    addCategory: (parent, { input: { name } }, { db }) => {
        const newCategory = {
            id: uuidv4(),
            name
        };

        db.categories.push(newCategory);

        return newCategory;
    },
    addProduct: (parent, { input: { name, description, price, onSale, categoryId, quantity } }, { db }) => {
        const newProduct = {
            id: uuidv4(),
            name,
            description,
            price,
            quantity,
            onSale,
            categoryId
        };

        if (db.categories.find(category => category.id === categoryId) === undefined) {
            throw new Error('Category does not exist');
        }

        db.products.push(newProduct);

        return newProduct;
    },
    addReview: (parent, { input: { productId, title, date, rating, comment } }, { db }) => {
        const newReview = {
            id: uuidv4(),
            productId,
            title,
            date,
            rating,
            comment
        };

        if (db.products.find(product => product.id === productId) === undefined) {
            throw new Error('Product does not exist');
        }

        db.reviews.push(newReview);

        return newReview;
    },
    // Deletion with no cascading
    deleteCategory: (parent, { id }, { db }) => {
        db.categories = db.categories.filter(category => category.id !== id);
        db.products = db.products.map(product => {
            if (product.categoryId === id) {
                return {
                    ...product,
                    categoryId: null
                }
            }
            return product;
        });
        return true;
    },
    // Deletion with cascading
    deleteProduct: (parent, { id }, { db }) => {
        db.products = db.products.filter(product => product.id !== id);
        db.reviews = db.reviews.filter(review => review.productId !== id);
        return true;
    },
    deleteReview: (parent, { id }, { db }) => {
        db.reviews = db.reviews.filter(review => review.id !== id);
        return true;
    },
    updateCategory: (parent, { id, input }, { db }) => {
        const index = db.categories.findIndex(category => category.id === id);

        if (index === -1) {
            throw new Error('Category does not exist');
        }

        db.categories[index] = {
            ...db.categories[index],
            ...input,
        }

        return db.categories[index];
    },
    updateProduct: (parent, { id, input }, { db }) => {
        const index = db.products.findIndex(product => product.id === id);

        if (index === -1) {
            throw new Error('Product does not exist');
        }

        db.products[index] = {
            ...db.products[index],
            ...input,
        }

        return db.products[index];
    },
    updateReview: (parent, { id, input }, { db }) => {
        const index = db.reviews.findIndex(review => review.id === id);

        if (index === -1) {
            throw new Error('Review does not exist');
        }

        db.reviews[index] = {
            ...db.reviews[index],
            ...input,
        }

        return db.reviews[index];
    }
}