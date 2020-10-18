import React, {useState} from 'react';
import MapView, {Marker,Callout, PROVIDER_GOOGLE} from 'react-native-maps';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import mapMarker from '../images/map-marker.png';
import {Feather} from '@expo/vector-icons';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Orphanage {
  id: number;
  name:string;
  latitude:number;
  longitude:number;
}

export default function OrphanagesMap(){
    const navigation = useNavigation();
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    useFocusEffect(() => {
      api.get('orphanages').then(response => {
        setOrphanages(response.data);
      });
    });

    function handleNavigationToCreateOrphanage(){
        navigation.navigate('SelectMapPosition');
    }

    function handleNavigationToOrphanageDetails(id:number){
      navigation.navigate('OrphanageDetails', {id});
  }

    return(

        <View style={styles.container}>
            <MapView 
            style={styles.map} 
            provider={PROVIDER_GOOGLE}
            initialRegion={{
                latitude: -22.0108948,
                longitude: -47.8951577,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
            }} 
            >
            {orphanages.map(orphanage => {
              return (
                <Marker 
                    key={orphanage.id}
                    icon={mapMarker}
                    calloutAnchor={{
                        x:2.6,
                        y:0.8,
                    }}
                    coordinate={{
                    latitude: orphanage.latitude,
                    longitude: orphanage.longitude,
                    }}
                >
                  <Callout tooltip={true} onPress={() => handleNavigationToOrphanageDetails(orphanage.id)}>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutText}>{orphanage.name}</Text>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
            </MapView>

            <View style={styles.footer}>
            <Text style={styles.footerText}> {orphanages.length} Orfanatos encontrados</Text>

            <RectButton 
                style={styles.createOrphanageButton} 
                onPress={handleNavigationToCreateOrphanage}
            >
                <Feather name="plus" size={20} color="#FFF" />
            </RectButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    calloutContainer: {
      width:160,
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderRadius: 16,
      justifyContent: 'center',
    },
    calloutText: {
      color: '#0089a5',
      fontFamily:'Nunito_700Bold',
      fontSize: 14,
    },
  
    footer:{
      position:'absolute',
      left:24,
      right:24,
      bottom:36,
  
      backgroundColor: 'rgba(255,255,255, 0.8)',
      borderRadius: 20,
      height: 56,
      paddingLeft: 24,
  
      flexDirection:'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  
    footerText:{
      color: '#8fa7b3',
      fontSize: 15,
      fontFamily:'Nunito_700Bold',
      marginLeft:5,
    },
  
    createOrphanageButton:{
      width: 56,
      height: 56,
      backgroundColor: '#15c3d6',
      borderRadius:20,
  
      justifyContent:'center',
      alignItems: 'center',
    },
  
  });