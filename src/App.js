import React from "react";
import Particles from "react-particles-js";
import "./App.css";

import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";

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

const initialState = {
    input: "",
    imageUrl: "",
    box: {},
    route: "signin",
    isSignedIn: false,
    user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
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
            isSignedIn: false,
            user: {
                id: "",
                name: "",
                email: "",
                entries: 0,
                joined: "",
            },
        };
    }

    loadUser = data => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined,
            },
        });
    };

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

    displayFaceBox = box => this.setState({ box });
    onInputChange = e => this.setState({ input: e.target.value });

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        fetch("http://localhost:4000/imageurl", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                input: this.state.input,
            }),
        })
            .then(response => response.json())
            .then(resp => {
                if (resp) {
                    fetch("http://localhost:4000/image", {
                        method: "put",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: this.state.user.id,
                        }),
                    })
                        .then(res => res.json())
                        .then(count => {
                            this.setState({
                                ...this.state.user,
                                entries: count,
                            });
                        })
                        .catch(err => console.log(err));
                }
                let boundBoxData =
                    resp.outputs[0].data.regions[0].region_info.bounding_box;

                this.displayFaceBox(this.calculateFaceLocation(boundBoxData));
            })
            .catch(err => console.log(err));
    };

    onRouteChange = route => {
        if (route === "signout") {
            this.setState(initialState);
        } else if (route === "home") {
            this.setState({ isSignedIn: true });
        }
        this.setState({ route: route });
    };

    render() {
        const { isSignedIn, imageUrl, route, box } = this.state;
        return (
            <div className="App">
                <Particles params={particlesOptions} className="particles" />
                <Navigation
                    isSignedIn={isSignedIn}
                    onRouteChange={this.onRouteChange}
                />
                {route === "home" ? (
                    <>
                        <Logo />
                        <Rank
                            name={this.state.user.name}
                            entries={this.state.user.entries}
                        />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}
                        />
                        <FaceRecognition box={box} imageUrl={imageUrl} />
                    </>
                ) : route === "signin" ? (
                    <Signin
                        loadUser={this.loadUser}
                        onRouteChange={this.onRouteChange}
                    />
                ) : (
                    <Register
                        loadUser={this.loadUser}
                        onRouteChange={this.onRouteChange}
                    />
                )}
            </div>
        );
    }
}

export default App;
