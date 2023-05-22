/////////////////////////////////////////////////////////
// Configurations related to listing.                  //
// Main configuration here is the extended data config //
/////////////////////////////////////////////////////////

// NOTE: if you want to change the structure of the data,
// you should also check src/util/configHelpers.js
// some validation is added there.

/**
 * Configuration options for listing fields (custom extended data fields):
 * - key:                           Unique key for the extended data field.
 * - scope (optional):              Scope of the extended data can be either 'public' or 'private'.
 *                                  Default value: 'public'.
 *                                  Note: listing doesn't support 'protected' scope atm.
 * - includeForListingTypes:        An array of listing types, for which the extended
 *   (optional)                     data is relevant and should be added.
 * - schemaType (optional):         Schema for this extended data field.
 *                                  This is relevant when rendering components and querying listings.
 *                                  Possible values: 'enum', 'multi-enum', 'text', 'long', 'boolean'.
 * - enumOptions (optional):        Options shown for 'enum' and 'multi-enum' extended data.
 *                                  These are used to render options for inputs and filters on
 *                                  EditListingPage, ListingPage, and SearchPage.
 * - filterConfig:                  Filter configuration for listings query.
 *    - indexForSearch (optional):    If set as true, it is assumed that the extended data key has
 *                                    search index in place. I.e. the key can be used to filter
 *                                    listing queries (then scope needs to be 'public').
 *                                    Note: Flex CLI can be used to set search index for the key:
 *                                    https://www.sharetribe.com/docs/references/extended-data/#search-schema
 *                                    Read more about filtering listings with public data keys from API Reference:
 *                                    https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
 *                                    Default value: false,
 *   - filterType:                    Sometimes a single schemaType can be rendered with different filter components.
 *                                    For 'enum' schema, filterType can be 'SelectSingleFilter' or 'SelectMultipleFilter'
 *   - label:                         Label for the filter, if the field can be used as query filter
 *   - searchMode (optional):         Search mode for indexed data with multi-enum schema.
 *                                    Possible values: 'has_all' or 'has_any'.
 *   - group:                         SearchPageWithMap has grouped filters. Possible values: 'primary' or 'secondary'.
 * - showConfig:                    Configuration for rendering listing. (How the field should be shown.)
 *   - label:                         Label for the saved data.
 *   - isDetail                       Can be used to hide detail row (of type enum, boolean, or long) from listing page.
 *                                    Default value: true,
 * - saveConfig:                    Configuration for adding and modifying extended data fields.
 *   - label:                         Label for the input field.
 *   - placeholderMessage (optional): Default message for user input.
 *   - isRequired (optional):         Is the field required for providers to fill
 *   - requiredMessage (optional):    Message for those fields, which are mandatory.
 */
export const listingFields = [
  {
    key: 'category',
    scope: 'public',
    schemaType: 'enum',
    enumOptions: [
      { option: 'urns', label: 'Urns' },
      { option: 'jewelry', label: 'Jewelry' },
      { option: 'art', label: 'Art' },
      { option: 'services', label: 'Services' },
      { option: 'memorial-decor', label: 'Memorial Decor' },
      { option: 'alternatives', label: 'Alternatives' },
      { option: 'charity', label: 'Charity Donations' },
    ],
    filterConfig: {
      indexForSearch: true,
      filterType: 'SelectMultipleFilter',
      label: 'Category',
      group: 'primary',
    },
    showConfig: {
      label: 'Category',
      isDetail: true,
    },
    saveConfig: {
      label: 'Category',
      placeholderMessage: 'Select an option…',
      isRequired: true,
      requiredMessage: 'You need to select a category.',
    },
  },
  {
    key: 'material',
    scope: 'public',
    schemaType: 'multi-enum',
    enumOptions: [
      { option: 'wood', label: 'Wood' },
      { option: 'metal', label: 'Metal' },
      { option: 'ceramic', label: 'Ceramic' },
      { option: 'glass', label: 'Glass' },
      { option: 'plastic', label: 'Plastic' },
      { option: 'biodegradable', label: 'Biodegradable' },
      { option: 'stone', label: 'Stone' },
      { option: 'gemstone', label: 'Gemstone' },
      { option: 'other', label: 'Other' },
      { option: 'none', label: 'None' },
    ],
    filterConfig: {
      indexForSearch: true,
      label: 'Material',
      group: 'secondary',
    },
    showConfig: {
      label: 'Material',
      isDetail: true,
    },
    saveConfig: {
      label: 'Material',
      placeholderMessage: 'Select an option…',
      isRequired: true,
      requiredMessage: 'You need to select a material.',
    },
  },
  {
    key: 'color',
    scope: 'public',
    schemaType: 'multi-enum',
    enumOptions: [
      { option: 'black', label: 'Black ' },
      { option: 'brown', label: 'Brown' },
      { option: 'white', label: 'White' },
      { option: 'grey', label: 'Grey' },
      { option: 'gold', label: 'Gold' },
      { option: 'silver', label: 'Silver' },
      { option: 'bronze', label: 'Bronze' },
      { option: 'natural', label: 'Natural' },
      { option: 'red', label: 'Red' },
      { option: 'orange', label: 'Orange' },
      { option: 'yellow', label: 'Yellow' },
      { option: 'green', label: 'Green' },
      { option: 'blue', label: 'Blue' },
      { option: 'green', label: 'Green' },
      { option: 'purple', label: 'Purple' },
      { option: 'pink', label: 'Pink' },
      { option: 'none', label: 'None' },
    ],
    filterConfig: {
      indexForSearch: true,
      label: 'Color',
      group: 'secondary',
    },
    showConfig: {
      label: 'Color',
      isDetail: true,
    },
    saveConfig: {
      label: 'Color',
      placeholderMessage: 'Select an option…',
      isRequired: true,
      requiredMessage: 'You need to select a color.',
    },
  },
  {
    key: 'specialty-features',
    scope: 'public',
    schemaType: 'multi-enum',
    enumOptions: [
      { option: 'solidified-ash', label: 'Solidified cremated remains' },
      { option: 'engraving', label: 'Can be engraved' },
      { option: 'image-customization', label: 'Customizable image' },
      { option: 'hand-made', label: 'Handmade' },
      { option: 'usa-made', label: 'Made in the US' },
    ],
    filterConfig: {
      indexForSearch: true,
      label: 'Specialty Features',
      searchMode: 'has_all',
      group: 'secondary',
    },
    showConfig: {
      label: 'Specialty Features',
    },
    saveConfig: {
      label: 'Specialty Features',
      placeholderMessage: 'Select an option…',
      isRequired: false,
    },
  },

  {
    key: 'product-SKU',
    scope: 'private',
    schemaType: 'text',
    showConfig: {
      label: 'Product SKU',
    },
    saveConfig: {
      label: 'Product SKU',
      placeholderMessage:
        'Add your product SKU for better inventory traceability (not visible to buyers)…',
      isRequired: false,
    },
  },

  // // An example of how to use transaction type specific custom fields and private data.
  // {
  //   key: 'note',
  //   scope: 'public',
  //   includeForListingTypes: ['product-selling'],
  //   schemaType: 'text',
  //   showConfig: {
  //     label: 'Extra notes',
  //   },
  //   saveConfig: {
  //     label: 'Extra notes',
  //     placeholderMessage: 'Some public extra note about this bike...',
  //   },
  // },
  // {
  //   key: 'privatenote',
  //   scope: 'private',
  //   includeForListingTypes: ['daily-booking'],
  //   schemaType: 'text',
  //   saveConfig: {
  //     label: 'Private notes',
  //     placeholderMessage: 'Some private note about this bike...',
  //   },
  // },
];

///////////////////////////////////////////////////////////////////////
// Configurations related to listing types and transaction processes //
///////////////////////////////////////////////////////////////////////

// A presets of supported listing configurations
//
// Note 1: With first iteration of hosted configs, we are unlikely to support
//         multiple listing types, even though this template has some
//         rudimentary support for it.
// Note 2: transaction type is part of listing type. It defines what transaction process and units
//         are used when transaction is created against a specific listing.

/**
 * Configuration options for listing experience:
 * - listingType:     Unique string. This will be saved to listing's public data on
 *                    EditListingWizard.
 * - label            Label for the listing type. Used as microcopy for options to select
 *                    listing type in EditListingWizard.
 * - transactionType  Set of configurations how this listing type will behave when transaction is
 *                    created.
 *   - process          Transaction process.
 *                      The process must match one of the processes that this client app can handle
 *                      (check src/util/transaction.js) and the process must also exists in correct
 *                      marketplace environment.
 *   - alias            Valid alias for the aforementioned process. This will be saved to listing's
 *                      public data as transctionProcessAlias and transaction is initiated with this.
 *   - unitType         Unit type is mainly used as pricing unit. This will be saved to
 *                      transaction's protected data.
 *                      Recommendation: don't use same unit types in completely different processes
 *                      ('item' sold should not be priced the same as 'item' booked).
 * - stockType        This is relevant only to listings with product-selling listing type.
 *                    If set to 'oneItem', stock management is not showed and the listing is
 *                    considered unique (stock = 1).
 *                    Possible values: 'oneItem' and 'multipleItems'.
 *                    Default: 'multipleItems'.
 */

export const listingTypes = [
  /*
  {
    listingType: 'daily-booking',
    label: 'Daily booking',
    transactionType: {
      process: 'default-booking',
      alias: 'default-booking/release-1',
      unitType: 'day',
    },
  },
  */
  // // Here are some examples for other listingTypes
  // // TODO: SearchPage does not work well if both booking and product selling are used at the same time
  // {
  //   listingType: 'nightly-booking',
  //   label: 'Nightly booking',
  //   transactionType: {
  //     process: 'default-booking',
  //     alias: 'default-booking/release-1',
  //     unitType: 'night',
  //   },
  // },
  // {
  //   listingType: 'hourly-booking',
  //   label: 'Hourly booking',
  //   transactionType: {
  //     process: 'default-booking',
  //     alias: 'default-booking/release-1',
  //     unitType: 'hour',
  //   },
  // },
  {
    listingType: 'product-selling',
    label: 'Sell memorials and services',
    transactionType: {
      process: 'default-purchase',
      alias: 'default-purchase/release-1',
      unitType: 'item',
    },
    stockType: 'multipleItems',
  },
];

// SearchPage can enforce listing query to only those listings with valid listingType
// However, it only works if you have set 'enum' type search schema for the public data fields
//   - listingType
//
//  Similar setup could be expanded to 2 other extended data fields:
//   - transactionProcessAlias
//   - unitType
//
// Read More:
// https://www.sharetribe.com/docs/how-to/manage-search-schemas-with-flex-cli/#adding-listing-search-schemas
export const enforceValidListingType = false;
