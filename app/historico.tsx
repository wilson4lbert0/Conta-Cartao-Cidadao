import { IconSymbol } from '@/components/ui/icon-symbol';
import { CV } from '@/constants/theme';
import { transacoes } from '@/constants/mock-data';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatarSaldo(valor: number) {
  return valor.toLocaleString('pt-CV', { minimumFractionDigits: 2 });
}

function formatarData(dataStr: string) {
  const d = new Date(dataStr);
  return d.toLocaleDateString('pt-CV', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

const corCategoria = {
  pagamento: CV.azul,
  transferencia: CV.ouro,
  receita_estado: CV.sucesso,
};

const labelCategoria = {
  pagamento: 'Pagamento',
  transferencia: 'Transferência',
  receita_estado: 'Receita do Estado',
};

export default function HistoricoScreen() {
  const insets = useSafeAreaInsets();

  const totalEntradas = transacoes.filter(t => t.tipo === 'entrada').reduce((s, t) => s + t.valor, 0);
  const totalSaidas = transacoes.filter(t => t.tipo === 'saida').reduce((s, t) => s + t.valor, 0);

  return (
    <View style={[estilos.container, { paddingTop: insets.top }]}>
      <View style={estilos.header}>
        <Pressable onPress={() => router.back()} style={estilos.btnVoltar}>
          <IconSymbol name="chevron.left" size={22} color={CV.textoP} />
        </Pressable>
        <Text style={estilos.titulo}>Histórico</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={estilos.resumoRow}>
        <View style={[estilos.resumoCard, { backgroundColor: `${CV.sucesso}12` }]}>
          <Text style={estilos.resumoLabel}>Total Entradas</Text>
          <Text style={[estilos.resumoValor, { color: CV.sucesso }]}>+{formatarSaldo(totalEntradas)}</Text>
        </View>
        <View style={[estilos.resumoCard, { backgroundColor: `${CV.azul}10` }]}>
          <Text style={estilos.resumoLabel}>Total Saídas</Text>
          <Text style={[estilos.resumoValor, { color: CV.azul }]}>-{formatarSaldo(totalSaidas)}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 20 }}
      >
        {transacoes.map(tx => (
          <View key={tx.id} style={estilos.txCard}>
            <View style={[estilos.txIcone, { backgroundColor: `${corCategoria[tx.categoria]}15` }]}>
              <IconSymbol
                name={tx.tipo === 'entrada' ? 'arrow.down.circle.fill' : 'arrow.up.circle.fill'}
                size={24}
                color={corCategoria[tx.categoria]}
              />
            </View>
            <View style={estilos.txInfo}>
              <Text style={estilos.txDesc}>{tx.descricao}</Text>
              <Text style={estilos.txEntidade}>{tx.entidade}</Text>
              <View style={estilos.txMeta}>
                <View style={[estilos.txBadge, { backgroundColor: `${corCategoria[tx.categoria]}12` }]}>
                  <Text style={[estilos.txBadgeTexto, { color: corCategoria[tx.categoria] }]}>
                    {labelCategoria[tx.categoria]}
                  </Text>
                </View>
                <Text style={estilos.txData}>{formatarData(tx.data)} · {tx.hora}</Text>
              </View>
            </View>
            <Text style={[estilos.txValor, { color: tx.tipo === 'entrada' ? CV.sucesso : CV.textoP }]}>
              {tx.tipo === 'entrada' ? '+' : '-'}{formatarSaldo(tx.valor)}{'\n'}
              <Text style={estilos.txMoeda}>ECV</Text>
            </Text>
          </View>
        ))}

        <Text style={estilos.refNote}>Ref: incluída em cada transação para suporte e contestação.</Text>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: CV.fundo },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  btnVoltar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: CV.branco, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  titulo: { color: CV.textoP, fontSize: 20, fontWeight: '800' },
  resumoRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginBottom: 16 },
  resumoCard: {
    flex: 1, borderRadius: 14, padding: 16,
  },
  resumoLabel: { color: CV.textoS, fontSize: 12, marginBottom: 4 },
  resumoValor: { fontSize: 16, fontWeight: '800' },
  txCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: CV.branco, borderRadius: 16, padding: 16,
    marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  txIcone: { width: 48, height: 48, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1 },
  txDesc: { color: CV.textoP, fontSize: 14, fontWeight: '700' },
  txEntidade: { color: CV.textoS, fontSize: 12, marginTop: 2 },
  txMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  txBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  txBadgeTexto: { fontSize: 11, fontWeight: '700' },
  txData: { color: CV.textoS, fontSize: 11 },
  txValor: { fontSize: 14, fontWeight: '800', textAlign: 'right' },
  txMoeda: { fontSize: 11, fontWeight: '400', color: CV.textoS },
  refNote: { color: CV.textoS, fontSize: 11, textAlign: 'center', marginTop: 8, marginBottom: 8 },
});
