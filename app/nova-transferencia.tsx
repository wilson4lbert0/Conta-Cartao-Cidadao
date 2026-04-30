import { IconSymbol } from '@/components/ui/icon-symbol';
import { CV } from '@/constants/theme';
import { conta } from '@/constants/mock-data';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Metodo = 'nib' | 'telemovel';

const atalhos = [500, 1000, 5000, 10000];

function formatarECV(valor: number) {
  return valor.toLocaleString('pt-CV', { minimumFractionDigits: 2 });
}

function formatarAtalho(valor: number) {
  if (valor >= 1000) return `${(valor / 1000).toLocaleString('pt-CV')}.${'000'} ECV`;
  return `${valor} ECV`;
}

const metodos = [
  { id: 'telemovel' as Metodo, label: 'Via Telemóvel', icone: 'arrow.up.circle.fill' as const },
  { id: 'nib' as Metodo, label: 'Via NIB', icone: 'creditcard.fill' as const },
];

const config: Record<Metodo, { label: string; placeholder: string; teclado: 'default' | 'phone-pad'; minLen: number }> = {
  nib: {
    label: 'NIB do destinatário',
    placeholder: 'Ex: 0001 0023 4567 8901 2345 678',
    teclado: 'default',
    minLen: 21,
  },
  telemovel: {
    label: 'Número de telemóvel',
    placeholder: 'Ex: 991 23 45',
    teclado: 'phone-pad',
    minLen: 7,
  },
};

export default function NovaTransferenciaScreen() {
  const insets = useSafeAreaInsets();
  const [metodo, setMetodo] = useState<Metodo>('telemovel');
  const [destino, setDestino] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [passo, setPasso] = useState<'form' | 'confirmar'>('form');

  const valorNum = parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
  const destinoValido = destino.replace(/\s/g, '').length >= config[metodo].minLen;
  const valido = destinoValido && valorNum > 0 && valorNum <= conta.saldo;

  function aoMudarMetodo(m: Metodo) {
    setMetodo(m);
    setDestino('');
  }

  function confirmar() {
    Alert.alert(
      'Transferência Enviada',
      `${formatarECV(valorNum)} ECV enviados com sucesso.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  }

  const labelDestino = metodo === 'nib' ? `NIB ${destino}` : `+238 ${destino}`;

  // ─── Ecrã de confirmação ───────────────────────────────────────────────────
  if (passo === 'confirmar') {
    return (
      <View style={[estilos.container, { paddingTop: insets.top }]}>
        <View style={estilos.header}>
          <Pressable onPress={() => setPasso('form')} style={estilos.btnVoltar}>
            <IconSymbol name="chevron.left" size={22} color={CV.textoP} />
          </Pressable>
          <Text style={estilos.titulo}>Confirmar</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={estilos.confirmCard}>
          <View style={estilos.confirmIcone}>
            <IconSymbol name="arrow.up.circle.fill" size={40} color={CV.azul} />
          </View>
          <Text style={estilos.confirmValor}>{formatarECV(valorNum)} ECV</Text>
          <Text style={estilos.confirmLabel}>a transferir para</Text>

          <View style={estilos.confirmMetodoBadge}>
            <IconSymbol
              name={metodo === 'nib' ? 'creditcard.fill' : 'arrow.up.circle.fill'}
              size={13}
              color={CV.azul}
            />
            <Text style={estilos.confirmMetodoTexto}>
              {metodo === 'nib' ? 'Via NIB' : 'Via Telemóvel'}
            </Text>
          </View>

          <Text style={estilos.confirmDestino}>{labelDestino}</Text>
          {descricao ? <Text style={estilos.confirmDesc}>"{descricao}"</Text> : null}

          <View style={estilos.confirmDetalhes}>
            <View style={estilos.confirmRow}>
              <Text style={estilos.confirmKey}>Saldo após</Text>
              <Text style={estilos.confirmValue}>{formatarECV(conta.saldo - valorNum)} ECV</Text>
            </View>
            <View style={estilos.confirmRow}>
              <Text style={estilos.confirmKey}>Taxa</Text>
              <Text style={[estilos.confirmValue, { color: CV.sucesso }]}>Gratuita</Text>
            </View>
          </View>
        </View>

        <View style={estilos.chaveInfo}>
          <IconSymbol name="shield.fill" size={16} color={CV.ouro} />
          <Text style={estilos.chaveInfoTexto}>Será confirmado com a sua Chave Digital</Text>
        </View>

        <View style={[estilos.acoes, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable style={estilos.btnCancelar} onPress={() => setPasso('form')}>
            <Text style={estilos.btnCancelarTexto}>Cancelar</Text>
          </Pressable>
          <Pressable style={estilos.btnConfirmar} onPress={confirmar}>
            <Text style={estilos.btnConfirmarTexto}>Confirmar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ─── Formulário ───────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[estilos.headerWrap, { paddingTop: insets.top }]}>
        <View style={estilos.header}>
          <Pressable onPress={() => router.back()} style={estilos.btnVoltar}>
            <IconSymbol name="chevron.left" size={22} color={CV.textoP} />
          </Pressable>
          <Text style={estilos.titulo}>Nova Transferência</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Saldo disponível */}
        <View style={estilos.saldoDisp}>
          <Text style={estilos.saldoDispLabel}>Saldo disponível</Text>
          <Text style={estilos.saldoDispValor}>{formatarECV(conta.saldo)} ECV</Text>
        </View>

        <View style={estilos.formContainer}>
          {/* Seletor de método */}
          <Text style={estilos.label}>Método de transferência</Text>
          <View style={estilos.seletorMetodo}>
            {metodos.map(m => (
              <Pressable
                key={m.id}
                style={[estilos.metodoBtn, metodo === m.id && estilos.metodoBtnAtivo]}
                onPress={() => aoMudarMetodo(m.id)}
              >
                <IconSymbol
                  name={m.icone}
                  size={16}
                  color={metodo === m.id ? CV.branco : CV.textoS}
                />
                <Text style={[estilos.metodoTexto, metodo === m.id && estilos.metodoTextoAtivo]}>
                  {m.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Campo de destino */}
          <Text style={[estilos.label, { marginTop: 20 }]}>{config[metodo].label}</Text>
          {metodo === 'telemovel' && (
            <View style={estilos.prefijoRow}>
              <View style={estilos.prefijoBox}>
                <Text style={estilos.prefijoTexto}>🇨🇻 +238</Text>
              </View>
              <TextInput
                style={[estilos.input, estilos.inputTelemovel]}
                placeholder={config[metodo].placeholder}
                placeholderTextColor={CV.textoS}
                value={destino}
                onChangeText={setDestino}
                keyboardType={config[metodo].teclado}
                maxLength={10}
              />
            </View>
          )}
          {metodo === 'nib' && (
            <TextInput
              style={estilos.input}
              placeholder={config[metodo].placeholder}
              placeholderTextColor={CV.textoS}
              value={destino}
              onChangeText={setDestino}
              keyboardType="number-pad"
              maxLength={27}
            />
          )}

          {/* Valor */}
          <Text style={[estilos.label, { marginTop: 20 }]}>Valor em Escudos (ECV)</Text>
          <View style={estilos.inputValorWrapper}>
            <Text style={estilos.inputValorSimbolo}>ECV</Text>
            <TextInput
              style={estilos.inputValor}
              placeholder="0,00"
              placeholderTextColor={CV.textoS}
              value={valor}
              onChangeText={setValor}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Atalhos de valor em escudos */}
          <View style={estilos.atalhos}>
            {atalhos.map(a => (
              <Pressable
                key={a}
                style={({ pressed }) => [
                  estilos.atalhoBtn,
                  valor === String(a) && estilos.atalhoBtnAtivo,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => setValor(String(a))}
              >
                <Text style={[estilos.atalhoTexto, valor === String(a) && estilos.atalhoTextoAtivo]}>
                  {formatarAtalho(a)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Descrição */}
          <Text style={[estilos.label, { marginTop: 20 }]}>Descrição (opcional)</Text>
          <TextInput
            style={estilos.input}
            placeholder="Para que serve esta transferência?"
            placeholderTextColor={CV.textoS}
            value={descricao}
            onChangeText={setDescricao}
            maxLength={80}
          />

          {valorNum > conta.saldo && (
            <View style={estilos.erroCard}>
              <IconSymbol name="exclamationmark.triangle.fill" size={16} color={CV.vermelho} />
              <Text style={estilos.erroTexto}>Saldo insuficiente</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[estilos.rodape, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[estilos.btnEnviar, !valido && estilos.btnEnviarDesativo]}
          onPress={() => valido && setPasso('confirmar')}
          disabled={!valido}
        >
          <Text style={estilos.btnEnviarTexto}>Continuar</Text>
          <IconSymbol name="chevron.right" size={18} color={CV.branco} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: CV.fundo },
  headerWrap: { backgroundColor: CV.fundo },
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
  saldoDisp: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: CV.azul, marginHorizontal: 16, borderRadius: 14,
    paddingHorizontal: 18, paddingVertical: 14, marginBottom: 20,
  },
  saldoDispLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  saldoDispValor: { color: CV.branco, fontSize: 16, fontWeight: '800' },
  formContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  label: { color: CV.textoS, fontSize: 13, fontWeight: '600', marginBottom: 8 },

  // Seletor de método
  seletorMetodo: {
    flexDirection: 'row',
    backgroundColor: CV.branco,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: CV.borda,
  },
  metodoBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: 11,
  },
  metodoBtnAtivo: { backgroundColor: CV.azul },
  metodoTexto: { color: CV.textoS, fontSize: 13, fontWeight: '700' },
  metodoTextoAtivo: { color: CV.branco },

  // Campo telemóvel com prefixo
  prefijoRow: { flexDirection: 'row', gap: 8 },
  prefijoBox: {
    backgroundColor: CV.branco, borderRadius: 14, paddingHorizontal: 14,
    justifyContent: 'center', borderWidth: 1, borderColor: CV.borda,
  },
  prefijoTexto: { color: CV.textoP, fontSize: 14, fontWeight: '600' },
  inputTelemovel: { flex: 1 },

  input: {
    backgroundColor: CV.branco, borderRadius: 14, padding: 16,
    color: CV.textoP, fontSize: 15,
    borderWidth: 1, borderColor: CV.borda,
  },

  // Campo de valor com "ECV" inline
  inputValorWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: CV.branco, borderRadius: 14,
    borderWidth: 1, borderColor: CV.borda, overflow: 'hidden',
  },
  inputValorSimbolo: {
    paddingHorizontal: 16, paddingVertical: 20,
    color: CV.azul, fontSize: 15, fontWeight: '800',
    borderRightWidth: 1, borderRightColor: CV.borda,
    backgroundColor: `${CV.azul}08`,
  },
  inputValor: {
    flex: 1, paddingHorizontal: 16,
    color: CV.textoP, fontSize: 26, fontWeight: '800', textAlign: 'center',
    height: 72,
  },

  // Atalhos
  atalhos: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  atalhoBtn: {
    flex: 1, minWidth: '22%',
    backgroundColor: `${CV.azul}10`, borderRadius: 10,
    paddingVertical: 9, alignItems: 'center',
    borderWidth: 1, borderColor: 'transparent',
  },
  atalhoBtnAtivo: {
    backgroundColor: CV.azul, borderColor: CV.azul,
  },
  atalhoTexto: { color: CV.azul, fontSize: 11, fontWeight: '700' },
  atalhoTextoAtivo: { color: CV.branco },

  erroCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: `${CV.vermelho}10`, borderRadius: 10,
    padding: 12, marginTop: 12,
  },
  erroTexto: { color: CV.vermelho, fontSize: 13, fontWeight: '600' },
  rodape: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: CV.fundo },
  btnEnviar: {
    backgroundColor: CV.azul, borderRadius: 16, padding: 18,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  btnEnviarDesativo: { backgroundColor: CV.borda },
  btnEnviarTexto: { color: CV.branco, fontSize: 16, fontWeight: '800' },

  // Confirmação
  confirmCard: {
    backgroundColor: CV.branco, margin: 16, borderRadius: 24, padding: 28,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  confirmIcone: {
    width: 72, height: 72, borderRadius: 24, backgroundColor: `${CV.azul}12`,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  confirmValor: { color: CV.textoP, fontSize: 32, fontWeight: '900' },
  confirmLabel: { color: CV.textoS, fontSize: 14, marginTop: 4 },
  confirmMetodoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: `${CV.azul}12`, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, marginTop: 12,
  },
  confirmMetodoTexto: { color: CV.azul, fontSize: 12, fontWeight: '700' },
  confirmDestino: { color: CV.textoP, fontSize: 16, fontWeight: '700', marginTop: 8 },
  confirmDesc: { color: CV.textoS, fontSize: 13, fontStyle: 'italic', marginTop: 8 },
  confirmDetalhes: { width: '100%', marginTop: 24, gap: 12 },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmKey: { color: CV.textoS, fontSize: 14 },
  confirmValue: { color: CV.textoP, fontSize: 14, fontWeight: '700' },
  chaveInfo: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: `${CV.ouro}12`, marginHorizontal: 16, borderRadius: 12, padding: 12,
  },
  chaveInfoTexto: { color: CV.textoP, fontSize: 13, fontWeight: '600' },
  acoes: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 16 },
  btnCancelar: {
    flex: 1, padding: 16, borderRadius: 14, backgroundColor: CV.borda, alignItems: 'center',
  },
  btnCancelarTexto: { color: CV.textoP, fontSize: 15, fontWeight: '700' },
  btnConfirmar: {
    flex: 2, padding: 16, borderRadius: 14, backgroundColor: CV.azul, alignItems: 'center',
  },
  btnConfirmarTexto: { color: CV.branco, fontSize: 15, fontWeight: '800' },
});
