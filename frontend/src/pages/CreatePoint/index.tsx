import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { FiArrowLeft, FiCheckCircle, FiX } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

import logo from '../../assets/logo.svg';
import CityIBGEResponse from '../../interfaces/city';
import Items from '../../interfaces/items';
import UFIBGEResponse from '../../interfaces/uf';
import api from '../../services/api';

import './styles.css';

const CreatePoint: React.FC = () => {
  const [cities, setCities] = useState<CityIBGEResponse[]>();
  const [items, setItems] = useState<Items[]>();
  const [ufs, setUfs] = useState<UFIBGEResponse[]>();

  const [initalPosition, setInitialPosition] = useState<[number, number]>();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selecttedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedUf, setSelectedUf] = useState('0');

  const history = useHistory();

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>): void {
    setSelectedUf(event.target.value);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>): void {
    const city = event.target.value;

    setSelectedCity(city);
  }

  function findUfIdByName(ufName: string): number | undefined {
    const ufSelected = ufs?.filter((uf) => uf.nome === ufName)[0];

    return ufSelected?.id;
  }

  function handleMapClick(event: LeafletMouseEvent): void {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSelectItem(id: number): void {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selecttedPosition;
    const collectionItems = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items: collectionItems,
    };

    const response = await api.post('points', data);

    if (response) {
      document
        .querySelector('div.confirm-register')
        ?.setAttribute('id', 'active');

      setTimeout(() => {
        history.push('/');
      }, 2000);
    } else {
      alert('Não deu! :(');
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    async function getItems() {
      const response = await api.get('/items');

      setItems(response.data);
    }

    getItems();
  }, []);

  useEffect(() => {
    async function getUFs() {
      const response = await axios.get<UFIBGEResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      );

      const UF = response.data.map((uf) => uf);

      setUfs(UF);
    }

    getUFs();
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    const ufID = findUfIdByName(selectedUf);

    async function getCitys() {
      const response = await axios.get<CityIBGEResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufID}/municipios`
      );

      setCities(response.data);
    }

    getCitys();
  }, [selectedUf]);

  return (
    <div id="main-container">
      <div className="confirm-register">
        <FiCheckCircle size={45} color="#34CB79" />
        <p>Cadastro concluído</p>
      </div>

      <div id="page-create-point">
        <header>
          <img src={logo} alt="Logo ecoleta" />

          <Link to="/">
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>
            Cadastro do
            <br />
            ponto de coleta
          </h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade:</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">Whatsapp:</label>
                <input
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map center={initalPosition} zoom={15} onclick={handleMapClick}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={selecttedPosition} />
            </Map>

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select
                  name="uf"
                  id="uf"
                  value={selectedUf}
                  onChange={handleSelectUf}
                >
                  <option value="0">Selecione uma UF</option>
                  {ufs?.map((uf) => (
                    <option key={uf.id} value={uf.nome}>
                      {uf.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select
                  name="city"
                  id="city"
                  value={selectedCity}
                  onChange={handleSelectCity}
                >
                  <option value="0">Selecione uma cidade</option>
                  {cities?.map((city) => (
                    <option key={city.id} value={city.nome}>
                      {city.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Ítems de coleta</h2>
              <span>Selecione um ou mais itens abaixo</span>
            </legend>

            <ul className="items-grid">
              {items?.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                >
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit">Cadastrar ponto de coleta</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoint;
