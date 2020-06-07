import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import api from '../../services/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 40,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

interface RouteParams {
  point_id: number;
}

interface Data {
  point: {
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

const Detail: React.FC = () => {
  const [collectionPointDetails, setCollectionPointDetails] = useState<Data>(
    {} as Data
  );

  const navigation = useNavigation();
  const route = useRoute();

  const { point_id } = route.params as RouteParams;

  function handleNavigateBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function getCollectionPointDetails() {
      const response = await api.get(`points/${point_id}`);

      setCollectionPointDetails(response.data.collectionPoint);

      console.log(collectionPointDetails);
    }

    getCollectionPointDetails();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34CB79" />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{
            uri: collectionPointDetails.point.image,
          }}
        />

        <Text style={styles.pointName}>
          {collectionPointDetails.point.name}
        </Text>
        <Text style={styles.pointItems}>
          {collectionPointDetails.items.map((item) => item.title).join(',')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço:</Text>
          <Text style={styles.addressContent}>Parelhas, RN</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={() => {}}>
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={() => {}}>
          <Icon name="mail" size={20} color="#FFF" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

export default Detail;
