import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Box, Button, ScrollView } from 'native-base';
import axios from 'axios';
import moment from 'moment';

import { BACKEND_URL } from '../../store.js';
import { useFridgeContext } from '../FridgeContext.jsx';
import { useUserContext } from '../UserContext.jsx';
import ItemForm from './ItemReview/ItemForm.jsx';
import NoItemsToReview from './ItemReview/NoItemsToReview.jsx';
import setNotification from '../NotificationComponent/setNotification.js';

export default function ItemReview({ navigation }) {
  const {
    reviewIds,
    reviewIdsDispatch,
    reviewItems,
    reviewItemsDispatch,
    fridgeDispatch,
    dispatchHelpers: {
      removeReviewIds,
      addReviewItems,
      removeReviewItems,
      addFridgeItems,
    },
  } = useFridgeContext();
  const { jwtToken } = useUserContext();

  useEffect(() => {
    try {
      if (reviewIds && reviewIds.length > 0) {
        axios
          .get(`${BACKEND_URL}/reviewItems/${reviewIds}`)
          .then((response) => {
            console.log(response.data);
            reviewItemsDispatch(addReviewItems(response.data));
            reviewIdsDispatch(removeReviewIds());
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const areAllFieldsFilled = (items) => {
    let fieldsFilled = true;
    items.forEach((item) => {
      [
        'category',
        'storageMethod',
        'purchaseDate',
        'expiryDate',
        'shelfLifeDays',
      ].forEach((key) => {
        if (!item[key]) {
          fieldsFilled = false;
        }
      });
    });
    return fieldsFilled;
  };

  const formatReviewItems = (items) =>
    items.map((item) => ({
      userId: '',
      shelfLifeItemId: item.shelfLifeItemId,
      addedOn: moment(item.purchaseDate, 'DD-MM-YYYY').toDate(),
      expiry: moment(item.expiryDate, 'DD-MM-YYYY').toDate(),
      notes: 'add this in later', // TODO: ADD NOTES INPUT COMPONENT
    }));

  const handleAddToFridge = () => {
    if (areAllFieldsFilled(reviewItems)) {
      console.log('all fields filled');
      const items = formatReviewItems(reviewItems);
      const dataToBackend = {
        items,
        userToken: jwtToken,
      };
      console.log('data to backend', dataToBackend);
      axios
        .post(`${BACKEND_URL}/fridgeItems/add`, dataToBackend)
        .then((response) => {
          const addedItems = response.data;
          reviewItemsDispatch(removeReviewItems());
          fridgeDispatch(addFridgeItems(addedItems));
          if (Platform.OS !== 'web')
            addedItems.forEach((item) => setNotification(item));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('fields not filled');
      // SNACKBAR TO INDICATE EMPTY FIELD?
    }
  };

  return (
    <Box style={{ height: '100%' }}>
      <ScrollView
        maxW="500"
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
          minW: '72',
        }}
      >
        {reviewItems &&
          reviewItems.map((item, index) => (
            <ItemForm item={item} key={item.shelfLifeItemId} index={index} />
          ))}
        {reviewItems && reviewItems.length > 0 && (
          <Button onPress={handleAddToFridge}>Add to Fridge</Button>
        )}
        {(!reviewItems || reviewItems.length === 0) && (
          <NoItemsToReview navigation={navigation} />
        )}
      </ScrollView>
    </Box>
  );
}
