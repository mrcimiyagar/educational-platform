
import React, { useEffect } from 'react';
import './style.css';
import {colors} from '../../util/settings';

export default function CustomImageBox(props) {
    const [randId, setRandId] = React.useState(Math.random() + '_' + Date.now() + '_' + Math.random());
    useEffect(() => {
      var placeholder = document.getElementById(randId),
      small = document.getElementById(randId + '_');
      var img = new Image();
      img.src = small.src;
      img.onload = function () {
        small.classList.add('loaded');
      };
      var imgLarge = new Image();
      imgLarge.src = placeholder.dataset.large;
      imgLarge.style.height = '100%';
      imgLarge.style.objectFit = (props.style === undefined || props.style.objectFit === undefined) ? 'fit' : props.style.objectFit;
      imgLarge.onload = function () {
        imgLarge.classList.add('loaded');
      };
      placeholder.appendChild(imgLarge);
    }, [props.src]);
    return (
        <div id={randId} className="placeholder" data-large={props.src}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: colors.blur,
            objectFit: 'fit',
            backgroundColor: 'transparent',
            ...props.style
          }}
        >
        <img
          id={randId + '_'}
          data-src={props.src}
          className="img-small"
          style={{objectFit: (props.style === undefined || props.style.objectFit === undefined) ? 'fit' : props.style.objectFit, height: '100%'}}
        />
        <div style={{paddingBottom: '66.6%'}}></div>
      </div>
    );
}