import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const totalLEDs = 4; // Assuming 4 LEDs on each ESP32

  const [accessPointLedStatus, setAccessPointLedStatus] = useState(Array(totalLEDs).fill('unknown'));
  const [stationLedStatus, setStationLedStatus] = useState(Array(totalLEDs).fill('unknown'));

  useEffect(() => {
    // Fetch the initial status of LEDs when the app loads
    for (let i = 1; i <= totalLEDs; i++) {
      fetchLedStatus('accessPoint', i);
      fetchLedStatus('station', i);
    }
  }, []);

  const toggleLed = (status, ledNumber, device) => {
    const ip = device === 'accessPoint' ? '192.168.4.1' : '192.168.4.3';

    axios
      .get(`http://${ip}/${status === 'on' ? 'on' : 'off'}/${ledNumber}`)
      .then((response) => {
        console.log(response.data);
        if (device === 'accessPoint') {
          setAccessPointLedStatus((prevStatus) => {
            prevStatus[ledNumber - 1] = status;
            return [...prevStatus];
          });
        } else if (device === 'station') {
          setStationLedStatus((prevStatus) => {
            prevStatus[ledNumber - 1] = status;
            return [...prevStatus];
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchLedStatus = (device, ledNumber) => {
    const ip = device === 'accessPoint' ? '192.168.4.1' : '192.168.4.3';

    axios
      .get(`http://${ip}/${device}/status/${ledNumber}`)
      .then((response) => {
        console.log(response.data);
        if (device === 'accessPoint') {
          setAccessPointLedStatus((prevStatus) => {
            prevStatus[ledNumber - 1] = response.data;
            return [...prevStatus];
          });
        } else if (device === 'station') {
          setStationLedStatus((prevStatus) => {
            prevStatus[ledNumber - 1] = response.data;
            return [...prevStatus];
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const LedControl = ({ device, label, ledNumber, status }) => {
    const buttonColor = status === 'on' ? '#00FF00' : '#FF0000';

    return (
      <View style={styles.container}>
        <Text style={styles.text}>LED {ledNumber}</Text>
        <Text style={styles.statusText}>Status: {status}</Text>
        <TouchableOpacity style={{ ...styles.button, backgroundColor: buttonColor }} onPress={() => toggleLed(status === 'on' ? 'off' : 'on', ledNumber, device)}>
          <Text style={{ color: '#FFFFFF' }}>{status === 'on' ? 'Turn Off' : 'Turn On'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#99AAAB" }}>
      <View style={{justifyContent:'center', alignSelf:'center', marginTop:'5%'}}>
        <Text style={{fontSize: 35, fontWeight:'bold'}}>Home Automation</Text>
      </View>
      <View style={{justifyContent:'center', alignSelf:'center', marginTop:'-1%'}}>
        <Text style={{fontSize: 25, fontWeight:'bold'}}>Offline Mode</Text>
      </View>
      <View style={{justifyContent:'center', alignSelf:'center', marginTop:'5%'}}>
        <Text style={{fontSize: 20, fontWeight:'bold'}}>Drawing Room</Text>
      </View>
      <View style={styles.row}>
        {Array.from({ length: totalLEDs }, (_, i) => (
          <LedControl device="accessPoint" label={`LED ${i + 1}`} ledNumber={i + 1} status={accessPointLedStatus[i]} key={i} />
        ))}
      </View>
      
      <View style={{justifyContent:'center', alignSelf:'center', marginTop:'5%'}}>
        <Text style={{fontSize: 20, fontWeight:'bold'}}>Bedroom</Text>
      </View>
      <View style={styles.row}>
        {Array.from({ length: totalLEDs }, (_, i) => (
          <LedControl device="station" label={`LED ${i + 1}`} ledNumber={i + 1} status={stationLedStatus[i]} key={i} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    margin: 10,
    padding: 10,
  },
  text: {
    fontSize: 18,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
});

export default App;
