import { Link } from 'vtex.render-runtime'
import styles from '../styles/custom-product-summary-component'

export default function CustomProductSummaryComponent({ product }) {
    return (
        <div className={styles.sonoma_shelf_item}>
            <meta itemprop="sku" content={product.sku.itemId} />
            <meta itemprop="description" />
            <figure className={styles.thumbnail}>
                <Link href={product.link} className={styles.flags}>
                </Link>
                <div className={styles["sonoma-image"]} itemprop="image">
                    <Link href={product.link} itemprop="url">
                        <picture>
                            <source media="(max-width: 320px)" srcset={resizeImg(product, 128)} />
                            <source media="(max-width: 425px)" srcset={resizeImg(product, 150)} />
                            <source media="(max-width: 425px)" srcset={resizeImg(product, 170)} />
                            <source media="(min-width: 1000px)" srcset={resizeImg(product, 236)} />
                            <img itemprop="image" src={resizeImg(product, 236)} />
                        </picture>
                    </Link>
                </div>
            </figure>
            <div className={styles.content}>
                <div className={styles["brand-container"]}>
                </div>
                <div className={styles["location-container"]}>
                    <Link to={product.link}>
                        <p className={styles["sonoma-paragraph-location"]} itemprop="location">
                            {`${getRegion(product)} ${getCountry(product)}`}
                        </p>
                    </Link>
                </div>
                <h1 className={styles["sonoma-title"]} itemprop="name">
                    <Link to={product.link}>
                        <span className={styles["formatted-text"]}>
                            {product.productName}
                        </span>
                    </Link>
                </h1>
                <div itemprop="offers" itemscope="itemscope" itemtype="http://schema.org/AggregateOffer" className={styles["prices"]}>
                    <meta itemprop="availability" content="https://schema.org/InStock" />
                    <meta itemprop="priceCurrency" content="BRL" />
                    <meta itemprop="highPrice" content="156" />
                    <meta itemprop="lowPrice" content="79.9" />
                    <div className={styles["offer-container"]}>
                        <div className={styles["oldprice-container"]}>
                            <Link to={product.link} className={styles.oldprice}>
                                De:
                                <span className={styles["sonoma-currency"]}>
                                    {formatCurrency(product.priceRange.listPrice.lowPrice)}
                                </span>
                                por
                            </Link>
                        </div>
                    </div>
                    <div className={styles["price-container"]}>
                        <div className={styles["price-container-box"]}>
                            <Link to={product.link} className={styles["price-box"]}>
                                <span className={styles["sonoma-currency"]}>
                                    {formatCurrency(getBoxPrice(product))}
                                </span>
                                <span className={styles["price-unity"]}>
                                    Na caixa ou
                                </span>
                            </Link>
                        </div>
                        <div className={styles["price-container-unity"]}>
                            <Link to={product.link} className={styles["price"]}>
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
                    <Link to={product.link} className={styles["price"]}>
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
        return product.priceRange.sellingPrice.lowPrice * ( 1 - discountFormated/100 )
    }
}

function resizeImg(product, desiredSize) {
    const imgUrlArray = product.sku.images[0].imageUrl.split("-")
    const resizedImgUrl =  `${imgUrlArray[0]}-${desiredSize}-auto` 
    return resizedImgUrl
}