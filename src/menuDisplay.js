
import React from "react";

const menuDisplay = ({ label, onClick, isActive }) => (
	<div
		className={`tab ${isActive ? "active" : ""}`}
		onClick={onClick}
	>
		{label}
	</div>
);

export default menuDisplay;
