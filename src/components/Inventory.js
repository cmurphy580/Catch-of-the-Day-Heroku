import React, { Component } from 'react';

import AddFishForm from './AddFishForm';
import base from '../base'; //firebase setup

class Inventory extends Component {
  constructor() {
    super();
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      uid: null,
      owner: null
    }
  }
  componentDidMount() {
    //Authentication on client-side. Below is for when page reloads we authenticate the user again using authHandler function. prevents them from having to login in each time page reloads. To get of moment when buttons appear change lifecycle method
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, { user });
      }
    });
  }
  authenticate(provider) {
    console.log(`Trying to log in with ${provider}`);
    base.authWithOAuthPopup(provider, this.authHandler);  //lesson 24 (11m20s)
  }
  authHandler(err, authData) {
    console.log(authData);
    if (err) {
      console.log(err);
      return;
    }
    //grab the store info
    const storeRef = base.database().ref(this.props.storeId); //lesson 24 (13m48s) allows us refer to database in firebase or use any of the firebase apis. ref() allows us to get a piece of our database the parameter is equal to the particular store we are looking for.
    //query firebase once for the store database (snapshot === object of all the data)
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};
      //claim it as our own if there is no owner already
      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }
      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      })
    });

  }
  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your inventory</p>
        <button className="facebook" onClick={()=> this.authenticate('google')}>Log In with Google</button>
        <button className="github" onClick={()=> this.authenticate('github')}>Log In with Github</button>
        <button className="twitter" onClick={()=> this.authenticate('twitter')}>Log In with Github</button>
      </nav>
    )
  }
  logout() {
    base.unauth(); //severs ties with firebase
    this.setState({ uid: null });
  }
  handleChange(e, key) {
    const fish = this.props.fishes[key];
    //take a copy of that fish and update it with the new data
    //to add to the object the part of the object that was changed, use e.target.name, which tells us what input was changed, and e.target.value, which is the new value the user typed in.
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value
    }
    this.props.updateFish(key, updatedFish);
  }
  renderInventory(key) {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={(e) => this.handleChange(e, key)}/>
        <input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={(e) => this.handleChange(e, key)}/>
        <select type="text" name="status" value={fish.status} placeholder="Fish Status" onChange={(e) => this.handleChange(e, key)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc" onChange={(e) => this.handleChange(e, key)}></textarea>
        <input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={(e) => this.handleChange(e, key)}/>
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  }
  render() {
    const logout = <button onClick={this.logout}>Log Out</button>; //do not need to return in function because no parameters are passed through the logout function.
    //check if they are not loggin in
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }
    //check if they are the owner of the current store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you are not the owner of this store!</p>
          {logout}
        </div>
      )
    }
    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired
}
export default Inventory;
