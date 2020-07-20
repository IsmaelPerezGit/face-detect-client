import React from "react";
import { findByLabelText } from "@testing-library/react";

const Navigation = () => {
    return (
        <nav style={{ display: "flex", justifyContent: "flex-end" }}>
            <p>Sign Out</p>
        </nav>
    );
};

export default Navigation;
