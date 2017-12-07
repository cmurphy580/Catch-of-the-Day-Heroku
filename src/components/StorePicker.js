import React, { Component } from 'react';
//import { render } from 'react-dom';

import { getFunName } from '../helpers';

class StorePicker extends Component {
  /*constructor() { //the constructor of component - runs when app is created
    super(); //runs react.component first then allows us to additional functionality
    this.goToStore = this.goToStore.bind(this); //binds 'this' to the StorePicker Component //this method is good for methods that you have to use more than once
  }*/
  goToStore(event) {
    event.preventDefault(); //stops the form from submitting (ie page refreshing)
    console.log('You changed the URL!');
    //first grab text from flexbox
    const storeId = this.storeInput.value;
    console.log(`Going to ${storeId}`)
    //second transition from/to store/:storeId
    this.context.router.transitionTo(`/store/${storeId}`);
  }
  render() {
    return (
      <form className="store-selector" onSubmit={(e) => this.goToStore(e)}>
        {/*Use control E to autocomplete with Emmet. Can use the above method to make sure 'this' refers to StorePicker, or {this.goToStore.bind(this)}, which Binds the goToStoreMethod to the StorePicker component ('this'). Only using this method once, if not see method above.*/}
        <h2>Please Enter a Store</h2>
        <input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input)=>{this.storeInput = input}}/>
        <button type="submit">Visit Store</button>
      </form>
    )
  }
}
//video 12
StorePicker.contextTypes = {
  router: React.PropTypes.object
}

export default StorePicker;
