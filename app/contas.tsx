import { IconSymbol } from '@/components/ui/icon-symbol';
import { CV } from '@/constants/theme';
import { bancosDisponiveis, contasAssociadas } from '@/constants/mock-data';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ContaAssociada = typeof contasAssociadas[number];
type Modo = 'lista' | 'associar';

export default function ContasScreen() {
  const insets = useSafeAreaInsets();
  const [modo, setModo] = useState<Modo>('lista');
  const [contas, setContas] = useState<ContaAssociada[]>(contasAssociadas);
  const [bancoSelecionado, setBancoSelecionado] = useState<typeof bancosDisponiveis[number] | null>(null);

  const titulo = modo === 'associar' ? 'Associar Conta' : 'Contas Associadas';

  function confirmarAssociacao() {
    if (!bancoSelecionado) return;
    Alert.alert(
      'Conta Associada',
      `A conta ${bancoSelecionado.sigla} foi associada com sucesso à sua Conta Digital Gov.`,
      [{
        text: 'OK', onPress: () => {
          setContas(prev => [...prev, {
            id: Date.now().toString(),
            sigla: bancoSelecionado.sigla,
            nomeBanco: bancoSelecionado.nome,
            nib: '',
            nibMascarado: '•••• •••• •••• ••••',
            cor: bancoSelecionado.cor,
          }]);
          setBancoSelecionado(null);
          setModo('lista');
        },
      }],
    );
  }

  function removerConta(id: string, sigla: string) {
    Alert.alert(
      'Remover Conta',
      `Deseja remover a conta ${sigla} da lista de contas associadas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => setContas(prev => prev.filter(c => c.id !== id)) },
      ]
    );
  }

  return (
    <View style={[estilos.container, { paddingTop: insets.top }]}>
      <View style={estilos.header}>
        <Pressable
          onPress={() => modo === 'lista' ? router.back() : setModo('lista')}
          style={estilos.btnVoltar}
        >
          <IconSymbol name="chevron.left" size={22} color={CV.textoP} />
        </Pressable>
        <Text style={estilos.titulo}>{titulo}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Lista */}
      {modo === 'lista' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingHorizontal: 16 }}
        >
          {contas.length === 0 ? (
            <View style={estilos.vazio}>
              <View style={estilos.vazioIcone}>
                <IconSymbol name="building.2.fill" size={32} color={CV.borda} />
              </View>
              <Text style={estilos.vazioTitulo}>Nenhuma conta associada</Text>
              <Text style={estilos.vazioDesc}>Associe uma conta bancária para facilitar os seus pagamentos.</Text>
            </View>
          ) : (
            <>
              <Text style={estilos.secaoLabel}>Bancos Associados</Text>
              {contas.map(c => (
                <View key={c.id} style={estilos.contaCard}>
                  <View style={[estilos.bancoSiglaBox, { backgroundColor: `${c.cor}18` }]}>
                    <Text style={[estilos.bancoSigla, { color: c.cor }]}>{c.sigla}</Text>
                  </View>
                  <View style={estilos.contaInfo}>
                    <Text style={estilos.contaBancoNome}>{c.nomeBanco}</Text>
                    <View style={estilos.associadoBadge}>
                      <View style={[estilos.dot, { backgroundColor: CV.sucesso }]} />
                      <Text style={estilos.associadoTexto}>Associado</Text>
                    </View>
                  </View>
                  <Pressable
                    style={({ pressed }) => [estilos.btnRemover, pressed && { opacity: 0.7 }]}
                    onPress={() => removerConta(c.id, c.sigla)}
                  >
                    <IconSymbol name="xmark.circle.fill" size={20} color={CV.vermelho} />
                  </Pressable>
                </View>
              ))}
            </>
          )}

          <Pressable
            style={({ pressed }) => [estilos.btnAssociar, pressed && { opacity: 0.85 }]}
            onPress={() => { setBancoSelecionado(null); setModo('associar'); }}
          >
            <IconSymbol name="plus" size={20} color={CV.branco} />
            <Text style={estilos.btnAssociarTexto}>Associar Nova Conta Bancária</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* Associar */}
      {modo === 'associar' && (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={estilos.associarContainer}
        >
          <Text style={estilos.secaoTitulo}>Selecione o Banco</Text>
          <View style={estilos.bancosGrid}>
            {bancosDisponiveis.map(b => {
              const ativo = bancoSelecionado?.id === b.id;
              const jaAssociado = contas.some(c => c.sigla === b.sigla);
              return (
                <Pressable
                  key={b.id}
                  style={[
                    estilos.bancoCard,
                    ativo && { borderColor: b.cor, borderWidth: 2, backgroundColor: `${b.cor}08` },
                    jaAssociado && estilos.bancoCardDesativo,
                  ]}
                  onPress={() => !jaAssociado && setBancoSelecionado(b)}
                  disabled={jaAssociado}
                >
                  <View style={[estilos.bancoSiglaBoxGrande, { backgroundColor: `${b.cor}18` }]}>
                    <Text style={[estilos.bancoSiglaGrande, { color: jaAssociado ? CV.textoS : b.cor }]}>{b.sigla}</Text>
                  </View>
                  <Text style={[estilos.bancoNome, jaAssociado && { color: CV.textoS }]} numberOfLines={2}>
                    {b.nome}
                  </Text>
                  {jaAssociado && <Text style={estilos.jaAssociadoTexto}>Já associado</Text>}
                  {ativo && !jaAssociado && (
                    <View style={[estilos.bancoCheck, { backgroundColor: b.cor }]}>
                      <IconSymbol name="checkmark.circle.fill" size={14} color="#fff" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={[estilos.btnConfirmar, !bancoSelecionado && estilos.btnConfirmarDesativo]}
            onPress={() => bancoSelecionado && confirmarAssociacao()}
            disabled={!bancoSelecionado}
          >
            <IconSymbol name="checkmark.circle.fill" size={20} color={CV.branco} />
            <Text style={estilos.btnConfirmarTexto}>Associar Conta</Text>
          </Pressable>
        </ScrollView>
      )}
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
    width: 40, height: 40, borderRadius: 20, backgroundColor: CV.branco,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  titulo: { color: CV.textoP, fontSize: 20, fontWeight: '800' },

  secaoLabel: {
    color: CV.textoS, fontSize: 12, fontWeight: '700',
    letterSpacing: 0.5, textTransform: 'uppercase',
    marginTop: 16, marginBottom: 10,
  },

  contaCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CV.branco, borderRadius: 16, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  bancoSiglaBox: {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  bancoSigla: { fontSize: 13, fontWeight: '900' },
  contaInfo: { flex: 1 },
  contaBancoNome: { color: CV.textoP, fontSize: 14, fontWeight: '700' },
  associadoBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  associadoTexto: { color: CV.sucesso, fontSize: 11, fontWeight: '600' },
  btnRemover: { padding: 4 },

  vazio: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  vazioIcone: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: CV.branco, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  vazioTitulo: { color: CV.textoP, fontSize: 16, fontWeight: '800' },
  vazioDesc: { color: CV.textoS, fontSize: 13, textAlign: 'center', lineHeight: 20 },

  btnAssociar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: CV.azul, borderRadius: 16,
    padding: 18, marginTop: 16,
    shadowColor: CV.azul, shadowOpacity: 0.3, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  btnAssociarTexto: { color: CV.branco, fontSize: 15, fontWeight: '800' },

  associarContainer: { padding: 16, paddingBottom: 40 },
  secaoTitulo: { color: CV.textoP, fontSize: 15, fontWeight: '700', marginBottom: 16 },
  bancosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bancoCard: {
    width: '47%', backgroundColor: CV.branco, borderRadius: 14,
    padding: 14, alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderColor: CV.borda,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
    position: 'relative',
  },
  bancoCardDesativo: { opacity: 0.5 },
  bancoSiglaBoxGrande: {
    width: 52, height: 52, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  bancoSiglaGrande: { fontSize: 16, fontWeight: '900' },
  bancoNome: { color: CV.textoS, fontSize: 11, textAlign: 'center', lineHeight: 15 },
  jaAssociadoTexto: { color: CV.textoS, fontSize: 10, fontWeight: '600' },
  bancoCheck: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  btnConfirmar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: CV.azul, borderRadius: 16,
    padding: 18, marginTop: 28,
  },
  btnConfirmarDesativo: { backgroundColor: CV.borda },
  btnConfirmarTexto: { color: CV.branco, fontSize: 16, fontWeight: '800' },
});
