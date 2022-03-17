import { useState } from 'react'
import { Link } from 'vtex.render-runtime'
import styles from '../styles/custom-product-summary-component'

export default function CustomProductSummaryComponent({
    product,
    handleMouseEnter,
    handleMouseLeave,
    inViewRef,
    listName,
}) {
    const [isHover, setIsHover] = useState(false);

    return (
        <div
            className={styles.sonoma_shelf_item}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={inViewRef}
        >
            <meta itemProp="sku" content={product.sku.itemId} />
            <meta itemProp="description" />
            <figure className={styles.thumbnail} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                <div className={styles["sonoma-image"]} itemProp="image">
                    <Link
                        page="store.product"
                        params={{
                            slug: product && product.linkText,
                            id: product && product.productId,
                            __listName: listName,
                        }}
                        to={product.link} itemProp="url"
                    >
                        <picture style={isHover ? { display: 'none' } : {}}>
                            <source media="(max-width: 320px)" srcSet={resizeImg(product, 128, false)} />
                            <source media="(max-width: 425px)" srcSet={resizeImg(product, 150, false)} />
                            <source media="(max-width: 425px)" srcSet={resizeImg(product, 170, false)} />
                            <source media="(min-width: 1000px)" srcSet={resizeImg(product, 236, false)} />
                            <img itemProp="image" src={resizeImg(product, 236, false)} />
                        </picture>
                        <picture style={!isHover ? { display: 'none' } : {}}>
                            <source media="(max-width: 320px)" srcSet={resizeImg(product, 128, true)} />
                            <source media="(max-width: 425px)" srcSet={resizeImg(product, 150, true)} />
                            <source media="(max-width: 425px)" srcSet={resizeImg(product, 170, true)} />
                            <source media="(min-width: 1000px)" srcSet={resizeImg(product, 236, true)} />
                            <img itemProp="image" src={resizeImg(product, 236, true)} />
                        </picture>
                    </Link>
                </div>
            </figure>
            <div className={styles.content}>
                <div className={styles["brand-container"]}>
                </div>
                <div className={styles["location-container"]}>
                    <Link
                        page="store.product"
                        params={{
                            slug: product && product.linkText,
                            id: product && product.productId,
                            __listName: listName,
                        }}
                        to={product.link}
                    >
                        <p className={styles["sonoma-paragraph-location"]} itemProp="location">
                            {`${getRegion(product)} ${getCountry(product)}`}
                        </p>
                    </Link>
                </div>
                <h1 className={styles["sonoma-title"]} itemProp="name">
                    <Link
                        page="store.product"
                        params={{
                            slug: product && product.linkText,
                            id: product && product.productId,
                            __listName: listName,
                        }}
                        to={product.link}
                    >
                        <span className={styles["formatted-text"]}>
                            {product.productName}
                        </span>
                    </Link>
                </h1>
                <div itemProp="offers" itemScope="itemScope" itemType="http://schema.org/AggregateOffer" className={styles["prices"]}>
                    <meta itemProp="availability" content="https://schema.org/InStock" />
                    <meta itemProp="priceCurrency" content="BRL" />
                    <meta itemProp="highPrice" content="156" />
                    <meta itemProp="lowPrice" content="79.9" />
                    <div className={styles["offer-container"]}>
                        <div className={styles["oldprice-container"]}>
                            <Link
                                page="store.product"
                                params={{
                                    slug: product && product.linkText,
                                    id: product && product.productId,
                                    __listName: listName,
                                }}
                                to={product.link}
                                className={styles.oldprice}
                            >
                                De
                                <span className={styles["sonoma-currency"]}>
                                    {formatCurrency(product.priceRange.listPrice.lowPrice)}
                                </span>
                                por
                            </Link>
                        </div>
                    </div>
                    <div className={styles["price-container"]}>
                        <div className={styles["price-container-box"]}>
                            <Link
                                page="store.product"
                                params={{
                                    slug: product && product.linkText,
                                    id: product && product.productId,
                                    __listName: listName,
                                }}
                                to={product.link}
                                className={styles["price-box"]}
                            >
                                <span className={styles["sonoma-currency"]}>
                                    {formatCurrency(getBoxPrice(product))}
                                </span>
                                <span className={styles["price-unity"]}>
                                    {getBoxPrice(product) && "Na caixa ou"}
                                </span>
                            </Link>
                        </div>
                        <div className={styles["price-container-unity"]}>
                            <Link
                                page="store.product"
                                params={{
                                    slug: product && product.linkText,
                                    id: product && product.productId,
                                    __listName: listName,
                                }}
                                to={product.link}
                                className={styles["price"]}
                            >
                                <span className={styles["sonoma-currency"]}>
                                    {formatCurrency(product.priceRange.sellingPrice.lowPrice)}
                                </span>
                                <span className={styles["price-unity"]}>
                                    Unidade
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={styles["actions"]}>
                    <Link
                        page="store.product"
                        params={{
                            slug: product && product.linkText,
                            id: product && product.productId,
                            __listName: listName,
                        }}
                        to={product.link}
                        className={styles["price"]}
                    >
                        <button className={styles["sonoma-button-buy"]}>
                            Comprar
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}


function getRegion(product) {
    const region = product.properties.filter(property => property.name === "Regiões")[0]
    return region ? `${region.values[0]},` : '';
}

function getCountry(product) {
    const country = product.properties.filter(property => property.name === "País")[0]
    return country ? country.values[0] : '';
}

function formatCurrency(value) {
    if (value)
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getBoxPrice(product) {
    if (product.sku.sellers?.[0]?.commertialOffer?.teasers?.[0]?.name) {
        const discount = product.sku.sellers[0].commertialOffer.teasers[0].name.split("/")[1]
        const discountFormated = discount.replace(',', '.').replace(/[^\d.]/g, ''); //Regex tira todos os chars menos numeros ;P
        return product.priceRange.sellingPrice.lowPrice * (1 - discountFormated / 100)
    }
}

function resizeImg(product, desiredSize, isHover) {
    let imgIndex;
    if (isHover && product.sku.images[1])
        imgIndex = 1;
    else
        imgIndex = 0;

    const imgUrlArray = product.sku.images[imgIndex].imageUrl.split("-")
    const resizedImgUrl = `${imgUrlArray[0]}-${desiredSize}-${desiredSize}`
    return resizedImgUrl
}