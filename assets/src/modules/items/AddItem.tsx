import React, { Component } from 'react';
import ItemForm from './ItemForm';

import { API } from 'aws-amplify';
import { Redirect } from 'react-router';

export default class AddItem extends Component {
  render() {
    return (
      <div>
        <ItemForm />
      </div>
    );
  }
}
