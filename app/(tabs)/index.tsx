import { IconSymbol } from '@/components/ui/icon-symbol';
import { CartaoDigital } from '@/components/cartao-digital';
import { CV } from '@/constants/theme';
import { conta, transacoes, utilizador } from '@/constants/mock-data';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatarSaldo(valor: number) {
  return valor.toLocaleString('pt-CV', { minimumFractionDigits: 2 });
}

function formatarData(dataStr: string) {
  const d = new Date(dataStr);
  return d.toLocaleDateString('pt-CV', { day: '2-digit', month: 'short' });
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [saldoVisivel, setSaldoVisivel] = useState(true);

  const acoes = [
    { icone: 'arrow.up.circle.fill' as const, label: 'Transferir', cor: CV.azul, onPress: () => router.push('/nova-transferencia') },
    { icone: 'arrow.down.circle.fill' as const, label: 'Receber', cor: CV.sucesso, onPress: () => router.push('/receber') },
    { icone: 'doc.text.fill' as const, label: 'Pagar', cor: CV.vermelho, onPress: () => router.push('/pagar') },
    { icone: 'building.2.fill' as const, label: 'Associar', cor: CV.ouro, onPress: () => router.push('/contas') },
  ];

  return (
    <View style={estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor={CV.azul} />

      <View style={[estilos.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={estilos.saudacao}>Olá, {utilizador.nome.split(' ')[0]}</Text>
          <View style={estilos.chaveRow}>
            <IconSymbol name="shield.fill" size={12} color={CV.ouro} />
            <Text style={estilos.chaveLabel}>Chave Digital Ativa</Text>
          </View>
        </View>
        <Pressable style={estilos.btnNotif} onPress={() => router.push('/notificacoes')}>
          <IconSymbol name="bell.fill" size={20} color={CV.branco} />
          <View style={estilos.badgeNotif}>
            <Text style={estilos.badgeNotifTexto}>2</Text>
          </View>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <View style={estilos.saldoContainer}>
          <Text style={estilos.saldoLabel}>Saldo Disponível</Text>
          <View style={estilos.saldoRow}>
            <Text style={estilos.saldoValor}>
              {saldoVisivel ? `${formatarSaldo(conta.saldo)} ECV` : '•••••• ECV'}
            </Text>
            <Pressable onPress={() => setSaldoVisivel(v => !v)} style={estilos.olhoBtn}>
              <IconSymbol
                name={saldoVisivel ? 'eye.fill' : 'eye.slash.fill'}
                size={18}
                color="rgba(255,255,255,0.7)"
              />
            </Pressable>
          </View>
        </View>

        <View style={estilos.cartaoWrapper}>
          <CartaoDigital
            numero={conta.cartao.numero}
            titular={conta.cartao.titular}
            validade={conta.cartao.validade}
            ativo={conta.cartao.ativo}
            onPress={() => router.push('/meu-cartao')}
          />
        </View>

        <View style={estilos.acoesContainer}>
          {acoes.map(acao => (
            <Pressable
              key={acao.label}
              style={({ pressed }) => [estilos.acaoBtn, pressed && { opacity: 0.65 }]}
              onPress={acao.onPress}
            >
              <View style={[estilos.acaoIcone, { backgroundColor: `${acao.cor}18` }]}>
                <IconSymbol name={acao.icone} size={24} color={acao.cor} />
              </View>
              <Text style={[estilos.acaoLabel, { color: acao.cor === CV.vermelho || acao.cor === CV.sucesso ? acao.cor : CV.textoP }]}>
                {acao.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={estilos.secao}>
          <View style={estilos.secaoHeader}>
            <Text style={estilos.secaoTitulo}>Últimas Transações</Text>
            <Pressable onPress={() => router.push('/historico')}>
              <Text style={estilos.verTudo}>Ver tudo</Text>
            </Pressable>
          </View>

          {transacoes.slice(0, 4).map(tx => (
            <View key={tx.id} style={estilos.txItem}>
              <View style={[
                estilos.txIcone,
                { backgroundColor: tx.tipo === 'entrada' ? `${CV.sucesso}18` : `${CV.azul}12` },
              ]}>
                <IconSymbol
                  name={tx.tipo === 'entrada' ? 'arrow.down.circle.fill' : 'arrow.up.circle.fill'}
                  size={22}
                  color={tx.tipo === 'entrada' ? CV.sucesso : CV.azul}
                />
              </View>
              <View style={estilos.txInfo}>
                <Text style={estilos.txDesc} numberOfLines={1}>{tx.descricao}</Text>
                <Text style={estilos.txData}>{tx.entidade} · {formatarData(tx.data)}</Text>
              </View>
              <Text style={[estilos.txValor, { color: tx.tipo === 'entrada' ? CV.sucesso : CV.textoP }]}>
                {tx.tipo === 'entrada' ? '+' : '-'}{formatarSaldo(tx.valor)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: CV.fundo },
  header: {
    backgroundColor: CV.azul,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  saudacao: { color: CV.branco, fontSize: 22, fontWeight: '700' },
  chaveRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  chaveLabel: { color: CV.ouro, fontSize: 11, fontWeight: '600' },
  btnNotif: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  badgeNotif: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: CV.vermelho,
    width: 16, height: 16, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: CV.azul,
  },
  badgeNotifTexto: { color: CV.branco, fontSize: 9, fontWeight: '800' },
  saldoContainer: { backgroundColor: CV.azul, paddingHorizontal: 20, paddingBottom: 30 },
  saldoLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  saldoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  saldoValor: { color: CV.branco, fontSize: 28, fontWeight: '800' },
  olhoBtn: { padding: 4 },
  cartaoWrapper: { marginTop: -16 },
  acoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: CV.branco,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  acaoBtn: { alignItems: 'center', gap: 8 },
  acaoIcone: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  acaoLabel: { fontSize: 12, fontWeight: '600' },
  secao: {
    backgroundColor: CV.branco,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  secaoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  secaoTitulo: { color: CV.textoP, fontSize: 16, fontWeight: '700' },
  verTudo: { color: CV.azul, fontSize: 13, fontWeight: '600' },
  txItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  txIcone: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1 },
  txDesc: { color: CV.textoP, fontSize: 14, fontWeight: '600' },
  txData: { color: CV.textoS, fontSize: 12, marginTop: 2 },
  txValor: { fontSize: 14, fontWeight: '700' },
});
