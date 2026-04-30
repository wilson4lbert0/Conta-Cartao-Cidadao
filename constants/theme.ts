import { Platform } from 'react-native';

export const CV = {
  azul: '#003893',
  azulEscuro: '#001F5C',
  vermelho: '#CF2027',
  ouro: '#F5A623',
  branco: '#FFFFFF',
  fundo: '#F0F2F5',
  superfície: '#FFFFFF',
  textoP: '#0D1B2A',
  textoS: '#6B7A8D',
  sucesso: '#00A651',
  erro: '#CF2027',
  borda: '#E2E6EA',
};

const tintColorLight = CV.azul;
const tintColorDark = CV.branco;

export const Colors = {
  light: {
    text: CV.textoP,
    background: CV.fundo,
    tint: tintColorLight,
    icon: CV.textoS,
    tabIconDefault: CV.textoS,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#0A0F1E',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
