import { listingFields } from './configListing';

const categoryField = listingFields.find(field => field.key === 'category');
const categoryOptions = categoryField.enumOptions.map(o => ({ key: o.option, label: o.label }));

/**
 * Navigation config
 */
export const navigationConfig = categoryOptions;
