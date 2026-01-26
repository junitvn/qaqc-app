import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { CustomHeader } from '@/components/custom-header';
import { SelectStoreComponent } from '@/components/select-store-component';
import { useAppTheme } from '@/theme/context';
import { useBrandsData } from '@/hooks/use-brands-api';

export function SelectStoreScreen() {
  const { theme } = useAppTheme();
  const navigation = useNavigation();
  const { data: brands } = useBrandsData();

  const handleStoreSelect = (store: { id: string; name: string; code?: string }) => {
    // Find the brand that contains this store
    const brand = brands?.find(b => b.stores?.some(s => s.id === store.id));
    const brandId = brand?.id || '';

    // Navigate to questionnaires screen with brand_id and store_id
    navigation.navigate('Questionnaires', {
      brandId,
      storeId: store.id,
      storeName: store.name || '',
    });
  };

  return (
    <Screen preset="scroll" backgroundColor={theme.colors.background}>
      <CustomHeader
        title="Lựa chọn cửa hàng"
        subtitle="Chọn cửa hàng để bắt đầu kiểm tra"
      />
      <View style={{ flex: 1 }}>
        <SelectStoreComponent onStoreSelect={handleStoreSelect} />
      </View>
    </Screen>
  );
}
