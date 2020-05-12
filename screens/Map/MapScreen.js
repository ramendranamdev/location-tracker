import React, {useState} from 'react'
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, View, Text, Dimensions } from 'react-native';


// const ASPECT_RATIO = width / height;
// const LATITUDE = 37.78825;
// const LONGITUDE = -122.4324;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// const SPACE = 0.01;


function MapScreen() {

  const [region, setRegion] = useState({
    latitude: 51.5078788,
    longitude: -0.0877321,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009
  });


    return (
        <View style={styles.container}>
            <MapView
             style={styles.map}
             region={region}
      onRegionChangeComplete={region => setRegion(region)}
            >
              <Marker coordinate={{ latitude: 51.5078788, longitude: -0.0877321 }} />
            </MapView>

        </View>
    )
}

export default MapScreen


const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    marker: {
      marginLeft: 46,
      marginTop: 33,
      fontWeight: 'bold',
    },
  });