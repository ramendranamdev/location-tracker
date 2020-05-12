import React, { useState } from "react";
import { StyleSheet} from 'react-native';
import MapView, { Marker } from "react-native-maps";

const SimpleMap = () => {
  const [region, setRegion] = useState({
    latitude: 51.5078788,
    longitude: -0.0877321,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009
  });

  return (
    <MapView
      style={{flex: 1 }}
      region={region}
      onRegionChangeComplete={region => setRegion(region)}
    >
      <Marker coordinate={{ latitude: 51.5078788, longitude: -3.0877321 }} />
    </MapView>
  );
};

export default SimpleMap;

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    }
  });
