import React from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	return (
		<div className="container">
      <h1>My Todos</h1>
      <ul>
        <li>Make the bed</li>
        <li>Walk the dog</li>
        <li>Pay taxes</li>
        <li>Go on vacation</li>
      </ul>
    </div>
	);
};

export default Home;