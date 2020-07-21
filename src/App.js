import React from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import { CLARIFAI_KEY } from "./keys";
import "./App.css";

import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";

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
            box: {},
            route: "signin",
        };
    }

    calculateFaceLocation = data => {
        const image = document.getElementById("inputImage");
        const width = +image.width;
        const height = +image.height;

        return {
            leftCol: data.left_col * width,
            topRow: data.top_row * height,
            rightCol: width - data.right_col * width,
            bottomRow: height - data.bottom_row * height,
        };
    };

    displayFaceBox = box => {
        this.setState({ box });
    };

    onInputChange = event => {
        this.setState({ input: event.target.value });
    };

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        app.models
            .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
            .then(resp => {
                let boundBoxData =
                    resp.outputs[0].data.regions[0].region_info.bounding_box;

                this.displayFaceBox(this.calculateFaceLocation(boundBoxData));
            })
            .catch(err => console.log(err));
    };

    onRouteChange = route => {
        this.setState({ route: route });
    };

    render() {
        return (
            <div className="App">
                <Particles params={particlesOptions} className="particles" />
                <Navigation onRouteChange={this.onRouteChange} />
                {this.state.route === "home" ? (
                    <>
                        <Logo />
                        <Rank />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}
                        />
                        <FaceRecognition
                            box={this.state.box}
                            imageUrl={this.state.imageUrl}
                        />
                    </>
                ) : this.state.route === "signin" ? (
                    <Signin onRouteChange={this.onRouteChange} />
                ) : (
                    <Register onRouteChange={this.onRouteChange} />
                )}
            </div>
        );
    }
}

export default App;
