import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'creditcard.fill': 'credit-card',
  'arrow.left.arrow.right': 'swap-horiz',
  'doc.text.fill': 'receipt-long',
  'person.fill': 'person',
  'bell.fill': 'notifications',
  'arrow.down.circle.fill': 'arrow-circle-down',
  'arrow.up.circle.fill': 'arrow-circle-up',
  'clock.fill': 'history',
  'qrcode': 'qr-code',
  'checkmark.circle.fill': 'check-circle',
  'xmark.circle.fill': 'cancel',
  'gear': 'settings',
  'lock.fill': 'lock',
  'eye.fill': 'visibility',
  'eye.slash.fill': 'visibility-off',
  'chevron.left': 'chevron-left',
  'plus': 'add',
  'minus': 'remove',
  'magnifyingglass': 'search',
  'building.2.fill': 'account-balance',
  'star.fill': 'star',
  'info.circle.fill': 'info',
  'exclamationmark.triangle.fill': 'warning',
  'shield.fill': 'shield',
  'antenna.radiowaves.left.and.right': 'nfc',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
