import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';

import { NamedLink } from '../../../components';
import { navigationConfig } from '../../../config/configNavigation';

import css from './TopbarNavigation.module.css';

const TopbarNavigation = props => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <ul className={css.navigationList}>
        {navigationConfig.map(item => {
          return (
            <li key={item.key} className={css.navigationItem}>
              <NamedLink
                className={css.navigationLink}
                name="SearchPage"
                to={{ search: `pub_category=${item.key}` }}
              >
                {item.label}
              </NamedLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

TopbarNavigation.defaultProps = {
  rootClassName: null,
  className: null,
};

TopbarNavigation.propTypes = {
  rootClassName: string,
  className: string,
};

export default TopbarNavigation;
