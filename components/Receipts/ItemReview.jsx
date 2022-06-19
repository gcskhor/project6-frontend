import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, ScrollView } from 'native-base';
import { BACKEND_URL } from '../../store.js';
import { useFridgeContext } from '../FridgeContext';
import ItemForm from './ItemReview/ItemForm.jsx';

export default function ItemReview() {
  const reviewItemIds = [31, 49, 3, 4, 5, 58];

  const {
    reviewItems,
    reviewItemsDispatch,
    fridgeDispatch,
    dispatchHelpers: {
      addReviewItems,
      editReviewItem,
      removeReviewItem,
      addFridgeItems,
    },
  } = useFridgeContext();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/reviewItems/${reviewItemIds}`)
      .then((response) => {
        console.log(response.data);
        reviewItemsDispatch(addReviewItems(response.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const allFieldsFilled = (reviewItems) => {
    let fieldsFilled = true;
    reviewItems.forEach((item) => {
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

  const handleAddToFridge = () => {
    if (allFieldsFilled(reviewItems)) {
      console.log('all fields filled');
      fridgeDispatch(addFridgeItems(reviewItems));
    } else {
      console.log('fields not filled');
      // SNACKBAR TO INDICATE EMPTY FIELD?
    }
  };

  return (
    <Box>
      <ScrollView
        maxW="500"
        h="700"
        _contentContainerStyle={{
          px: '20px',
          mb: '4',
          minW: '72',
        }}
      >
        {reviewItems &&
          reviewItems.map((item, index) => (
            <ItemForm item={item} key={item.id} index={index} />
          ))}
        <Button onPress={handleAddToFridge}>Add to Fridge</Button>
      </ScrollView>
    </Box>
  );
}
