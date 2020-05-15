import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  Button,
  ToastAndroid,
} from "react-native";

import MapView, { Marker, ProviderPropType, Geojson } from "react-native-maps";
import { getLocationData, welcomeRoute } from "./../../core/Api";
import io from "socket.io-client";
import { api_base_url } from "./../../config";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 20.5937;
const LONGITUDE = 78.9629;
// const LATITUDE_DELTA = 0.0922;
const LATITUDE_DELTA = 30.22;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

const myPlace = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [64.165329, 48.844287],
      },
    },
  ],
};

class DefaultMarkers extends React.Component {
  constructor(props) {
    super(props);
    // this.socket = io(api_base_url, {
    //   autoConnect: true,
    //   forceNew: true,
    // });

    window.navigator.userAgent = "react-native";

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [],
      geoJson: {
        type: "FeatureCollection",
        features: [],
      },
      features: [],
      geoJsonLoading: true,
      usertoken: "",
      featureChanges: null,
      socketConnectionError: "",
      socketid: "",
      socketConnected: false,
    };
  }

  // socket.on("disconnect", (reason) => {
  //   error = null;
  // });

  //////////////////////////////////////////
  componentDidMount() {
    this.retrieveItem("userToken")
      .then((data) => {
        //this callback is executed when your Promise is resolved
        this.socket = io(api_base_url, {
          autoConnect: true,
          forceNew: true,
        });
        //Init socket setup
        this.socket.on("connect", () => {
          this.socket.emit("authentication", {
            token: "token",
          });
          // console.log("Socket ID", this.socket.id);
          this.setState({
            socketid: this.socket.id,
            socketConnected: true,
          });
        });

        this.socket.on("unauthorized", (reason) => {
          console.log("Unauthorized", reason);

          this.state.socketConnectionError = reason.message;
          this.socket.disconnect(this.state.socketConnectionError);
        });

        this.socket.on("disconnect", (reason) => {
          console.log("Disconnected", reason);
          this.state.socketConnectionError = null;
          this.setState({
            socketid: "",
            socketConnected: false,
          });
        });

        this.socket.on("changefeed", (feature) => {
          console.log(
            "############################################################"
          );
          // let userId = feature.userid;
          console.log("Recieved update", feature);
          this.setState(
            {
              geoJson: feature,
            },
            () => {
              console.log("State set : ", this.state.geoJson);
              ToastAndroid.show("Feature recieved", ToastAndroid.SHORT);
            }
          );

          console.log(
            "############################################################"
          );
        });

        //Getting geojson data to init map
        this.state.usertoken = data;
        console.log(this.state.usertoken);
        getLocationData(this.state.usertoken)
          .then((result) => {
            const geoJson = result.Data;
            if (result.CODE == 200) {
              console.log("Recieved location data");
              console.log(result.Data);
              this.setState({
                geoJson: result.Data,
                features: result.Data.features,
                geoJsonLoading: false,
              });
            } else if (result.CODE == 204) {
              console.log("Location data not recieved");
              console.log(result.Error);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        //this callback is executed when your Promise is rejected
        console.log("Promise is rejected with error: " + error);
      });
  }

  componentWillUnmount() {
    console.log("component unmounted");
    this.socket.disconnect();
    console.log("Socket dropped");
  }
  async retrieveItem(key) {
    try {
      const retrievedItem = await AsyncStorage.getItem(key);
      // const item = JSON.parse(retrievedItem);
      const item = retrievedItem;
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return;
  }

  updateGeojsonOncgangefeed(feature) {}

  //////////////////////////////////////////

  onMapPress(e) {}

  reloadMap(e) {
    ToastAndroid.show("Map Reload", ToastAndroid.SHORT);
    getLocationData(this.state.usertoken)
      .then((result) => {
        console.log(result);
        const geoJson = result.Data;
        if (result.CODE == 200) {
          console.log("Recieved location data");
          console.log(result.Data);
          this.setState({
            geoJson: result.Data,
            geoJsonLoading: false,
          });
        } else if (result.CODE == 204) {
          console.log("Location data not recieved");
          console.log(result.Error);
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    if (this.state.geoJsonLoading == true && this.state.geoJson == null) {
      return (
        <View style={styles.container}>
          <MapView
            provider={this.props.provider}
            style={styles.map}
            initialRegion={this.state.region}
            onPress={(e) => this.onMapPress(e)}
          ></MapView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => this.setState({ markers: [] })}
              style={styles.bubble}
            >
              <Text>Tap to create a marker of random color</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <MapView
            provider={this.props.provider}
            style={styles.map}
            initialRegion={this.state.region}
          >
            <Geojson geojson={this.state.geoJson} />
          </MapView>
          {/* <Button
            title="Reload Map"
            style={styles.button}
            onPress={(e) => this.reloadMap(e)}
          ></Button> */}
          <View style={styles.buttonContainer}>
            <Button
              title="Reload Map"
              style={styles.button}
              onPress={(e) => this.reloadMap(e)}
            ></Button>
          </View>
          {/* <Button title="Live"></Button> */}
        </View>
      );
    }
  }
}

DefaultMarkers.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: "stretch",
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
});

export default DefaultMarkers;
