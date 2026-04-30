import { IconSymbol } from '@/components/ui/icon-symbol';
import { CV } from '@/constants/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Notificacao = {
  id: string;
  titulo: string;
  corpo: string;
  hora: string;
  lida: boolean;
  icone: 'arrow.down.circle.fill' | 'arrow.up.circle.fill' | 'lock.fill' | 'shield.fill' | 'doc.text.fill' | 'bell.fill';
  cor: string;
};

const notificacoesIniciais: Notificacao[] = [
  {
    id: '1',
    titulo: 'Transferência recebida',
    corpo: 'Recebeu 15.000,00 ECV do INPS — Subsídio Social de Abril.',
    hora: 'Hoje, 08:00',
    lida: false,
    icone: 'arrow.down.circle.fill',
    cor: CV.sucesso,
  },
  {
    id: '2',
    titulo: 'Pagamento confirmado',
    corpo: 'Pagamento de 12.500,00 ECV à DGCI (IUR 2024) processado com sucesso.',
    hora: 'Hoje, 10:32',
    lida: false,
    icone: 'doc.text.fill',
    cor: CV.azul,
  },
  {
    id: '3',
    titulo: 'Cartão desbloqueado',
    corpo: 'O seu cartão Conta Digital Gov foi reativado.',
    hora: 'Ontem, 14:15',
    lida: true,
    icone: 'lock.fill',
    cor: CV.ouro,
  },
  {
    id: '4',
    titulo: 'Transferência enviada',
    corpo: 'Enviou 5.000,00 ECV para João Monteiro com sucesso.',
    hora: 'Ontem, 14:18',
    lida: true,
    icone: 'arrow.up.circle.fill',
    cor: CV.azul,
  },
  {
    id: '5',
    titulo: 'Alerta de segurança',
    corpo: 'Novo início de sessão detectado com a sua Chave Digital.',
    hora: '24 Abr, 09:05',
    lida: true,
    icone: 'shield.fill',
    cor: CV.vermelho,
  },
  {
    id: '6',
    titulo: 'Reembolso creditado',
    corpo: 'Recebeu 8.200,00 ECV da DGCI — Reembolso IRS 2023.',
    hora: '20 Abr, 09:00',
    lida: true,
    icone: 'arrow.down.circle.fill',
    cor: CV.sucesso,
  },
];

export default function NotificacoesScreen() {
  const insets = useSafeAreaInsets();
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais);

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  function marcarTodasLidas() {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
  }

  function marcarLida(id: string) {
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
  }

  return (
    <View style={[estilos.container, { paddingTop: insets.top }]}>
      <View style={estilos.header}>
        <Pressable onPress={() => router.back()} style={estilos.btnVoltar}>
          <IconSymbol name="chevron.left" size={22} color={CV.textoP} />
        </Pressable>
        <View style={estilos.headerCentro}>
          <Text style={estilos.titulo}>Notificações</Text>
          {naoLidas > 0 && (
            <View style={estilos.badgeCount}>
              <Text style={estilos.badgeCountTexto}>{naoLidas}</Text>
            </View>
          )}
        </View>
        {naoLidas > 0 ? (
          <Pressable onPress={marcarTodasLidas}>
            <Text style={estilos.marcarTudo}>Marcar tudo</Text>
          </Pressable>
        ) : (
          <View style={{ width: 72 }} />
        )}
      </View>

      {notificacoes.length === 0 ? (
        <View style={estilos.vazio}>
          <View style={estilos.vazioIcone}>
            <IconSymbol name="bell.fill" size={36} color={CV.borda} />
          </View>
          <Text style={estilos.vazioTitulo}>Sem notificações</Text>
          <Text style={estilos.vazioDesc}>As suas notificações aparecerão aqui.</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingHorizontal: 16 }}
        >
          {notificacoes.map((n, i) => (
            <Pressable
              key={n.id}
              style={({ pressed }) => [
                estilos.notifCard,
                !n.lida && estilos.notifCardNaoLida,
                pressed && { opacity: 0.75 },
                i === 0 && { marginTop: 8 },
              ]}
              onPress={() => marcarLida(n.id)}
            >
              <View style={[estilos.notifIcone, { backgroundColor: `${n.cor}15` }]}>
                <IconSymbol name={n.icone} size={22} color={n.cor} />
              </View>
              <View style={estilos.notifTextos}>
                <View style={estilos.notifTituloRow}>
                  <Text style={estilos.notifTitulo}>{n.titulo}</Text>
                  {!n.lida && <View style={estilos.ponto} />}
                </View>
                <Text style={estilos.notifCorpo}>{n.corpo}</Text>
                <Text style={estilos.notifHora}>{n.hora}</Text>
              </View>
            </Pressable>
          ))}
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
  headerCentro: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titulo: { color: CV.textoP, fontSize: 20, fontWeight: '800' },
  badgeCount: {
    backgroundColor: CV.vermelho, borderRadius: 10,
    paddingHorizontal: 7, paddingVertical: 2,
    minWidth: 20, alignItems: 'center',
  },
  badgeCountTexto: { color: CV.branco, fontSize: 11, fontWeight: '800' },
  marcarTudo: { color: CV.azul, fontSize: 13, fontWeight: '700' },
  notifCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: CV.branco, borderRadius: 16, padding: 16,
    marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  notifCardNaoLida: {
    borderLeftWidth: 3, borderLeftColor: CV.azul,
    backgroundColor: `${CV.azul}06`,
  },
  notifIcone: {
    width: 46, height: 46, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  notifTextos: { flex: 1 },
  notifTituloRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifTitulo: { color: CV.textoP, fontSize: 14, fontWeight: '700', flex: 1 },
  ponto: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: CV.azul, marginLeft: 8, flexShrink: 0,
  },
  notifCorpo: { color: CV.textoS, fontSize: 13, lineHeight: 18, marginTop: 4 },
  notifHora: { color: CV.textoS, fontSize: 11, marginTop: 6, fontWeight: '500' },
  vazio: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  vazioIcone: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: CV.branco, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  vazioTitulo: { color: CV.textoP, fontSize: 18, fontWeight: '800' },
  vazioDesc: { color: CV.textoS, fontSize: 14 },
});
