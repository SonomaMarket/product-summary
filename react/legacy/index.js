/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-handler-names */
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ProductName, ProductPrice } from 'vtex.store-components'
import { ProductListContext } from 'vtex.product-list-context'
import { useInView } from 'react-intersection-observer'

import ProductSummaryNormal from './components/ProductSummaryNormal'
import ProductSummarySmall from './components/ProductSummarySmall'
import ProductSummaryInline from './components/ProductSummaryInline'
import ProductSummaryInlinePrice from './components/ProductSummaryInlinePrice'
import displayButtonTypes, {
  getDisplayButtonNames,
  getDisplayButtonValues,
} from '../utils/displayButtonTypes'
import { productShape } from '../utils/propTypes'
import CustomProductSummaryComponent from './components/CustomProductSummaryComponent'

const DISPLAY_MODE_MAP = {
  normal: ProductSummaryNormal,
  small: ProductSummarySmall,
  inline: ProductSummaryInline,
  inlinePrice: ProductSummaryInlinePrice,
}

/**
 * Product Summary component. Summarizes the product information.
 */
class ProductSummary extends Component {
  static propTypes = {
    /** Product that owns the informations */
    product: productShape,
    /** Shows the product list price */
    showListPrice: PropTypes.bool,
    /** Should redirect to checkout after clicking on buy */
    isOneClickBuy: PropTypes.bool,
    /** Set pricing labels' visibility */
    showLabels: PropTypes.bool,
    /** Set installments' visibility */
    showInstallments: PropTypes.bool,
    /** Set the borders product's visibility */
    showBorders: PropTypes.bool,
    /** Set the discount badge's visibility */
    showBadge: PropTypes.bool,
    /** Set the product description visibility */
    showDescription: PropTypes.bool,
    /** Set the quantity selector visibility */
    showQuantitySelector: PropTypes.bool,
    /** Text of selling Price's label */
    labelSellingPrice: PropTypes.string,
    /** Text of list Price's label */
    labelListPrice: PropTypes.string,
    /** Text shown on badge */
    badgeText: PropTypes.string,
    /** Custom buy button text */
    buyButtonText: PropTypes.string,
    /** Defines the display mode of buy button */
    displayBuyButton: PropTypes.oneOf(getDisplayButtonValues()),
    /** Hides the buy button completely . If active, the button will not be shown in any condition */
    hideBuyButton: PropTypes.bool,
    /** Defines if the collection badges are shown */
    showCollections: PropTypes.bool,
    /** Name schema props */
    nameSchema: PropTypes.object,
    /** Display mode of the summary used in the search result */
    displayMode: PropTypes.oneOf(['normal', 'small', 'inline', 'inlinePrice']),
    /** Function that is executed when a product is clicked */
    actionOnClick: PropTypes.func,
    /** Set the price align to left */
    priceAlignLeft: PropTypes.bool,
    muted: PropTypes.bool,
    index: PropTypes.number,
    position: PropTypes.number,
    listName: PropTypes.string,
  }

  static defaultProps = {
    showListPrice: true,
    showInstallments: true,
    showLabels: true,
    showBadge: true,
    showQuantitySelector: true,
    showCollections: false,
    showDescription: false,
    displayBuyButton: displayButtonTypes.DISPLAY_ALWAYS.value,
    isOneClickBuy: false,
    nameSchema: {
      showProductReference: false,
      showBrandName: false,
      showSku: false,
    },
    displayMode: 'normal',
    showBorders: false,
    muted: false,
  }

  state = {
    isHovering: false,
    isUpdatingItems: false,
  }

  handleMouseLeave = () => {
    this.setState({ isHovering: false })
  }

  handleMouseEnter = () => {
    this.setState({ isHovering: true })
  }

  handleItemsStateUpdate = (isLoading) =>
    this.setState({ isUpdatingItems: isLoading })

  componentDidMount = () => {
    this.sendImpressionEvent()
  }

  componentDidUpdate = (prevProps) => {
    if (
      prevProps.productListDispatch !== this.props.productListDispatch ||
      prevProps.inView !== this.props.inView ||
      prevProps.product !== this.props.product
    ) {
      this.sendImpressionEvent()
    }
  }

  sendImpressionEvent = () => {
    const { inView, productListDispatch } = this.props

    if (inView && productListDispatch) {
      productListDispatch({
        type: 'SEND_IMPRESSION',
        args: { product: this.props.product, position: this.props.position },
      })
    }
  }

  render() {
    const {
      product,
      actionOnClick,
      displayMode,
      displayBuyButton,
      isOneClickBuy,
      buyButtonText,
      showBorders,
      showDescription,
      showBadge,
      badgeText,
      showCollections,
      showListPrice,
      showLabels,
      showInstallments,
      labelSellingPrice,
      labelListPrice,
      nameSchema: showFieldsProps,
      showQuantitySelector,
      priceAlignLeft,
      muted,
      index,
      listName,
      inViewRef,
    } = this.props

    const imageProps = {
      product,
      showBadge,
      badgeText,
      showCollections,
      displayMode,
    }

    const nameProps = { product, showFieldsProps }

    const priceProps = {
      product,
      showListPrice,
      showLabels,
      showInstallments,
      labelSellingPrice,
      labelListPrice,
      isLoading: this.state.isUpdatingItems,
    }

    const buyButtonProps = {
      product,
      displayBuyButton,
      isOneClickBuy,
      buyButtonText,
      isHovering: this.state.isHovering,
    }

    const ProductSummaryComponent =
      DISPLAY_MODE_MAP[displayMode] || ProductSummaryNormal

    return (
      <CustomProductSummaryComponent
        product={product}
        showBorders={showBorders}
        showDescription={showDescription}
        handleMouseEnter={this.handleMouseEnter}
        handleMouseLeave={this.handleMouseLeave}
        handleItemsStateUpdate={this.handleItemsStateUpdate}
        actionOnClick={actionOnClick}
        imageProps={imageProps}
        nameProps={nameProps}
        priceProps={priceProps}
        buyButtonProps={buyButtonProps}
        showQuantitySelector={showQuantitySelector}
        priceAlignLeft={priceAlignLeft}
        muted={muted}
        index={index}
        listName={listName}
        inViewRef={inViewRef}
        isSearchPage={false}
      />
    )
  }
}

const ProductSummaryWrapper = (props) => {
  const { useProductListDispatch } = ProductListContext
  const productListDispatch = useProductListDispatch()
  const [inViewRef, inView] = useInView({
    // Triggers the event when the element is 75% visible
    threshold: 0.75,
    triggerOnce: true,
  })

  return (
    <ProductSummary
      {...props}
      productListDispatch={productListDispatch}
      inView={inView}
      inViewRef={inViewRef}
    />
  )
}

const defaultSchema = {
  title: 'admin/editor.productSummary.title',
  description: 'admin/editor.productSummary.description',
  type: 'object',
  properties: {
    isOneClickBuy: {
      type: 'boolean',
      title: 'admin/editor.productSummary.isOneClickBuy.title',
      default: false,
      isLayout: true,
    },
    showBadge: {
      type: 'boolean',
      title: 'admin/editor.productSummary.showBadge.title',
      default: true,
      isLayout: true,
    },
    displayBuyButton: {
      title: 'admin/editor.productSummary.displayBuyButton.title',
      type: 'string',
      enum: getDisplayButtonValues(),
      enumNames: getDisplayButtonNames(),
      default: displayButtonTypes.DISPLAY_ALWAYS.value,
      isLayout: true,
    },
    showCollections: {
      type: 'boolean',
      title: 'admin/editor.productSummary.showCollections.title',
      default: false,
      isLayout: true,
    },

    ...ProductPrice.schema.properties,
  },
}

ProductSummaryWrapper.getSchema = () => {
  const nameSchema = ProductName.schema

  return {
    ...defaultSchema,
    properties: {
      ...defaultSchema.properties,
      nameSchema,
    },
  }
}

export default ProductSummaryWrapper
