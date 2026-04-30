import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Paleta do cartão prateado
const S = {
  fundo: '#C8CAD4',
  decoracao: '#9EA4B2',
  texto: '#12203A',
  textoSec: 'rgba(18, 32, 58, 0.55)',
  azulCV: '#003893',
};


export function CartaoDigital({ numero, titular, validade, ativo, compacto = false, onPress, revelar }: CartaoDigitalProps) {
  const [mostrarNumero, setMostrarNumero] = useState(false);
  const visivel = revelar !== undefined ? revelar : mostrarNumero;
  const numFormatado = visivel ? numero : numero.replace(/\d(?=\d{4})/g, '•');

  return (
    <Pressable
      onPress={onPress ?? (revelar !== undefined ? undefined : () => setMostrarNumero(v => !v))}
      style={[estilos.cartao, compacto && estilos.cartaoCompacto]}
    >
      {/* Reflexo superior claro */}
      <View style={estilos.reflexoTopo} />
      {/* Circulo decorativo direito */}
      <View style={estilos.fundoCirculo1} />
      {/* Circulo decorativo esquerdo */}
      <View style={estilos.fundoCirculo2} />
      {/* Reflexo inferior escuro */}
      <View style={estilos.reflexoBase} />

      <View style={estilos.topo}>
        <View>
          <Text style={estilos.labelBandeira}>REPÚBLICA DE CABO VERDE</Text>
          <Text style={estilos.labelConta}>Conta Digital Gov</Text>
        </View>
        <View style={[estilos.badgeEstado, { backgroundColor: ativo ? '#00A651' : '#CF2027' }]}>
          <Text style={estilos.badgeTexto}>{ativo ? 'Ativo' : 'Bloqueado'}</Text>
        </View>
      </View>

      {!compacto && (
        <View style={estilos.chip}>
          <View style={estilos.chipInner} />
        </View>
      )}

      <Text style={[estilos.numero, compacto && estilos.numeroCompacto]}>{numFormatado}</Text>

      <View style={estilos.rodape}>
        <View>
          <Text style={estilos.labelRodape}>TITULAR</Text>
          <Text style={estilos.valorRodape}>{titular}</Text>
        </View>
        <View>
          <Text style={estilos.labelRodape}>VALIDADE</Text>
          <Text style={estilos.valorRodape}>{visivel ? validade : '••/••'}</Text>
        </View>
      </View>
    </Pressable>
  );
}

type CartaoDigitalProps = {
  numero: string;
  titular: string;
  validade: string;
  ativo: boolean;
  compacto?: boolean;
  onPress?: () => void;
  revelar?: boolean;
};

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: S.fundo,
    borderRadius: 20,
    padding: 24,
    height: 200,
    marginHorizontal: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
    // Sombra para dar profundidade ao efeito metálico
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  cartaoCompacto: {
    height: 160,
    padding: 18,
  },
  // Reflexo claro no topo (simula luz a bater no metal)
  reflexoTopo: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderRadius: 20,
  },
  // Reflexo escuro na base
  reflexoBase: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '30%',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  fundoCirculo1: {
    position: 'absolute',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: S.decoracao,
    top: -60, right: -40,
    opacity: 0.35,
  },
  fundoCirculo2: {
    position: 'absolute',
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: S.decoracao,
    bottom: -50, left: 40,
    opacity: 0.25,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  labelBandeira: {
    color: S.azulCV,
    fontSize: 8, fontWeight: '800', letterSpacing: 1,
  },
  labelConta: {
    color: S.texto,
    fontSize: 13, fontWeight: '700', marginTop: 2,
  },
  badgeEstado: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  badgeTexto: {
    color: '#FFFFFF', fontSize: 10, fontWeight: '700',
  },
  chip: {
    width: 36, height: 26, borderRadius: 5,
    backgroundColor: '#C8A84B',
    justifyContent: 'center', alignItems: 'center',
  },
  chipInner: {
    width: 20, height: 14, borderRadius: 3,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.25)',
  },
  numero: {
    color: S.texto,
    fontSize: 16, fontWeight: '700', letterSpacing: 2.5,
    fontFamily: 'monospace',
  },
  numeroCompacto: {
    fontSize: 13, letterSpacing: 1.5,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  labelRodape: {
    color: S.textoSec,
    fontSize: 8, fontWeight: '700', letterSpacing: 0.6,
  },
  valorRodape: {
    color: S.texto, fontSize: 12, fontWeight: '700', marginTop: 2,
  },
});
