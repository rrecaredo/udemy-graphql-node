export const filterProducts = ({ onSale, avgRating } = {}, products, reviews = []) => {
    let filteredProducts = products;

    if (onSale !== undefined) {
        filteredProducts = products.filter(product => product.onSale === onSale);
    }

    if ([1,2,3,4,5].includes(avgRating)) {
        filteredProducts = products.filter(product => {
            const { sumRating, count } = reviews.reduce((acc, curr) => {
                const { sumRating, count } = acc;

                if (curr.productId === product.id) {
                    return { sumRating: sumRating + curr.rating, count: count + 1 };
                }

                return { sumRating, count };
            }, { sumRating: 0, count: 0 });

            if (!count) { return false; }

            const avgProductRating = sumRating / count;
            return avgProductRating >= avgRating;
        });
    }

    console.log({ filteredProducts })


    return filteredProducts;
};