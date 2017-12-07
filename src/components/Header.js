import React from 'react';
//statless component when the the only function is rendering html (lose this.props and pass props as an argument)
const Header = (props) => {
  return (
    <header className="top">
      <h1>
      Catch
      <span className="ofThe">
        <span className="of">of</span>
        <span className="the">the</span>
      </span>
      Day
      </h1>
      {/*Making the h3 tag dynamic*/}
      <h3 className="tagline"><span>{props.tagline}</span></h3>
    </header>
  )
}

Header.propTypes = {
  tagline: React.PropTypes.string
}


export default Header;
