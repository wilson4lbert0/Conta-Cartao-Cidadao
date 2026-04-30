# id.gov — Módulo de Pagamentos Digitais (Cabo Verde)

Protótipo do módulo de pagamentos digitais integrado na aplicação oficial do **Cartão Cidadão Digital de Cabo Verde** ([id.gov.cv](https://play.google.com/store/apps/details?id=cv.gov.nosi.id)), desenvolvido pelo NOSI — Núcleo Operacional para a Sociedade de Informação.

O objetivo é adicionar um sistema de wallet nativo dentro do id.gov, sem criar uma aplicação separada, tendo o **Apache Fineract** como motor de core banking.

---

## Funcionalidades implementadas (MVP)

- **Dashboard principal** — saldo em ECV, ocultação de saldo, cartão digital e ações rápidas
- **Transferência P2P** — envio de dinheiro por número de telemóvel
- **Receber** — QR Code pessoal para receber pagamentos
- **Pagar** — leitura de QR e pagamento por referência (ELECTRA, EAGECV, impostos, etc.)
- **Cartão Digital** — visualização e gestão do cartão virtual
- **Histórico de transações** — registo completo de movimentos
- **Notificações** — centro de notificações push
- **Ativar conta** — fluxo de ativação de nova conta

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Navegação | Expo Router (file-based routing) |
| UI | React Native core + expo-symbols |
| Câmara / QR | expo-camera + react-native-qrcode-svg |
| Animações | react-native-reanimated 4 |
| Linguagem | TypeScript 5.9 |
| Core banking (previsto) | Apache Fineract 1.14 |

---

## Estrutura do projeto

```
app/
├── (tabs)/           # Tab principal (dashboard)
├── nova-transferencia.tsx
├── receber.tsx
├── pagar.tsx
├── meu-cartao.tsx
├── historico.tsx
├── notificacoes.tsx
├── contas.tsx
└── ativar-conta.tsx
components/           # Componentes reutilizáveis
constants/
├── theme.ts          # Paleta de cores e design tokens
└── mock-data.ts      # Dados de exemplo
```

---

## Como executar

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npx expo start
```

Opções de execução após o start:

- **iOS Simulator** — pressionar `i`
- **Android Emulator** — pressionar `a`
- **Expo Go** — ler o QR Code com a câmara do telemóvel
- **Web** — pressionar `w`

---

## Contexto técnico

- **Moeda:** ECV — Escudo Cabo-Verdiano (ISO 4217: CVE)
- **Identificador de conta:** número de telemóvel (+238 seguido de 7 dígitos)
- **KYC:** 3 níveis progressivos; identidade base herdada do id.gov
- **Idioma:** Português (principal)
- **Fuso horário:** UTC-1

### Arquitetura de saldos

Existe uma **conta mãe** central (titulada pelo NOSI) alojada num banco parceiro. O Apache Fineract gere os saldos individuais como sub-contas virtuais, garantindo sempre:

> Soma de todos os saldos virtuais = Saldo da Conta Mãe

---

## Autenticação por nível de transação

| Valor | Método |
|---|---|
| < 500 ECV | PIN de 4 dígitos |
| 500 — 5.000 ECV | Biometria |
| 5.000 — 50.000 ECV | Biometria + SMS OTP |
| > 50.000 ECV | Biometria + SMS OTP + confirmação manual |

---

## Referências

- App id.gov em produção: `cv.gov.nosi.id`
- [Apache Fineract](https://fineract.apache.org)
- RJSPME: Decreto-legislativo n.º 8/2018, de 28 de novembro
- Banco de Cabo Verde — Relatório Fintech CV 2025
