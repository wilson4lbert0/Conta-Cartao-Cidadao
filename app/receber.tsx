import { IconSymbol } from '@/components/ui/icon-symbol';
import { CV } from '@/constants/theme';
import { conta, utilizador } from '@/constants/mock-data';
import { router } from 'expo-router';
import { useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Modo = 'qr' | 'nfc';

const qrConteudo = [
  `CVGOV:TRANSFER`,
  `NOME:${utilizador.nome.toUpperCase()}`,
  `NBI:${utilizador.nbi}`,
  `IBAN:${conta.iban}`,
].join('\n');

async function partilharQR() {
  await Share.share({
    title: 'Receber pagamento — Conta Digital Gov',
    message:
      `Conta Digital Gov — República de Cabo Verde\n\n` +
      `Titular: ${utilizador.nome}\n` +
      `NBI: ${utilizador.nbi}\n` +
      `IBAN: ${conta.iban}\n\n` +
      `Peça ao remetente para escanear o QR Code ou usar o IBAN acima.`,
  });
}

export default function ReceberScreen() {
  const insets = useSafeAreaInsets();
  const [modo, setModo] = useState<Modo>('qr');
  const [aguardando, setAguardando] = useState(false);

  function ativarNFC() {
    setAguardando(true);
    setTimeout(() => {
      Alert.alert(
        'Pagamento Recebido',
        'Recebeu um pagamento via NFC com sucesso.',
        [{ text: 'OK', onPress: () => setAguardando(false) }]
      );
    }, 3000);
  }

  return (
    <View style={[estilos.container, { paddingTop: insets.top }]}>
      <View style={estilos.header}>
        <Pressable onPress={() => router.back()} style={estilos.btnVoltar}>
          <IconSymbol name="chevron.left" size={22} color={CV.textoP} />
        </Pressable>
        <Text style={estilos.titulo}>Receber</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Seletor de modo */}
      <View style={estilos.seletorContainer}>
        <View style={estilos.seletor}>
          <Pressable
            style={[estilos.seletorBtn, modo === 'qr' && estilos.seletorBtnAtivo]}
            onPress={() => { setModo('qr'); setAguardando(false); }}
          >
            <IconSymbol name="qrcode" size={16} color={modo === 'qr' ? CV.branco : CV.textoS} />
            <Text style={[estilos.seletorTexto, modo === 'qr' && estilos.seletorTextoAtivo]}>QR Code</Text>
          </Pressable>
          <Pressable
            style={[estilos.seletorBtn, modo === 'nfc' && estilos.seletorBtnAtivo]}
            onPress={() => { setModo('nfc'); setAguardando(false); }}
          >
            <IconSymbol name="antenna.radiowaves.left.and.right" size={16} color={modo === 'nfc' ? CV.branco : CV.textoS} />
            <Text style={[estilos.seletorTexto, modo === 'nfc' && estilos.seletorTextoAtivo]}>NFC</Text>
          </Pressable>
        </View>
      </View>

      {/* QR Code */}
      {modo === 'qr' && (
        <ScrollView
          contentContainerStyle={estilos.corpo}
          showsVerticalScrollIndicator={false}
        >
          <Text style={estilos.instrucao}>
            Mostre este código para receber transferências
          </Text>

          <View style={estilos.qrCard}>
            <View style={estilos.qrTopo}>
              <Text style={estilos.qrBandeira}>🇨🇻 REPÚBLICA DE CABO VERDE</Text>
              <Text style={estilos.qrSubtitulo}>Conta Digital Gov</Text>
            </View>
            <View style={estilos.qrWrapper}>
              <QRCode
                value={qrConteudo}
                size={200}
                color={CV.azulEscuro}
                backgroundColor="#FFFFFF"
                logo={undefined}
                quietZone={10}
              />
            </View>
            <View style={estilos.qrRodape}>
              <Text style={estilos.qrNome}>{utilizador.nome}</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [estilos.btnPartilhar, pressed && { opacity: 0.8 }]}
            onPress={partilharQR}
          >
            <IconSymbol name="arrow.up.circle.fill" size={20} color={CV.branco} />
            <Text style={estilos.btnPartilharTexto}>Partilhar QR Code</Text>
          </Pressable>

          <View style={estilos.notaSeguranca}>
            <IconSymbol name="shield.fill" size={14} color={CV.sucesso} />
            <Text style={estilos.notaTexto}>
              Apenas utilizadores com Conta Digital Gov podem enviar para este código.
              Todas as transações são verificadas pela Chave Digital.
            </Text>
          </View>
        </ScrollView>
      )}

      {/* NFC */}
      {modo === 'nfc' && (
        <View style={estilos.nfcCorpo}>
          <View style={estilos.nfcOndas}>
            <View style={[estilos.nfcCirculo, { width: 240, height: 240, opacity: aguardando ? 0.12 : 0.06 }]} />
            <View style={[estilos.nfcCirculo, { width: 170, height: 170, opacity: aguardando ? 0.18 : 0.1 }]} />
            <View style={[estilos.nfcCirculo, { width: 100, height: 100, opacity: aguardando ? 0.28 : 0.16 }]} />
            <View style={[estilos.nfcIconeBox, aguardando && { backgroundColor: `${CV.azul}20` }]}>
              <IconSymbol name="antenna.radiowaves.left.and.right" size={38} color={CV.azul} />
            </View>
          </View>

          <Text style={estilos.nfcTitulo}>
            {aguardando ? 'A aguardar pagamento…' : 'Receber por NFC'}
          </Text>
          <Text style={estilos.nfcDesc}>
            {aguardando
              ? 'Aproxime o dispositivo do remetente para concluir.'
              : 'Ative o NFC e peça ao remetente para aproximar o dispositivo.'}
          </Text>

          {!aguardando ? (
            <Pressable
              style={({ pressed }) => [estilos.btnNfc, pressed && { opacity: 0.85 }]}
              onPress={ativarNFC}
            >
              <IconSymbol name="antenna.radiowaves.left.and.right" size={20} color={CV.branco} />
              <Text style={estilos.btnNfcTexto}>Ativar NFC</Text>
            </Pressable>
          ) : (
            <Pressable
              style={estilos.btnNfcCancelar}
              onPress={() => setAguardando(false)}
            >
              <Text style={estilos.btnNfcCancelarTexto}>Cancelar</Text>
            </Pressable>
          )}

          <View style={[estilos.notaSeguranca, { marginTop: 24, width: '100%' }]}>
            <IconSymbol name="shield.fill" size={14} color={CV.sucesso} />
            <Text style={estilos.notaTexto}>
              A receção NFC requer proximidade física. A transação é autenticada pela Chave Digital.
            </Text>
          </View>
        </View>
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

  // Seletor de modo
  seletorContainer: { paddingHorizontal: 16, marginBottom: 8 },
  seletor: {
    flexDirection: 'row', backgroundColor: CV.branco,
    borderRadius: 14, padding: 4,
    borderWidth: 1, borderColor: CV.borda,
  },
  seletorBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: 11,
  },
  seletorBtnAtivo: { backgroundColor: CV.azul },
  seletorTexto: { color: CV.textoS, fontSize: 13, fontWeight: '700' },
  seletorTextoAtivo: { color: CV.branco },

  // QR
  corpo: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 },
  instrucao: { color: CV.textoS, fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  qrCard: {
    backgroundColor: CV.branco, borderRadius: 24,
    width: '100%', alignItems: 'center',
    paddingVertical: 28, paddingHorizontal: 20,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  qrTopo: { alignItems: 'center', marginBottom: 20 },
  qrBandeira: { color: CV.azul, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  qrSubtitulo: { color: CV.textoS, fontSize: 13, marginTop: 4 },
  qrWrapper: {
    padding: 12, borderRadius: 16,
    borderWidth: 1, borderColor: CV.borda,
    backgroundColor: '#FFFFFF',
  },
  qrRodape: { alignItems: 'center', marginTop: 20 },
  qrNome: { color: CV.textoP, fontSize: 18, fontWeight: '800' },
  btnPartilhar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: CV.azul, borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 32,
    marginTop: 24, width: '100%', justifyContent: 'center',
    shadowColor: CV.azul, shadowOpacity: 0.35, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  btnPartilharTexto: { color: CV.branco, fontSize: 16, fontWeight: '800' },

  // NFC
  nfcCorpo: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 24,
  },
  nfcOndas: { alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  nfcCirculo: {
    position: 'absolute', borderRadius: 999,
    backgroundColor: CV.azul,
  },
  nfcIconeBox: {
    width: 76, height: 76, borderRadius: 24,
    backgroundColor: `${CV.azul}12`,
    justifyContent: 'center', alignItems: 'center',
  },
  nfcTitulo: { color: CV.textoP, fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  nfcDesc: { color: CV.textoS, fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 32 },
  btnNfc: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: CV.azul, borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 40,
    shadowColor: CV.azul, shadowOpacity: 0.3, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  btnNfcTexto: { color: CV.branco, fontSize: 16, fontWeight: '800' },
  btnNfcCancelar: {
    borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40,
    backgroundColor: CV.borda,
  },
  btnNfcCancelarTexto: { color: CV.textoP, fontSize: 15, fontWeight: '700' },

  // Nota de segurança
  notaSeguranca: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: `${CV.sucesso}10`, borderWidth: 1,
    borderColor: `${CV.sucesso}25`, borderRadius: 14,
    padding: 14, marginTop: 16, width: '100%',
  },
  notaTexto: { flex: 1, color: CV.textoS, fontSize: 12, lineHeight: 18 },
});
