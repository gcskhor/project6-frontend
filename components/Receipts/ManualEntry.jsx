import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { VStack, Input, Button } from 'native-base';
import axios from 'axios';
import SearchDropDown from '../ManualEntryComponents/SearchDropdown.js';
import IngredientList from '../ManualEntryComponents/IngredientList.js';
import { BACKEND_URL } from '../../store.js';
import { useFridgeContext } from '../FridgeContext.jsx';

export default function ManualEntry({ navigation }) {
  const {
    reviewIdsDispatch,
    dispatchHelpers: { addReviewIds },
  } = useFridgeContext();
  const [filteredList, setFilteredList] = useState(null);
  const [foodItems, setFoodItems] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      const foodItemsResponse = await axios.get(`${BACKEND_URL}/foodItems/index`);
      setFoodItems(foodItemsResponse.data);
      setFilteredList(foodItemsResponse.data);
    };
    fetchFoodItems();
  }, []);

  const styles = StyleSheet.create({
    searchBar: {
      color: 'black',
      backgroundColor: 'grey',
      padding: 10,
    },
  });

  const [searchStatus, setSearchStatus] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    if (e) {
      setSearchStatus(true);
      const searchText = e.toLowerCase();
      setSearchInput(searchText);
      const filteredSearch = foodItems.filter((x) => x.name.match(searchText)
        && !selectedList.map((y) => y.name).includes(x.name));
      setFilteredList(filteredSearch);
    } else {
      setSearchStatus(false);
      setSearchInput('');
      setFilteredList(foodItems);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <VStack space={3} alignItems="center">
        <Input
          size="xl"
          placeholder="Search"
          placeholderTextColor="white"
          onChangeText={handleSearch}
          value={searchInput}
          style={styles.searchBar}
        />
        {searchStatus && (
        <SearchDropDown
          filtered={filteredList}
          setSelectedList={setSelectedList}
          setSearchInput={setSearchInput}
          setFilteredList={setFilteredList}
          setSearchStatus={setSearchStatus}
        />
        )}
        {selectedList && (
        <IngredientList
          selected={selectedList}
          setSelectedList={setSelectedList}
        />
        )}
        {selectedList.length > 0 && (
        <Button
          onPress={() => {
            reviewIdsDispatch(addReviewIds(selectedList.map((x) => x.id)));
            navigation.navigate('Review Items');
          }}
        >
          Review Items
        </Button>
        )}
      </VStack>
    </View>
  );
}
