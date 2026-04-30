import { IconSymbol } from '@/components/ui/icon-symbol';
import { CartaoDigital } from '@/components/cartao-digital';
import { CV } from '@/constants/theme';
import { conta } from '@/constants/mock-data';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function MeuCartaoScreen() {
  const insets = useSafeAreaInsets();
  const [cartaoAtivo, setCartaoAtivo] = useState(conta.cartao.ativo);
  const [dadosVisiveis, setDadosVisiveis] = useState(false);

  function handleBloquear() {
    Alert.alert(
      cartaoAtivo ? 'Bloquear Cartão?' : 'Ativar Cartão?',
      cartaoAtivo
        ? 'O cartão ficará temporariamente suspenso. Pode reativar a qualquer momento.'
        : 'O cartão será reativado imediatamente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => setCartaoAtivo(v => !v) },
      ]
    );
  }

  return (
    <View style={[estilos.container, { paddingTop: insets.top }]}>
      <View style={estilos.header}>
        <Pressable onPress={() => router.back()} style={estilos.btnVoltar}>
          <IconSymbol name="chevron.left" size={22} color={CV.textoP} />
        </Pressable>
        <Text style={estilos.titulo}>Meu Cartão</Text>
        <Pressable style={estilos.btnOlho} onPress={() => setDadosVisiveis(v => !v)}>
          <IconSymbol
            name={dadosVisiveis ? 'eye.slash.fill' : 'eye.fill'}
            size={20}
            color={dadosVisiveis ? CV.azul : CV.textoS}
          />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>

        <CartaoDigital
          numero={conta.cartao.numero}
          titular={conta.cartao.titular}
          validade={conta.cartao.validade}
          ativo={cartaoAtivo}
          revelar={dadosVisiveis}
        />

        {/* Estado do cartão */}
        <View style={estilos.estadoBadgeRow}>
          <View style={[estilos.estadoBadge, { backgroundColor: cartaoAtivo ? `${CV.sucesso}15` : `${CV.vermelho}12` }]}>
            <View style={[estilos.dot, { backgroundColor: cartaoAtivo ? CV.sucesso : CV.vermelho }]} />
            <Text style={[estilos.estadoBadgeTexto, { color: cartaoAtivo ? CV.sucesso : CV.vermelho }]}>
              {cartaoAtivo ? 'Cartão Ativo' : 'Cartão Bloqueado'}
            </Text>
          </View>
          <Text style={estilos.dicaDados}>
            {dadosVisiveis ? 'Dados visíveis' : 'Toque no olho para ver os dados'}
          </Text>
        </View>

        {/* Dados do cartão */}
        <View style={estilos.detalhesCard}>
          <View style={estilos.detalheRow}>
            <Text style={estilos.detalheLabel}>Validade</Text>
            <Text style={estilos.detalheValor}>
              {dadosVisiveis ? conta.cartao.validade : '••/••'}
            </Text>
          </View>
          <View style={estilos.separador} />
          <View style={estilos.detalheRow}>
            <Text style={estilos.detalheLabel}>CVV</Text>
            <Text style={estilos.detalheValor}>
              {dadosVisiveis ? conta.cartao.cvv : '•••'}
            </Text>
          </View>
        </View>

        {/* Botão bloquear/ativar */}
        <Pressable
          style={({ pressed }) => [
            estilos.btnBloquear,
            { backgroundColor: cartaoAtivo ? `${CV.vermelho}12` : `${CV.sucesso}12` },
            pressed && { opacity: 0.75 },
          ]}
          onPress={handleBloquear}
        >
          <IconSymbol
            name={cartaoAtivo ? 'lock.fill' : 'checkmark.circle.fill'}
            size={20}
            color={cartaoAtivo ? CV.vermelho : CV.sucesso}
          />
          <Text style={[estilos.btnBloquearTexto, { color: cartaoAtivo ? CV.vermelho : CV.sucesso }]}>
            {cartaoAtivo ? 'Bloquear Cartão' : 'Ativar Cartão'}
          </Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: CV.fundo },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  btnVoltar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: CV.branco,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  titulo: { color: CV.textoP, fontSize: 20, fontWeight: '800' },
  btnOlho: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: CV.branco,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  estadoBadgeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 16, marginTop: 14, marginBottom: 4,
  },
  estadoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  estadoBadgeTexto: { fontSize: 13, fontWeight: '700' },
  dicaDados: { color: CV.textoS, fontSize: 11 },
  detalhesCard: {
    backgroundColor: CV.branco,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  detalheRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 12,
  },
  detalheLabel: { color: CV.textoS, fontSize: 13 },
  detalheValor: {
    color: CV.textoP, fontSize: 14, fontWeight: '600',
    maxWidth: '60%', textAlign: 'right',
  },
  separador: { height: 1, backgroundColor: CV.borda },
  btnBloquear: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 14,
  },
  btnBloquearTexto: { fontSize: 15, fontWeight: '700' },
});
