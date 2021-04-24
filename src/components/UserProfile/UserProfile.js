import React from "react";

function UserProfile(props) {
	return (
		<div>
			{/* <h1>Welcome, {name ? name.split(" ")[0] : "Stranger"}</h1> */}
			<h1>Welcome {props.name}</h1>
		</div>
	);
}

export default UserProfile;
