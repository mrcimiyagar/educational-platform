import PropTypes from "prop-types";
import React from "react";
import Rater from "react-rater";

const Rating = props => (
  <Rater {...props}>
    <Star />
  </Rater>
);

const Star = props => {
  const starProps = Object.assign({}, props);
  const nameMap = {
    isDisabled: "is-disabled",
    isActive: "is-active",
    isActiveHalf: "is-active-half",
    willBeActive: "will-be-active"
  };
  const className = Object.keys(nameMap)
    .filter(prop => (delete starProps[prop], props[prop]))
    .map(prop => nameMap[prop])
    .join(" ");
  return <div className={`react-rater-star ${className}`} {...starProps} />;
};

Star.defaultProps = {
  willBeActive: false,
  isActive: false,
  isActiveHalf: false,
  isDisabled: false
};

Star.propTypes = {
  isActive: PropTypes.bool,
  isActiveHalf: PropTypes.bool,
  willBeActive: PropTypes.bool,
  isDisabled: PropTypes.bool
};

export default Rating;