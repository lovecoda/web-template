import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { array, bool, func, node, number, object, oneOfType, shape, string } from 'prop-types';
import loadable from '@loadable/component';
import classNames from 'classnames';
import omit from 'lodash/omit';

import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import {
  propTypes,
  LISTING_STATE_CLOSED,
  LINE_ITEM_NIGHT,
  LINE_ITEM_DAY,
  LINE_ITEM_ITEM,
  LINE_ITEM_HOUR,
} from '../../util/types';
import { formatMoney } from '../../util/currency';
import { parse, stringify } from '../../util/urlHelpers';
import { sellerOrUserName } from '../../util/data';
import {
  getSupportedProcessesInfo,
  isBookingProcess,
  resolveLatestProcessName,
} from '../../transactions/transaction';

import { ModalInMobile, PrimaryButton, AvatarSmall, H1, H2 } from '../../components';

import css from './OrderPanel.module.css';

const BookingTimeForm = loadable(() =>
  import(/* webpackChunkName: "BookingTimeForm" */ './BookingTimeForm/BookingTimeForm')
);
const BookingDatesForm = loadable(() =>
  import(/* webpackChunkName: "BookingDatesForm" */ './BookingDatesForm/BookingDatesForm')
);
const ProductOrderForm = loadable(() =>
  import(/* webpackChunkName: "ProductOrderForm" */ './ProductOrderForm/ProductOrderForm')
);

// This defines when ModalInMobile shows content as Modal
const MODAL_BREAKPOINT = 1023;
const TODAY = new Date();

const priceData = (price, currency, intl) => {
  if (price && price.currency === currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: `(${price.currency})`,
      priceTitle: `Unsupported currency (${price.currency})`,
    };
  }
  return {};
};

const openOrderModal = (isOwnListing, isClosed, history, location) => {
  if (isOwnListing || isClosed) {
    window.scrollTo(0, 0);
  } else {
    const { pathname, search, state } = location;
    const searchString = `?${stringify({ ...parse(search), orderOpen: true })}`;
    history.push(`${pathname}${searchString}`, state);
  }
};

const closeOrderModal = (history, location) => {
  const { pathname, search, state } = location;
  const searchParams = omit(parse(search), 'orderOpen');
  const searchString = `?${stringify(searchParams)}`;
  history.push(`${pathname}${searchString}`, state);
};

const dateFormattingOptions = { month: 'short', day: 'numeric', weekday: 'short' };

const OrderPanel = props => {
  const {
    rootClassName,
    className,
    titleClassName,
    listing,
    lineItemUnitType: lineItemUnitTypeMaybe,
    isOwnListing,
    onSubmit,
    title,
    titleDesktop,
    author,
    authorLink,
    onManageDisableScrolling,
    onFetchTimeSlots,
    monthlyTimeSlots,
    history,
    location,
    intl,
    onFetchTransactionLineItems,
    onContactUser,
    lineItems,
    marketplaceCurrency,
    dayCountAvailableForBooking,
    marketplaceName,
    fetchLineItemsInProgress,
    fetchLineItemsError,
  } = props;

  const transactionProcessAlias = listing?.attributes?.publicData?.transactionProcessAlias || '';
  const processName = resolveLatestProcessName(transactionProcessAlias.split('/')[0]);
  const unitType = listing?.attributes?.publicData?.unitType;
  const lineItemUnitType = lineItemUnitTypeMaybe || `line-item/${unitType}`;

  const price = listing?.attributes?.price;

  const showPriceMissing = !price;
  const PriceMissing = () => {
    return (
      <p className={css.error}>
        <FormattedMessage id="OrderPanel.listingPriceMissing" />
      </p>
    );
  };
  const showInvalidCurrency = price?.currency !== marketplaceCurrency;
  const InvalidCurrency = () => {
    return (
      <p className={css.error}>
        <FormattedMessage id="OrderPanel.listingCurrencyInvalid" />
      </p>
    );
  };

  const timeZone = listing?.attributes?.availabilityPlan?.timezone;
  const isClosed = listing?.attributes?.state === LISTING_STATE_CLOSED;

  const isBooking = isBookingProcess(processName);
  const shouldHaveBookingTime = isBooking && [LINE_ITEM_HOUR].includes(lineItemUnitType);
  const showBookingTimeForm = shouldHaveBookingTime && !isClosed && timeZone;

  const shouldHaveBookingDates =
    isBooking && [LINE_ITEM_DAY, LINE_ITEM_NIGHT].includes(lineItemUnitType);
  const showBookingDatesForm = shouldHaveBookingDates && !isClosed && timeZone;

  // The listing resource has a relationship: `currentStock`,
  // which you should include when making API calls.
  const currentStock = listing.currentStock?.attributes?.quantity;
  const isOutOfStock = lineItemUnitType === LINE_ITEM_ITEM && currentStock === 0;

  // Show form only when stock is fully loaded. This avoids "Out of stock" UI by
  // default before all data has been downloaded.
  const shouldHaveProductOrder = !isBooking && [LINE_ITEM_ITEM].includes(lineItemUnitType);
  const showProductOrderForm = shouldHaveProductOrder && typeof currentStock === 'number';

  const supportedProcessesInfo = getSupportedProcessesInfo();
  const isKnownProcess = supportedProcessesInfo.map(info => info.name).includes(processName);

  const { pickupEnabled, shippingEnabled } = listing?.attributes?.publicData || {};

  const showClosedListingHelpText = listing.id && isClosed;
  const { formattedPrice, priceTitle } = priceData(price, marketplaceCurrency, intl);
  const isOrderOpen = !!parse(location.search).orderOpen;

  const subTitleText = showClosedListingHelpText
    ? intl.formatMessage({ id: 'OrderPanel.subTitleClosedListing' })
    : null;

  const authorDisplayName = sellerOrUserName(author);

  const classes = classNames(rootClassName || css.root, className);
  const titleClasses = classNames(titleClassName || css.orderTitle);

  return (
    <div className={classes}>
      <ModalInMobile
        containerClassName={css.modalContainer}
        id="OrderFormInModal"
        isModalOpenOnMobile={isOrderOpen}
        onClose={() => closeOrderModal(history, location)}
        showAsModalMaxWidth={MODAL_BREAKPOINT}
        onManageDisableScrolling={onManageDisableScrolling}
        usePortal
      >
        <div className={css.modalHeading}>
          <H1 className={css.heading}>{title}</H1>
        </div>

        <div className={css.orderHeading}>
          {titleDesktop ? titleDesktop : <H2 className={titleClasses}>{title}</H2>}
          {subTitleText ? <div className={css.orderHelp}>{subTitleText}</div> : null}
        </div>

        {price ? (
          <div className={css.priceContainer}>
            <p className={css.price}>{formatMoney(intl, price)}</p>
            <div className={css.perUnit}>
              <FormattedMessage id="OrderPanel.perUnit" values={{ unitType }} />
            </div>
          </div>
        ) : null}

        <div className={css.author}>
          <AvatarSmall user={author} className={css.providerAvatar} />
          <span className={css.providerNameLinked}>
            <FormattedMessage id="OrderPanel.author" values={{ name: authorLink }} />
          </span>
          <span className={css.providerNamePlain}>
            <FormattedMessage id="OrderPanel.author" values={{ name: authorDisplayName }} />
          </span>
        </div>

        {showPriceMissing ? (
          <PriceMissing />
        ) : showInvalidCurrency ? (
          <InvalidCurrency />
        ) : showBookingTimeForm ? (
          <BookingTimeForm
            className={css.bookingForm}
            formId="OrderPanelBookingTimeForm"
            lineItemUnitType={lineItemUnitType}
            onSubmit={onSubmit}
            price={price}
            marketplaceCurrency={marketplaceCurrency}
            dayCountAvailableForBooking={dayCountAvailableForBooking}
            listingId={listing.id}
            isOwnListing={isOwnListing}
            monthlyTimeSlots={monthlyTimeSlots}
            onFetchTimeSlots={onFetchTimeSlots}
            startDatePlaceholder={intl.formatDate(TODAY, dateFormattingOptions)}
            endDatePlaceholder={intl.formatDate(TODAY, dateFormattingOptions)}
            timeZone={timeZone}
            marketplaceName={marketplaceName}
            onFetchTransactionLineItems={onFetchTransactionLineItems}
            lineItems={lineItems}
            fetchLineItemsInProgress={fetchLineItemsInProgress}
            fetchLineItemsError={fetchLineItemsError}
          />
        ) : showBookingDatesForm ? (
          <BookingDatesForm
            className={css.bookingForm}
            formId="OrderPanelBookingDatesForm"
            lineItemUnitType={lineItemUnitType}
            onSubmit={onSubmit}
            price={price}
            marketplaceCurrency={marketplaceCurrency}
            dayCountAvailableForBooking={dayCountAvailableForBooking}
            listingId={listing.id}
            isOwnListing={isOwnListing}
            monthlyTimeSlots={monthlyTimeSlots}
            onFetchTimeSlots={onFetchTimeSlots}
            timeZone={timeZone}
            marketplaceName={marketplaceName}
            onFetchTransactionLineItems={onFetchTransactionLineItems}
            lineItems={lineItems}
            fetchLineItemsInProgress={fetchLineItemsInProgress}
            fetchLineItemsError={fetchLineItemsError}
          />
        ) : showProductOrderForm ? (
          <ProductOrderForm
            formId="OrderPanelProductOrderForm"
            onSubmit={onSubmit}
            price={price}
            marketplaceCurrency={marketplaceCurrency}
            currentStock={currentStock}
            pickupEnabled={pickupEnabled}
            shippingEnabled={shippingEnabled}
            listingId={listing.id}
            isOwnListing={isOwnListing}
            marketplaceName={marketplaceName}
            onFetchTransactionLineItems={onFetchTransactionLineItems}
            onContactUser={onContactUser}
            lineItems={lineItems}
            fetchLineItemsInProgress={fetchLineItemsInProgress}
            fetchLineItemsError={fetchLineItemsError}
          />
        ) : !isKnownProcess ? (
          <p className={css.errorSidebar}>
            <FormattedMessage id="OrderPanel.unknownTransactionProcess" />
          </p>
        ) : null}
      </ModalInMobile>
      <div className={css.openOrderForm}>
        <div className={css.priceContainerInCTA}>
          <div className={css.priceValue} title={priceTitle}>
            {formattedPrice}
          </div>
          <div className={css.perUnitInCTA}>
            <FormattedMessage id="OrderPanel.perUnit" values={{ unitType }} />
          </div>
        </div>

        {isClosed ? (
          <div className={css.closedListingButton}>
            <FormattedMessage id="OrderPanel.closedListingButtonText" />
          </div>
        ) : (
          <PrimaryButton
            onClick={() => openOrderModal(isOwnListing, isClosed, history, location)}
            disabled={isOutOfStock}
          >
            {isBooking ? (
              <FormattedMessage id="OrderPanel.ctaButtonMessageBooking" />
            ) : isOutOfStock ? (
              <FormattedMessage id="OrderPanel.ctaButtonMessageNoStock" />
            ) : (
              <FormattedMessage id="OrderPanel.ctaButtonMessagePurchase" />
            )}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
};

OrderPanel.defaultProps = {
  rootClassName: null,
  className: null,
  titleClassName: null,
  isOwnListing: false,
  authorLink: null,
  titleDesktop: null,
  subTitle: null,
  monthlyTimeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
};

OrderPanel.propTypes = {
  rootClassName: string,
  className: string,
  titleClassName: string,
  listing: oneOfType([propTypes.listing, propTypes.ownListing]),
  isOwnListing: bool,
  author: oneOfType([propTypes.user, propTypes.currentUser]).isRequired,
  authorLink: node,
  onSubmit: func.isRequired,
  title: oneOfType([node, string]).isRequired,
  titleDesktop: node,
  subTitle: oneOfType([node, string]),
  onManageDisableScrolling: func.isRequired,

  onFetchTimeSlots: func.isRequired,
  monthlyTimeSlots: object,
  onFetchTransactionLineItems: func.isRequired,
  onContactUser: func,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,
  marketplaceCurrency: string.isRequired,
  dayCountAvailableForBooking: number.isRequired,
  marketplaceName: string.isRequired,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default compose(
  withRouter,
  injectIntl
)(OrderPanel);
