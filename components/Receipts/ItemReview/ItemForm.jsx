import React, { useEffect, useState } from 'react';
import {
  Box, Heading, HStack, Spinner, VStack,
} from 'native-base';
import moment from 'moment';
import CategorySelector from './CategorySelector.jsx';
import StorageSelector from './StorageSelector.jsx';
import ShelfLifeDays from './ShelfLifeDays.jsx';
import PurchaseDateInput from './PurchaseDateInput.jsx';
import ExpiryDate from './ExpiryDate.jsx';
import DeleteReviewItem from './DeleteReviewItem.jsx';
import Notes from './Notes.jsx';

export default function ItemForm({ item }) {
  const { name, categories } = item;
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedStorage, setSelectedStorage] = useState();
  const [purchaseDate, setPurchaseDate] = useState(moment(new Date(), 'DD-MM-YYYY').format('DD-MM-YYYY'));
  const [updatedShelfLifeDays, setUpdatedShelfLifeDays] = useState(0);
  const [prevShelfLifeDays, setPrevShelfLifeDays] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const newExpiryDate = moment(purchaseDate, 'DD-MM-YYYY')
    .add(updatedShelfLifeDays, 'days')
    .format('DD-MM-YYYY');

  const [expiryDate, setExpiryDate] = useState(newExpiryDate);

  useEffect(() => {
    if (categories.length === 1) {
      setSelectedCategory(categories[0]);
    }
    setIsLoading(false);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedStorage) setUpdatedShelfLifeDays(selectedStorage.shelfLifeDays);

    setIsLoading(false);
  }, [selectedStorage]);

  return (
    <Box
      px={4}
      pt={4}
      pb={10}
      borderBottomWidth={1}
      borderBottomColor="primary.300"
    >
      <HStack justifyContent="space-between" alignItems="center" mb={2}>
        <Heading size="md" textTransform="capitalize">{name}</Heading>
        <DeleteReviewItem reviewItemId={item.id} reviewItemName={name} />
      </HStack>
      {isLoading && <Spinner />}
      {!isLoading
      && (
      <VStack space={4}>
        <CategorySelector
          item={item}
          reviewItemId={item.id}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setIsLoading={setIsLoading}
        />
        {selectedCategory && (
        <StorageSelector
          item={item}
          reviewItemId={item.id}
          selectedCategory={selectedCategory}
          selectedStorage={selectedStorage}
          setSelectedStorage={setSelectedStorage}
          setIsLoading={setIsLoading}
        />
        )}
        {selectedStorage && (
        <ShelfLifeDays
          item={item}
          reviewItemId={item.id}
          selectedStorage={selectedStorage}
          updatedShelfLifeDays={updatedShelfLifeDays}
          setUpdatedShelfLifeDays={setUpdatedShelfLifeDays}
          expiryDate={expiryDate}
          purchaseDate={purchaseDate}
          prevShelfLifeDays={prevShelfLifeDays}
          setPrevShelfLifeDays={setPrevShelfLifeDays}
        />
        )}
        <PurchaseDateInput
          item={item}
          reviewItemId={item.id}
          purchaseDate={purchaseDate}
          setPurchaseDate={setPurchaseDate}
        />
        {selectedStorage && (
        <ExpiryDate
          item={item}
          reviewItemId={item.id}
          purchaseDate={purchaseDate}
          updatedShelfLifeDays={updatedShelfLifeDays}
          setExpiryDate={setExpiryDate}
          expiryDate={expiryDate}
          newExpiryDate={newExpiryDate}
        />
        )}
        <Notes item={item} reviewItemId={item.id} />
      </VStack>
      )}
    </Box>
  );
}
