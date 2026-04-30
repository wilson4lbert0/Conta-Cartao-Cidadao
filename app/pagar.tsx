import { IconSymbol } from '@/components/ui/icon-symbol';
import { CV } from '@/constants/theme';
import { servicosEstado } from '@/constants/mock-data';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Modo = 'menu' | 'scanner' | 'referencia' | 'nfc';

function formatarECV(valor: number) {
  return valor.toLocaleString('pt-CV', { minimumFractionDigits: 2 });
}

// ─── Scanner QR ─────────────────────────────────────────────────────────────
function ScannerQR({ onVoltar }: { onVoltar: () => void }) {
  const [permissao, pedirPermissao] = useCameraPermissions();
  const [lido, setLido] = useState(false);

  function aoLerQR(data: string) {
    if (lido) return;
    setLido(true);
    Alert.alert(
      'QR Code Lido',
      `Referência detectada:\n${data}\n\nDeseja prosseguir com o pagamento?`,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => setLido(false) },
        { text: 'Pagar', onPress: () => onVoltar() },
      ]
    );
  }

  if (!permissao) {
    return (
      <View style={estilos.centrado}>
        <Text style={estilos.textoInfo}>A verificar permissões…</Text>
      </View>
    );
  }

  if (!permissao.granted) {
    return (
      <View style={estilos.centrado}>
        <View style={estilos.semPermissaoIcone}>
          <IconSymbol name="qrcode" size={40} color={CV.textoS} />
        </View>
        <Text style={estilos.semPermissaoTitulo}>Câmara necessária</Text>
        <Text style={estilos.semPermissaoDesc}>
          Para ler QR Codes de pagamento, o app precisa de acesso à câmara.
        </Text>
        <Pressable style={estilos.btnPermissao} onPress={pedirPermissao}>
          <Text style={estilos.btnPermissaoTexto}>Permitir acesso à câmara</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={estilos.scannerContainer}>
      <CameraView
        style={estilos.camera}
        facing="back"
        onBarcodeScanned={lido ? undefined : ({ data }) => aoLerQR(data)}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Moldura de mira */}
      <View style={estilos.mira}>
        <View style={[estilos.canto, { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 }]} />
        <View style={[estilos.canto, { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 }]} />
        <View style={[estilos.canto, { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 }]} />
        <View style={[estilos.canto, { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 }]} />
      </View>

      <View style={estilos.scannerRodape}>
        <Text style={estilos.scannerDica}>
          Aponte a câmara para o QR Code do serviço a pagar
        </Text>
      </View>
    </View>
  );
}

// ─── Pagamento por Referência ────────────────────────────────────────────────
function PagarReferencia({ onVoltar }: { onVoltar: () => void }) {
  const [entidade, setEntidade] = useState('');
  const [referencia, setReferencia] = useState('');
  const [valor, setValor] = useState('');

  const valido = entidade.length >= 3 && referencia.length >= 6 && parseFloat(valor) > 0;

  function confirmar() {
    Alert.alert(
      'Pagamento Confirmado',
      `Referência ${referencia} — ${formatarECV(parseFloat(valor))} ECV pagos com sucesso.`,
      [{ text: 'OK', onPress: onVoltar }]
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={estilos.refContainer}
    >
      <Text style={estilos.label}>Entidade</Text>
      <TextInput
        style={estilos.input}
        placeholder="Ex: 21900 (DGCI)"
        placeholderTextColor={CV.textoS}
        value={entidade}
        onChangeText={setEntidade}
        keyboardType="number-pad"
        maxLength={5}
      />

      <Text style={[estilos.label, { marginTop: 16 }]}>Referência</Text>
      <TextInput
        style={estilos.input}
        placeholder="Ex: 123 456 789"
        placeholderTextColor={CV.textoS}
        value={referencia}
        onChangeText={setReferencia}
        keyboardType="number-pad"
        maxLength={12}
      />

      <Text style={[estilos.label, { marginTop: 16 }]}>Valor (ECV)</Text>
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

      <Pressable
        style={[estilos.btnPagar, !valido && estilos.btnPagarDesativo]}
        onPress={() => valido && confirmar()}
        disabled={!valido}
      >
        <IconSymbol name="checkmark.circle.fill" size={20} color={CV.branco} />
        <Text style={estilos.btnPagarTexto}>Pagar Agora</Text>
      </Pressable>
    </ScrollView>
  );
}

// ─── Pagamento NFC ───────────────────────────────────────────────────────────
function PagarNFC({ onVoltar }: { onVoltar: () => void }) {
  const [lido, setLido] = useState(false);

  function simularLeitura() {
    setLido(true);
    Alert.alert(
      'Terminal Detetado',
      'Dispositivo NFC identificado. Deseja autorizar o pagamento?',
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => setLido(false) },
        {
          text: 'Autorizar', onPress: () => {
            Alert.alert('Pagamento Aprovado', 'O pagamento por NFC foi concluído com sucesso.', [
              { text: 'OK', onPress: onVoltar },
            ]);
          },
        },
      ]
    );
  }

  return (
    <View style={estilos.nfcContainer}>
      <View style={estilos.nfcOndas}>
        <View style={[estilos.nfcCirculo, { width: 220, height: 220, opacity: 0.08 }]} />
        <View style={[estilos.nfcCirculo, { width: 160, height: 160, opacity: 0.13 }]} />
        <View style={[estilos.nfcCirculo, { width: 100, height: 100, opacity: 0.2 }]} />
        <View style={estilos.nfcIconeBox}>
          <IconSymbol name="antenna.radiowaves.left.and.right" size={36} color={CV.azul} />
        </View>
      </View>
      <Text style={estilos.nfcTitulo}>Pronto para NFC</Text>
      <Text style={estilos.nfcDesc}>
        Aproxime o seu dispositivo ou cartão do terminal de pagamento.
      </Text>
      <Pressable
        style={({ pressed }) => [estilos.btnNfcSimular, pressed && { opacity: 0.8 }]}
        onPress={simularLeitura}
      >
        <Text style={estilos.btnNfcSimularTexto}>Simular leitura NFC</Text>
      </Pressable>
    </View>
  );
}

// ─── Tela principal ──────────────────────────────────────────────────────────
export default function PagarScreen() {
  const insets = useSafeAreaInsets();
  const [modo, setModo] = useState<Modo>('menu');

  const titulo = 'Pagar';

  return (
    <View style={[estilos.container, { paddingTop: insets.top }]}>
      <View style={estilos.header}>
        <Pressable
          onPress={() => modo === 'menu' ? router.back() : setModo('menu')}
          style={estilos.btnVoltar}
        >
          <IconSymbol name="chevron.left" size={22} color={CV.textoP} />
        </Pressable>
        <Text style={estilos.titulo}>{titulo}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Menu principal */}
      {modo === 'menu' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          {/* Opções de entrada */}
          <View style={estilos.opcoesEntrada}>
            <Pressable
              style={({ pressed }) => [estilos.opcaoCard, estilos.opcaoQR, pressed && { opacity: 0.85 }]}
              onPress={() => setModo('scanner')}
            >
              <View style={estilos.opcaoIconeGrande}>
                <IconSymbol name="qrcode" size={28} color={CV.branco} />
              </View>
              <Text style={estilos.opcaoTituloQR}>Ler QR Code</Text>
              <Text style={estilos.opcaoDescQR}>Aponte a câmara para o código</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [estilos.opcaoCard, estilos.opcaoRef, pressed && { opacity: 0.85 }]}
              onPress={() => setModo('referencia')}
            >
              <View style={[estilos.opcaoIconeGrande, { backgroundColor: `${CV.azul}18` }]}>
                <IconSymbol name="doc.text.fill" size={24} color={CV.azul} />
              </View>
              <Text style={estilos.opcaoTituloRef}>Pagamentos Serviços</Text>
              <Text style={estilos.opcaoDescRef}>Insira entidade, referência e valor</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [estilos.opcaoCard, estilos.opcaoNFC, pressed && { opacity: 0.85 }]}
              onPress={() => setModo('nfc')}
            >
              <View style={[estilos.opcaoIconeGrande, { backgroundColor: `${CV.ouro}18` }]}>
                <IconSymbol name="antenna.radiowaves.left.and.right" size={24} color={CV.ouro} />
              </View>
              <Text style={estilos.opcaoTituloNFC}>Pagar NFC</Text>
              <Text style={estilos.opcaoDescNFC}>Aproxime ao terminal de pagamento</Text>
            </Pressable>
          </View>

          {/* Serviços frequentes */}
          <Text style={estilos.secaoTitulo}>Serviços Frequentes</Text>
          {servicosEstado.map(s => (
            <Pressable
              key={s.id}
              style={({ pressed }) => [estilos.servicoCard, pressed && { opacity: 0.75 }]}
            >
              <View style={[estilos.servicoIcone, { backgroundColor: `${s.cor}15` }]}>
                <IconSymbol name={s.icone} size={22} color={s.cor} />
              </View>
              <View style={estilos.servicoInfo}>
                <Text style={estilos.servicoNome}>{s.nome}</Text>
                <Text style={estilos.servicoEntidade}>{s.entidade}</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={CV.textoS} />
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Scanner QR */}
      {modo === 'scanner' && <ScannerQR onVoltar={() => setModo('menu')} />}

      {/* Pagar por referência */}
      {modo === 'referencia' && <PagarReferencia onVoltar={() => setModo('menu')} />}

      {/* Pagar NFC */}
      {modo === 'nfc' && <PagarNFC onVoltar={() => setModo('menu')} />}
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

  // Opções de entrada
  opcoesEntrada: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginBottom: 24 },
  opcaoCard: {
    flex: 1, borderRadius: 16, padding: 12, alignItems: 'center', gap: 6,
  },
  opcaoQR: { backgroundColor: CV.azul },
  opcaoRef: {
    backgroundColor: CV.branco, borderWidth: 1, borderColor: CV.borda,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  opcaoIconeGrande: {
    width: 50, height: 50, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 2,
  },
  opcaoTituloQR: { color: CV.branco, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  opcaoDescQR: { color: 'rgba(255,255,255,0.75)', fontSize: 10, textAlign: 'center', lineHeight: 14 },
  opcaoTituloRef: { color: CV.textoP, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  opcaoDescRef: { color: CV.textoS, fontSize: 10, textAlign: 'center', lineHeight: 14 },

  secaoTitulo: {
    color: CV.textoP, fontSize: 16, fontWeight: '800',
    marginHorizontal: 16, marginBottom: 10,
  },
  servicoCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: CV.branco, borderRadius: 14, padding: 14,
    marginHorizontal: 16, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  servicoIcone: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  servicoInfo: { flex: 1 },
  servicoNome: { color: CV.textoP, fontSize: 13, fontWeight: '700' },
  servicoEntidade: { color: CV.textoS, fontSize: 11, marginTop: 2 },

  // Opção NFC no menu
  opcaoNFC: {
    backgroundColor: CV.branco, borderWidth: 1, borderColor: CV.borda,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  opcaoTituloNFC: { color: CV.textoP, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  opcaoDescNFC: { color: CV.textoS, fontSize: 10, textAlign: 'center', lineHeight: 14 },

  // NFC screen
  nfcContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  nfcOndas: { alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  nfcCirculo: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: CV.azul,
  },
  nfcIconeBox: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: `${CV.azul}12`,
    justifyContent: 'center', alignItems: 'center',
  },
  nfcTitulo: { color: CV.textoP, fontSize: 22, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  nfcDesc: { color: CV.textoS, fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 32 },
  btnNfcSimular: {
    backgroundColor: CV.azul, borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 32,
    shadowColor: CV.azul, shadowOpacity: 0.3, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  btnNfcSimularTexto: { color: CV.branco, fontSize: 15, fontWeight: '800' },

  // Scanner
  scannerContainer: { flex: 1, position: 'relative' },
  camera: { flex: 1 },
  mira: {
    position: 'absolute',
    top: '25%', left: '15%', right: '15%', bottom: '25%',
  },
  canto: {
    position: 'absolute',
    width: 28, height: 28,
    borderColor: CV.branco,
  },
  scannerRodape: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 20, paddingHorizontal: 24, alignItems: 'center',
  },
  scannerDica: { color: CV.branco, fontSize: 14, textAlign: 'center', lineHeight: 20 },

  // Sem permissão
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  textoInfo: { color: CV.textoS, fontSize: 15 },
  semPermissaoIcone: {
    width: 88, height: 88, borderRadius: 28,
    backgroundColor: CV.borda,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  semPermissaoTitulo: { color: CV.textoP, fontSize: 20, fontWeight: '800', marginBottom: 10 },
  semPermissaoDesc: { color: CV.textoS, fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  btnPermissao: {
    backgroundColor: CV.azul, borderRadius: 14,
    paddingHorizontal: 24, paddingVertical: 14,
  },
  btnPermissaoTexto: { color: CV.branco, fontSize: 15, fontWeight: '800' },

  // Referência
  refContainer: { padding: 16, paddingBottom: 40 },
  label: { color: CV.textoS, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: CV.branco, borderRadius: 14, padding: 16,
    color: CV.textoP, fontSize: 15,
    borderWidth: 1, borderColor: CV.borda,
  },
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
    color: CV.textoP, fontSize: 24, fontWeight: '800', height: 64,
  },
  btnPagar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: CV.azul, borderRadius: 16,
    padding: 18, marginTop: 28,
  },
  btnPagarDesativo: { backgroundColor: CV.borda },
  btnPagarTexto: { color: CV.branco, fontSize: 16, fontWeight: '800' },
});
