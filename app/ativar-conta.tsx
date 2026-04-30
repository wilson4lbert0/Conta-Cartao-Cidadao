import { IconSymbol } from '@/components/ui/icon-symbol';
import { CartaoDigital } from '@/components/cartao-digital';
import { CV } from '@/constants/theme';
import { conta, utilizador } from '@/constants/mock-data';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const beneficios = [
  { icone: 'arrow.left.arrow.right' as const, titulo: 'Transferências Gratuitas', desc: 'Entre contas Gov sem custo' },
  { icone: 'doc.text.fill' as const, titulo: 'Pagar Serviços do Estado', desc: 'Impostos, taxas, multas e mais' },
  { icone: 'arrow.down.circle.fill' as const, titulo: 'Receber do Estado', desc: 'Subsídios, reembolsos e benefícios' },
  { icone: 'shield.fill' as const, titulo: 'Segurança Garantida', desc: 'Protegida pela sua Chave Digital' },
];

export default function AtivarContaScreen() {
  const insets = useSafeAreaInsets();
  const [passo, setPasso] = useState<'intro' | 'sucesso'>(
    // Em produção, verificar se conta já existe
    'intro'
  );

  if (passo === 'sucesso') {
    return (
      <View style={[estilos.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}>
        <View style={estilos.successIcone}>
          <IconSymbol name="checkmark.circle.fill" size={64} color={CV.sucesso} />
        </View>
        <Text style={estilos.successTitulo}>Conta Criada!</Text>
        <Text style={estilos.successDesc}>
          A sua Conta Digital Gov está ativa. O cartão já pode ser utilizado.
        </Text>

        <CartaoDigital
          numero={conta.cartao.numero}
          titular={conta.cartao.titular}
          validade={conta.cartao.validade}
          ativo={conta.cartao.ativo}
        />

        <View style={estilos.successDetalhes}>
          <View style={estilos.successRow}>
            <Text style={estilos.successKey}>IBAN</Text>
            <Text style={estilos.successVal}>{conta.iban.slice(0, 18)}…</Text>
          </View>
          <View style={estilos.successRow}>
            <Text style={estilos.successKey}>Titular</Text>
            <Text style={estilos.successVal}>{utilizador.nome}</Text>
          </View>
          <View style={estilos.successRow}>
            <Text style={estilos.successKey}>Estado</Text>
            <View style={estilos.dotRow}>
              <View style={[estilos.dot, { backgroundColor: CV.sucesso }]} />
              <Text style={[estilos.successVal, { color: CV.sucesso }]}>Ativa</Text>
            </View>
          </View>
        </View>

        <Pressable style={[estilos.btnPrimario, { marginHorizontal: 24, marginTop: 'auto' }]} onPress={() => router.replace('/(tabs)')}>
          <Text style={estilos.btnPrimarioTexto}>Ir para o Início</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[estilos.container, { paddingTop: insets.top }]}>
      <View style={estilos.header}>
        <Pressable onPress={() => router.back()} style={estilos.btnFechar}>
          <IconSymbol name="xmark.circle.fill" size={28} color={CV.textoS} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View style={estilos.heroBadge}>
          <IconSymbol name="creditcard.fill" size={14} color={CV.branco} />
          <Text style={estilos.heroBadgeTexto}>Conta Digital Gov</Text>
        </View>

        <Text style={estilos.heroTitulo}>A sua identidade{'\n'}também é a sua conta</Text>
        <Text style={estilos.heroDesc}>
          Com a Chave Digital ativada, pode criar a sua Conta Digital Gov — uma conta associada ao seu NBI para usar serviços financeiros do Estado.
        </Text>

        <View style={estilos.beneficiosList}>
          {beneficios.map(b => (
            <View key={b.titulo} style={estilos.beneficioItem}>
              <View style={estilos.beneficioIcone}>
                <IconSymbol name={b.icone} size={22} color={CV.azul} />
              </View>
              <View style={estilos.beneficioTextos}>
                <Text style={estilos.beneficioTitulo}>{b.titulo}</Text>
                <Text style={estilos.beneficioDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={estilos.termos}>
          <IconSymbol name="doc.text.fill" size={14} color={CV.textoS} />
          <Text style={estilos.termosTexto}>
            Ao ativar, aceita os{' '}
            <Text style={{ color: CV.azul, fontWeight: '700' }}>Termos e Condições</Text>
            {' '}da Conta Digital Gov e a{' '}
            <Text style={{ color: CV.azul, fontWeight: '700' }}>Política de Privacidade</Text>
            {' '}do Estado de Cabo Verde.
          </Text>
        </View>
      </ScrollView>

      <View style={[estilos.rodape, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={estilos.btnPrimario} onPress={() => setPasso('sucesso')}>
          <IconSymbol name="checkmark.circle.fill" size={20} color={CV.branco} />
          <Text style={estilos.btnPrimarioTexto}>Ativar Conta Gratuitamente</Text>
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <Text style={estilos.btnSecundario}>Fazer mais tarde</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: CV.branco },
  header: { paddingHorizontal: 20, paddingTop: 8, alignItems: 'flex-end' },
  btnFechar: { padding: 4 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: CV.azul, alignSelf: 'flex-start',
    marginHorizontal: 24, marginTop: 8,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  heroBadgeTexto: { color: CV.branco, fontSize: 12, fontWeight: '700' },
  heroTitulo: {
    color: CV.textoP, fontSize: 30, fontWeight: '900', lineHeight: 36,
    marginHorizontal: 24, marginTop: 16,
  },
  heroDesc: {
    color: CV.textoS, fontSize: 15, lineHeight: 22,
    marginHorizontal: 24, marginTop: 12, marginBottom: 28,
  },
  beneficiosList: { paddingHorizontal: 24, gap: 4 },
  beneficioItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: CV.borda,
  },
  beneficioIcone: {
    width: 48, height: 48, borderRadius: 15,
    backgroundColor: `${CV.azul}12`, justifyContent: 'center', alignItems: 'center',
  },
  beneficioTextos: { flex: 1 },
  beneficioTitulo: { color: CV.textoP, fontSize: 15, fontWeight: '700' },
  beneficioDesc: { color: CV.textoS, fontSize: 13, marginTop: 2 },
  termos: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    marginHorizontal: 24, marginTop: 24,
    backgroundColor: CV.fundo, borderRadius: 12, padding: 14,
  },
  termosTexto: { flex: 1, color: CV.textoS, fontSize: 12, lineHeight: 18 },
  rodape: {
    paddingHorizontal: 24, paddingTop: 16, gap: 12,
    backgroundColor: CV.branco, borderTopWidth: 1, borderTopColor: CV.borda,
  },
  btnPrimario: {
    backgroundColor: CV.azul, borderRadius: 16, padding: 18,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  btnPrimarioTexto: { color: CV.branco, fontSize: 16, fontWeight: '800' },
  btnSecundario: { color: CV.textoS, fontSize: 14, textAlign: 'center', paddingVertical: 4 },
  successIcone: { alignItems: 'center', marginTop: 20, marginBottom: 16 },
  successTitulo: { color: CV.textoP, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  successDesc: { color: CV.textoS, fontSize: 15, textAlign: 'center', marginHorizontal: 32, marginTop: 8, marginBottom: 24, lineHeight: 22 },
  successDetalhes: {
    backgroundColor: CV.fundo, marginHorizontal: 24, borderRadius: 16,
    padding: 20, marginTop: 20, gap: 14,
  },
  successRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  successKey: { color: CV.textoS, fontSize: 13 },
  successVal: { color: CV.textoP, fontSize: 14, fontWeight: '700' },
  dotRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
