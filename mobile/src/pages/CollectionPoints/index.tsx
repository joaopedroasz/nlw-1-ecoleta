import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import Emoji from 'react-native-emoji';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';

import * as Location from 'expo-location';

import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import api from '../../services/api';
import CollectionPoint from '../../utils/interfaces/collectionPoint';
import Item from '../../utils/interfaces/item';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
  },

  titleContainer: {
    flexDirection: 'row',
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
    color: '#322153',
  },

  recycleIcon: {
    fontSize: 20,
    marginTop: 22,
    marginRight: 10,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

const CollectionPoints: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>(
    []
  );
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const navigation = useNavigation();

  function handleNavigationBack(): void {
    navigation.goBack();
  }

  function handleNavigationToDetail(id: number): void {
    navigation.navigate('Detail', {
      point_id: id,
    });
  }

  function handleSelectedItem(id: number): void {
    const alreadySelectedItem = selectedItems.findIndex((item) => item === id);

    if (alreadySelectedItem >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  useEffect(() => {
    async function getItems() {
      const response = await api.get('items');

      setItems(response.data);
    }

    getItems();
  }, []);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'OPA! ❌',
          'Precisamos de sua permissão para obtermos sua localização!'
        );
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = coords;

      setInitialPosition([latitude, longitude]);
    }

    loadPosition();
  }, []);

  useEffect(() => {
    async function getCollectionPoints() {
      const response = await api.get('points', {
        params: {
          city: 'Parelhas',
          uf: 'Rio Grande do Norte',
          items: [1, 2],
        },
      });

      setCollectionPoints(response.data.collectionPoints);
    }

    getCollectionPoints();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name="arrow-left" size={20} color="#34CB79" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Emoji name="smile" style={styles.recycleIcon} />
          <Text style={styles.title}>Bem-Vindo!</Text>
        </View>

        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta!
        </Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {collectionPoints.map((collectionPoint) => (
                <Marker
                  key={String(collectionPoint.id)}
                  style={styles.mapMarker}
                  coordinate={{
                    latitude: collectionPoint.latitude,
                    longitude: collectionPoint.longitude,
                  }}
                  onPress={() => handleNavigationToDetail(collectionPoint.id)}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: collectionPoint.image,
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>
                      {collectionPoint.name}
                    </Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        >
          {items?.map((item) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              key={String(item.id)}
              onPress={() => handleSelectedItem(item.id)}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CollectionPoints;
