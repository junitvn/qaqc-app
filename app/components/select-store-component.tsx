import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@/theme/context';
import { ChevronRightIcon, MapPinIcon, SearchIcon } from './icons';
import { useBrandsData, type Store } from '@/hooks/use-brands-api';

// Re-export Store type for backward compatibility
export type { Store };

export interface SelectStoreComponentProps {
  stores?: Store[];
  isLoading?: boolean;
  onStoreSelect?: (store: Store) => void;
}

export function SelectStoreComponent({
  stores: storesProp,
  isLoading: isLoadingProp,
  onStoreSelect,
}: SelectStoreComponentProps) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  // Fetch brands with nested stores from API
  const { data: brands, isLoading: isLoadingBrands } = useBrandsData();

  // Build brand options
  const brandOptions = useMemo(() => {
    if (!brands || !Array.isArray(brands)) {
      return [{ label: t('selectStoreComponent.allBrands'), value: 'all' }];
    }
    return [
      { label: t('selectStoreComponent.allBrands'), value: 'all' },
      ...brands.map(brand => ({ label: brand.name || 'No name', value: brand.id }))
    ];
  }, [brands, t]);

  // Get all stores from brands based on selected brand
  const allStoresFromApi = useMemo(() => {
    if (!brands || !Array.isArray(brands)) return [];

    if (!selectedBrandId) {
      // Return all stores from all brands
      return brands.flatMap(brand => brand.stores || []);
    }

    // Return stores from selected brand
    const selectedBrand = brands.find(brand => brand.id === selectedBrandId);
    return selectedBrand?.stores || [];
  }, [brands, selectedBrandId]);

  // Use stores from props if provided, otherwise use stores from API
  const stores = storesProp || allStoresFromApi;
  const isLoading = isLoadingProp !== undefined ? isLoadingProp : isLoadingBrands;

  // Filter stores based on search query
  const filteredStores = useMemo(() => {
    if (!stores || stores.length === 0) return [];

    return stores.filter(store => {
      const matchesSearch =
        store.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.code?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [stores, searchQuery]);

  const handleBrandChange = (value: string) => {
    setSelectedBrandId(value === 'all' ? null : value);
    setIsBrandModalOpen(false);
  };

  const handleStoreSelect = (store: Store) => {
    // Find the brand that contains this store
    let brandId = selectedBrandId;
    if (!brandId && brands) {
      const brand = brands.find(b => b.stores?.some(s => s.id === store.id));
      brandId = brand?.id || null;
    }

    // Call onStoreSelect with store and brand info
    onStoreSelect?.(store);
  };

  const selectedBrandOption = brandOptions.find(opt => opt.value === (selectedBrandId || 'all'));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Brand Filter */}
        <View style={styles.filterContainer}>
          <Text style={[styles.filterTitle, { color: theme.colors.text }]}>{t('selectStoreComponent.brand')}</Text>
          <TouchableOpacity
            style={[
              styles.selectTrigger,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setIsBrandModalOpen(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.selectText,
                {
                  color: selectedBrandOption ? theme.colors.text : theme.colors.textDim,
                }
              ]}
              numberOfLines={1}
            >
              {selectedBrandOption?.label || t('selectStoreComponent.selectBrand')}
            </Text>
            <ChevronRightIcon
              width={20}
              height={20}
              color={theme.colors.textDim}
            />
          </TouchableOpacity>
        </View>

        {/* Brand Selection Modal */}
        <Modal
          visible={isBrandModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsBrandModalOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsBrandModalOpen(false)}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.colors.background }
              ]}
              onStartShouldSetResponder={() => true}
            >
              <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  {t('selectStoreComponent.selectBrand')}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsBrandModalOpen(false)}
                >
                  <Text style={[styles.closeButtonText, { color: theme.colors.tint }]}>
                    {t('selectStoreComponent.close')}
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                {brandOptions.map((option) => {
                  const isSelected = option.value === (selectedBrandId || 'all');
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionItem,
                        isSelected && { backgroundColor: theme.colors.errorBackground }
                      ]}
                      onPress={() => handleBrandChange(option.value)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: isSelected ? theme.colors.tint : theme.colors.text,
                            fontWeight: isSelected ? '600' : '400',
                          }
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <View style={[styles.checkmark, { backgroundColor: theme.colors.tint }]} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              }
            ]}
            placeholder={t('selectStoreComponent.searchPlaceholder')}
            placeholderTextColor={theme.colors.textDim}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Store List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.tint} />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Results Count */}
            <Text style={[styles.resultsCount, { color: theme.colors.textDim }]}>
              {t('selectStoreComponent.storesCount', { count: filteredStores.length })}
            </Text>

            {/* Store Cards */}
            {filteredStores.map((store) => (
              <TouchableOpacity
                key={store.id}
                style={[
                  styles.storeCard,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => handleStoreSelect(store)}
                activeOpacity={0.7}
              >
                {/* Store Icon */}
                <View style={styles.storeIconContainer}>
                  <MapPinIcon
                    width={24}
                    height={24}
                    color={theme.colors.textDim}
                  />
                </View>

                {/* Store Info */}
                <View style={styles.storeInfo}>
                  <Text
                    style={[
                      styles.storeName,
                      { color: theme.colors.text }
                    ]}
                    numberOfLines={1}
                  >
                    {store.name || 'No name'}
                  </Text>
                  {store.code && (
                    <Text
                      style={[
                        styles.storeAddress,
                        { color: theme.colors.textDim }
                      ]}
                      numberOfLines={1}
                    >
                      {store.code}
                    </Text>
                  )}
                </View>

                {/* Chevron Right Icon */}
                <View style={styles.chevronContainer}>
                  <ChevronRightIcon
                    width={20}
                    height={20}
                    color={theme.colors.textDim}
                  />
                </View>
              </TouchableOpacity>
            ))}

            {/* Empty State */}
            {filteredStores.length === 0 && !isLoading && (
              <View style={styles.emptyState}>
                <SearchIcon width={48} height={48} color={theme.colors.textDim} />
                <Text style={[styles.emptyText, { color: theme.colors.textDim }]}>
                  {t('selectStoreComponent.noStoreFound')}
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.colors.textDim }]}>
                  {selectedBrandId ? t('selectStoreComponent.noStoreHintBrand') : t('selectStoreComponent.noStoreHintSelect')}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '70%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 56,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchInput: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    gap: 8,
    paddingBottom: 16,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  storeIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeInfo: {
    flex: 1,
    gap: 4,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  storeAddress: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  chevronContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '400',
  },
});
