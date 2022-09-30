const DEFAULT_PRODUCT = {
    cat: "phone",
    desc: "The Samsung Galaxy S6 is powered by 1.5GHz octa-core Samsung Exynos 7420\n processor and it comes with 3GB of RAM. The phone packs 32GB of \ninternal storage cannot be expanded. ",
    id: 1,
    img: "imgs/galaxy_s6.jpg",
    price: 360.0,
    title: "Samsung galaxy s6"
};

export function getViewStubbedResponse({cat, desc, id, img, price, title} = {}) {
    return {
        cat: cat || DEFAULT_PRODUCT.cat,
        desc: desc || DEFAULT_PRODUCT.desc,
        id: id || DEFAULT_PRODUCT.id,
        img: img || DEFAULT_PRODUCT.img,
        price: price || DEFAULT_PRODUCT.price,
        title: title || DEFAULT_PRODUCT.title,
    }
}

export function getViewCartStubbedResponse() {
   return {
        Items: [{
            cookie: "test",
            id: "819ae0aa-a9f5-7630-cd6c-93c1cb14283e",
            prod_id: 100
        }]
    };
}
