// Copyright 2004-present Facebook. All Rights Reserved.

import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {TestComp} from '../src/Core';

Enzyme.configure({adapter: new Adapter()});

it('CheckboxWithLabel changes the text after click', () => {

    beforeAll(() => {
        const div = document.createElement('div');
        window.domNode = div;
        document.body.appendChild(div);
      })
      

  // Render a checkbox with label in the document
  const core = mount(<TestComp testData={0}/>, { attachTo: document.body });
  
  expect(core.text()).toEqual('bye');
});
