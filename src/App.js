import React from "react";
import "./App.css";
import Particles from "react-particles-js";

import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";

const particlesOptions = {
    particles: {
        number: {
            value: 50,
            density: {
                enable: true,
                value_area: 800,
            },
        },
    },
};

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            input: "",
        };
    }

    onInputChange = event => {
        console.log(event.target.value);
    };

    onButtonSubmit = () => {
        console.log("click");
    };

    render() {
        return (
            <div className="App">
                <Particles params={particlesOptions} className="particles" />
                <Navigation />
                <Logo />
                <Rank />
                <ImageLinkForm
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit}
                />
                {/*<FaceRecognition /> */}
            </div>
        );
    }
}

export default App;
