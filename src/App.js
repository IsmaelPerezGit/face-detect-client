import React from "react";
import "./App.css";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import { CLARIFAI_KEY } from "./keys";

import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";

const app = new Clarifai.App({
    apiKey: CLARIFAI_KEY,
});

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
            imageUrl: "",
        };
    }

    onInputChange = event => {
        this.setState({ input: event.target.value });
    };

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
            function (response) {
                console.log(
                    response.outputs[0].data.regions[0].region_info.bounding_box
                );
                // do something with response
            },
            function (err) {
                // there was an error
            }
        );
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
                <FaceRecognition imageUrl={this.state.imageUrl} />
            </div>
        );
    }
}

export default App;
