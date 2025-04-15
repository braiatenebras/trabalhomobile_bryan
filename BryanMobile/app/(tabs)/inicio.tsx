import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, Picker, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

// Interface ChatBot
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  showBackButton?: boolean;
}

export default function HomeScreen() {
  const [mostrar, setMostrar] = useState(true);
  const [screen, setScreen] = useState('Home');
  const [darkMode, setDarkMode] = useState(true);
  const [exchangeRates, setExchangeRates] = useState<any>(null);
  const [saldo, setSaldo] = useState(25000);
  const [mostrarConversoes, setMostrarConversoes] = useState(false);
  const [pixKeyType, setPixKeyType] = useState('cpf');
  const [pixKey, setPixKey] = useState('');
  const [pixValue, setPixValue] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou seu assistente bancário virtual. Como posso ajudar?'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Novos estados para operações
  const [recargaValue, setRecargaValue] = useState('');
  const [recargaOperadora, setRecargaOperadora] = useState('Claro');
  const [recargaNumero, setRecargaNumero] = useState('');
  const [pagamentoValue, setPagamentoValue] = useState('');
  const [pagamentoCodigo, setPagamentoCodigo] = useState('');
  const [transferenciaValue, setTransferenciaValue] = useState('');
  const [transferenciaDestinatario, setTransferenciaDestinatario] = useState('');

  const toggleTheme = () => setDarkMode(!darkMode);

  // Tema escuro estilos 
  const theme = {
    background: darkMode ? '#121212' : '#fff',
    card: darkMode ? '#1e1e1e' : '#fff',
    textPrimary: darkMode ? '#fff' : '#000',
    textSecondary: darkMode ? '#aaa' : '#555',
    accent: '#820ad1',
    primary: '#6200ee',
    border: darkMode ? '#444' : '#ddd',
    buttonText: darkMode ? '#fff' : '#fff',
  };

  // Api do conversor
  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('https://v6.exchangerate-api.com/v6/5c91ee70a1644e990cc95d25/latest/BRL');
      const data = await response.json();
      setExchangeRates(data.conversion_rates);
    } catch (error) {
      console.error('Erro ao buscar taxas de câmbio:', error);
    }
  };

  const convertCurrency = (currencyCode: string) => {
    if (!exchangeRates) return 0;
    const rate = exchangeRates[currencyCode];
    return saldo * rate;
  };

  // Pix
  const handlePixTransfer = () => {
    if (!pixKey) {
      Alert.alert('Erro', 'Por favor, insira uma chave Pix válida');
      return;
    }

    if (!pixValue || isNaN(parseFloat(pixValue))) {
      Alert.alert('Erro', 'Por favor, insira um valor válido');
      return;
    }

    const value = parseFloat(pixValue);
    if (value > saldo) {
      Alert.alert('Erro', 'Saldo insuficiente');
      return;
    }

    Alert.alert('Sucesso', `Transferência Pix de R$ ${value.toFixed(2)} realizada com sucesso!`);
    setSaldo(saldo - value);
    setPixKey('');
    setPixValue('');
    setScreen('Home');
  };

  // Recarga
  const handleRecarga = () => {
    if (!recargaNumero || recargaNumero.length < 11) {
      Alert.alert('Erro', 'Por favor, insira um número válido (11 dígitos)');
      return;
    }

    if (!recargaValue || isNaN(parseFloat(recargaValue))) {
      Alert.alert('Erro', 'Por favor, insira um valor válido');
      return;
    }

    const value = parseFloat(recargaValue);
    if (value > saldo) {
      Alert.alert('Erro', 'Saldo insuficiente');
      return;
    }

    Alert.alert('Sucesso', `Recarga de R$ ${value.toFixed(2)} (${recargaOperadora}) realizada!`);
    setSaldo(saldo - value);
    setRecargaValue('');
    setRecargaNumero('');
    setScreen('Home');
  };

  // Pagamento
  const handlePagamento = () => {
    if (!pagamentoCodigo) {
      Alert.alert('Erro', 'Por favor, insira um código válido');
      return;
    }

    if (!pagamentoValue || isNaN(parseFloat(pagamentoValue))) {
      Alert.alert('Erro', 'Por favor, insira um valor válido');
      return;
    }

    const value = parseFloat(pagamentoValue);
    if (value > saldo) {
      Alert.alert('Erro', 'Saldo insuficiente');
      return;
    }

    Alert.alert('Sucesso', `Pagamento de R$ ${value.toFixed(2)} realizado!`);
    setSaldo(saldo - value);
    setPagamentoValue('');
    setPagamentoCodigo('');
    setScreen('Home');
  };

  // Transferência
  const handleTransferencia = () => {
    if (!transferenciaDestinatario) {
      Alert.alert('Erro', 'Por favor, insira um destinatário válido');
      return;
    }

    if (!transferenciaValue || isNaN(parseFloat(transferenciaValue))) {
      Alert.alert('Erro', 'Por favor, insira um valor válido');
      return;
    }

    const value = parseFloat(transferenciaValue);
    if (value > saldo) {
      Alert.alert('Erro', 'Saldo insuficiente');
      return;
    }

    Alert.alert('Sucesso', `Transferência de R$ ${value.toFixed(2)} realizada!`);
    setSaldo(saldo - value);
    setTransferenciaValue('');
    setTransferenciaDestinatario('');
    setScreen('Home');
  };

  // Chatbot
  const getAIResponse = (userMessage: string): { response: string, showBackButton?: boolean } => {
    const lowerMessage = userMessage.toLowerCase();

    if (/sair|voltar|home|início|inicio/.test(lowerMessage)) {
      return {
        response: 'Clique no botão abaixo para voltar à tela inicial:',
        showBackButton: true
      };
    }
    if (/site|bryan|criação/.test(lowerMessage)) {
      return {
        response: `Esse aplicativo em React Native foi criado e configurado por Bryan Kauan Fagundes! (3°D).`
      };
    }

    if (/oi|olá|ola|bom dia|boa tarde|boa noite/.test(lowerMessage)) {
      return {
        response: 'Olá! Sou seu assistente bancário. Posso te ajudar com:\n\n• Saldo \n• Transferências Pix\n• Pagamentos\n• Cartões\n• Recargas'
      };
    }

    if (/saldo|dinheiro|disponível/.test(lowerMessage)) {
      return {
        response: `Seu saldo atual é R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`
      };
    }

    if (/pix|transferência|transferencia|enviar dinheiro/.test(lowerMessage)) {
      return {
        response: 'Para fazer um Pix:\n1. Acesse a aba "Pix"\n2. Escolha o tipo de chave\n3. Digite o valor\n4. Confirme os dados\n\n'
      };
    }

    if (/cartão|cartao|crédito|credito|débito|cartões| debito/.test(lowerMessage)) {
      return {
        response: 'Na seção "Meus cartões" você pode:\n• Ver seus cartões\n• Bloquear cartões\n• Ajustar limites\n• Solicitar novos'
      };
    }

    if (/pagar|conta|boleto|qr code/.test(lowerMessage)) {
      return {
        response: 'Para pagamentos:\n1. Toque em "Pagar"\n2. Escaneie o código\n3. Confirme os dados\n4. Autorize o pagamento'
      };
    }

    if (/recarga|celular|créditos/.test(lowerMessage)) {
      return {
        response: 'Recarregue seu celular:\n1. Vá em "Recarga"\n2. Digite o número\n3. Escolha o valor\n4. Confirme'
      };
    }

    if (/câmbio|cambio|moeda|dólar|dolar|euro/.test(lowerMessage)) {
      return {
        response: `Seu saldo em outras moedas:\n\nDólar: $${convertCurrency('USD').toFixed(2)}\nEuro: €${convertCurrency('EUR').toFixed(2)}\nLibra: £${convertCurrency('GBP').toFixed(2)}`
      };
    }

    if (/ajuda|comandos|opções|o que você faz/.test(lowerMessage)) {
      return {
        response: 'Posso ajudar com:\n\n• Consultas de saldo\n• Instruções sobre Pix\n• Informações de cartões\n• Pagamento de contas\n• Recarga de celular\n• Conversão de moedas'
      };
    }

    if (/obrigado|obrigada|valeu|tchau/.test(lowerMessage)) {
      return {
        response: 'Por nada! Estou aqui sempre que precisar. Tenha um ótimo dia!'
      };
    }

    return {
      response: 'Não entendi completamente. Posso te ajudar com:\n• Site\n• Saldo\n• Pix\n• Cartões\n• Pagamentos\n• Recargas\n• Conversão de saldo\n\nO que você precisa?'
    };
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: userInput
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    setTimeout(() => {
      const { response, showBackButton } = getAIResponse(userInput);

      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response,
          showBackButton
        }
      ]);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const renderScreen = () => {
    if (screen === 'Home') {
      return (
        <>
          {/* Cabeçalho com botão de ajuda integrado */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setScreen('Perfil')}>
              <Ionicons name="person-outline" size={28} color={theme.textPrimary} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', left: 35 }}>
              <Text style={[styles.meunome, { color: theme.textPrimary }]}>Olá, Bryan</Text>

              <TouchableOpacity onPress={() => setScreen('Chatbot')} style={{ marginLeft: 10, right: 170 }}>
                <Ionicons name="help-circle-outline" size={28} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity onPress={toggleTheme}>
                <Ionicons
                  name={darkMode ? 'sunny-outline' : 'moon-outline'}
                  size={24}
                  color={theme.textPrimary}
                  style={{ marginRight: 10, right: 10 }}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setMostrar(!mostrar)}>
                <Ionicons name={mostrar ? 'eye-outline' : 'eye-off-outline'} size={28} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Card de Saldo */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Seu saldo</Text>
            <Text style={[styles.saldo, { color: theme.textPrimary }]}>
              {mostrar ? `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '••••••'}
            </Text>
          </View>

          {/* Ações Rápidas */}
          <View style={styles.actions}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => setScreen('Pix')}>
                <FontAwesome6 name="pix" size={24} color={theme.accent} />
                <Text style={[styles.buttonText, { color: theme.accent }]}>Pix</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => setScreen('Pagar')}>
                <Ionicons name="barcode-outline" size={24} color={theme.accent} />
                <Text style={[styles.buttonText, { color: theme.accent }]}>Pagar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => setScreen('Transferir')}>
                <Ionicons name="swap-horizontal-outline" size={24} color={theme.accent} />
                <Text style={[styles.buttonText, { color: theme.accent }]}>Transferir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => setScreen('Recarga')}>
                <MaterialIcons name="4g-mobiledata" size={24} color={theme.accent} />
                <Text style={[styles.buttonText, { color: theme.accent }]}>Recarga</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Meus Cartões */}
          <TouchableOpacity
            style={[styles.card1, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => setScreen('Cartões')}>
            <Text style={[styles.cardText, { color: theme.textPrimary }]}>Meus cartões</Text>
            <Ionicons name="card" size={35} color={theme.accent} style={styles.iconcard} />
          </TouchableOpacity>

          {/* Conversor de Moedas */}
          <Text style={[styles.conversor, { color: theme.textPrimary }]}>Conversor de moedas</Text>
          <Text style={[styles.conversor2, { color: theme.textSecondary }]}>Com o saldo atual</Text>

          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TouchableOpacity onPress={() => setMostrarConversoes(!mostrarConversoes)}>
              <Text style={{ color: theme.accent, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                {mostrarConversoes ? 'Ocultar conversões' : 'Mostrar conversões'}
              </Text>
            </TouchableOpacity>
          </View>

          {mostrarConversoes && exchangeRates && (
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Saldo em outras moedas:</Text>
              <Text style={[styles.saldo, { color: theme.textPrimary, marginBottom: 10, fontSize: 16 }]}>
                USD (Dólar Americano): ${convertCurrency('USD').toFixed(2)}
              </Text>
              <Text style={[styles.saldo, { color: theme.textPrimary, marginBottom: 10, fontSize: 16 }]}>
                EUR (Euro): €${convertCurrency('EUR').toFixed(2)}
              </Text>
              <Text style={[styles.saldo, { color: theme.textPrimary, marginBottom: 10, fontSize: 16 }]}>
                GBP (Libra Esterlina): £${convertCurrency('GBP').toFixed(2)}
              </Text>
              <Text style={[styles.saldo, { color: theme.textPrimary, marginBottom: 10, fontSize: 16 }]}>
                JPY (Iene Japonês): ¥${convertCurrency('JPY').toFixed(2)}
              </Text>
              <Text style={[styles.saldo, { color: theme.textPrimary, marginBottom: 10, fontSize: 16 }]}>
                CAD (Dólar Canadense): C$${convertCurrency('CAD').toFixed(2)}
              </Text>
              <Text style={[styles.saldo, { color: theme.textPrimary, marginBottom: 10, fontSize: 16 }]}>
                AUD (Dólar Australiano): A$${convertCurrency('AUD').toFixed(2)}
              </Text>
              <Text style={[styles.saldo, { color: theme.textPrimary, marginBottom: 10, fontSize: 16 }]}>
                CHF (Franco Suíço): Fr.${convertCurrency('CHF').toFixed(2)}
              </Text>
            </View>
          )}
        </>
      );

      // Tela de pix
    } else if (screen === 'Pix') {
      return (
        <View style={[styles.screenContainer, { backgroundColor: theme.background, padding: 20, marginBottom: -200, marginTop: -100 }]}>
          <Text style={[styles.screenTitle, { color: theme.accent, marginTop: -100, }]}>Pix</Text>
          <Text style={{ color: theme.textPrimary, marginBottom: 20, textAlign: 'center' }}>Transferência rápida e segura via Pix</Text>

          <View style={[styles.pixInputContainer, { backgroundColor: theme.card }]}>
            <Picker
              style={{
                color: theme.textPrimary,
                height: 50,
                width: '100%',
                backgroundColor: theme.card,

              }}
              selectedValue={pixKeyType}
              onValueChange={(itemValue: React.SetStateAction<string>) => setPixKeyType(itemValue)}>
              <Picker.Item label="CPF" value="cpf" />
              <Picker.Item label="E-mail" value="email" />
              <Picker.Item label="Chave Aleatória" value="random" />
              <Picker.Item label="Telefone" value="phone" />
            </Picker>

            <TextInput
              style={[
                styles.pixInput,
                {
                  color: theme.textPrimary,
                  borderColor: theme.border,
                  backgroundColor: theme.card
                }
              ]}
              placeholder="Digite a chave Pix"
              placeholderTextColor={theme.textSecondary}
              keyboardType={
                pixKeyType === 'cpf' || pixKeyType === 'phone' ? 'numeric' :
                  pixKeyType === 'email' ? 'email-address' : 'default'
              }
              value={pixKey}
              onChangeText={(text) => setPixKey(text)}
            />

            <TextInput
              style={[
                styles.pixInput,
                {
                  color: theme.textPrimary,
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                  marginTop: 15
                }
              ]}
              placeholder="Valor (R$)"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={pixValue}
              onChangeText={(text) => setPixValue(text)}
            />
          </View>

          <TouchableOpacity
            style={[styles.pixButton, { backgroundColor: theme.accent }]}
            onPress={handlePixTransfer}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Continuar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pixBackButton]}
            onPress={() => setScreen('Home')}>
            <Text style={[styles.backButton, { color: theme.accent }]}>Voltar</Text>
          </TouchableOpacity>
        </View>
      );

      // Tela de Recarga
    } else if (screen === 'Recarga') {
      return (
        <View style={[styles.screenContainer, { backgroundColor: theme.background, padding: 20, marginBottom: -200, marginTop: -100 }]}>
          <Text style={[styles.screenTitle, { color: theme.accent, fontSize: 24, marginBottom: 20 }]}>Recarga de Celular</Text>

          <View style={{ borderWidth: 1, borderColor: theme.accent, borderRadius: 10, padding: 15, marginBottom: 20, backgroundColor: theme.card }}>
            <Text style={{ color: theme.textPrimary, marginBottom: 10, fontWeight: 'bold' }}>Operadoras:</Text>
            <TouchableOpacity 
              style={{ 
                backgroundColor: recargaOperadora === 'Claro' ? theme.accent : theme.card, 
                padding: 12, 
                borderRadius: 8, 
                marginBottom: 10 
              }}
              onPress={() => setRecargaOperadora('Claro')}
            >
              <Text style={{ 
                color: recargaOperadora === 'Claro' ? 'white' : theme.textPrimary, 
                textAlign: 'center', 
                fontWeight: '500' 
              }}>Claro</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ 
                backgroundColor: recargaOperadora === 'Vivo' ? theme.accent : theme.card, 
                padding: 12, 
                borderRadius: 8, 
                marginBottom: 10 
              }}
              onPress={() => setRecargaOperadora('Vivo')}
            >
              <Text style={{ 
                color: recargaOperadora === 'Vivo' ? 'white' : theme.textPrimary, 
                textAlign: 'center', 
                fontWeight: '500' 
              }}>Vivo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ 
                backgroundColor: recargaOperadora === 'Tim' ? theme.accent : theme.card, 
                padding: 12, 
                borderRadius: 8 
              }}
              onPress={() => setRecargaOperadora('Tim')}
            >
              <Text style={{ 
                color: recargaOperadora === 'Tim' ? 'white' : theme.textPrimary, 
                textAlign: 'center', 
                fontWeight: '500' 
              }}>Tim</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Número do celular"
            placeholderTextColor={theme.textSecondary}
            style={{
              borderBottomWidth: 1,
              borderColor: theme.accent,
              color: theme.textPrimary,
              padding: 10,
              marginBottom: 20,
              backgroundColor: theme.card,
              borderRadius: 8
            }}
            keyboardType="phone-pad"
            value={recargaNumero}
            onChangeText={setRecargaNumero}
          />

          <TextInput
            placeholder="Valor da recarga (R$)"
            placeholderTextColor={theme.textSecondary}
            style={{
              borderBottomWidth: 1,
              borderColor: theme.accent,
              color: theme.textPrimary,
              padding: 10,
              marginBottom: 20,
              backgroundColor: theme.card,
              borderRadius: 8
            }}
            keyboardType="numeric"
            value={recargaValue}
            onChangeText={setRecargaValue}
          />

          <TouchableOpacity
            style={{
              backgroundColor: theme.accent,
              padding: 15,
              borderRadius: 8,
              marginBottom: 15,
              shadowColor: theme.accent,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5
            }}
            onPress={handleRecarga}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Confirmar Recarga</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setScreen('Home')}
            style={{ alignSelf: 'center' }}
          >
            <Text style={[styles.backButton, { color: theme.accent }]}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
} 

// Tela de Pagamentos
else if (screen === 'Pagar') {
      return (
        <View style={[styles.screenContainer, { backgroundColor: theme.background, padding: 20, marginBottom: -200, marginTop: -100 }]}>
          <Text style={[styles.screenTitle, { color: theme.accent, fontSize: 24, marginBottom: 20 }]}>Pagamento</Text>

          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <View style={{
              width: 200,
              height: 200,
              backgroundColor: theme.card,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: theme.border
            }}>
              <Ionicons name="qr-code-outline" size={60} color={theme.accent} />
              <Text style={{ color: theme.textSecondary, marginTop: 10 }}>Área do QR Code</Text>
            </View>
            <Text style={{ color: theme.textPrimary, textAlign: 'center' }}>Aponte a câmera para o código QR ou digite o código manualmente</Text>
          </View>

          <TextInput
            placeholder="Código de barras"
            placeholderTextColor={theme.textSecondary}
            style={{
              borderBottomWidth: 1,
              borderColor: theme.accent,
              color: theme.textPrimary,
              padding: 10,
              marginBottom: 20,
              backgroundColor: theme.card,
              borderRadius: 8
            }}
            value={pagamentoCodigo}
            onChangeText={setPagamentoCodigo}
          />

          <TextInput
            placeholder="Valor (R$)"
            placeholderTextColor={theme.textSecondary}
            style={{
              borderBottomWidth: 1,
              borderColor: theme.accent,
              color: theme.textPrimary,
              padding: 10,
              marginBottom: 20,
              backgroundColor: theme.card,
              borderRadius: 8
            }}
            keyboardType="numeric"
            value={pagamentoValue}
            onChangeText={setPagamentoValue}
          />

          <TouchableOpacity
            style={{
              backgroundColor: theme.accent,
              padding: 15,
              borderRadius: 8,
              marginBottom: 15,
              shadowColor: theme.accent,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5
            }}
            onPress={handlePagamento}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Confirmar Pagamento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setScreen('Home')}
            style={{ alignSelf: 'center' }}
          >
            <Text style={[styles.backButton, { color: theme.accent }]}>Voltar</Text>
          </TouchableOpacity>
        </View>
      );


    } else if (screen === 'Transferir') {
      return (
        <View style={[styles.screenContainer, { backgroundColor: theme.background, padding: 20, marginBottom: -200, marginTop: -100 }]}>
          <Text style={[styles.screenTitle, { color: theme.accent, fontSize: 24, marginBottom: 20 }]}>Transferência</Text>

          <TextInput
            placeholder="Número da conta ou CPF"
            placeholderTextColor={theme.textSecondary}
            style={{
              borderBottomWidth: 1,
              borderColor: theme.accent,
              color: theme.textPrimary,
              padding: 10,
              marginBottom: 15,
              backgroundColor: theme.card,
              borderRadius: 8
            }}
            value={transferenciaDestinatario}
            onChangeText={setTransferenciaDestinatario}
          />

          <TextInput
            placeholder="Valor (R$)"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            style={{
              borderBottomWidth: 1,
              borderColor: theme.accent,
              color: theme.textPrimary,
              padding: 10,
              marginBottom: 20,
              backgroundColor: theme.card,
              borderRadius: 8
            }}
            value={transferenciaValue}
            onChangeText={setTransferenciaValue}
          />

          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: theme.textPrimary, marginBottom: 10, fontWeight: '500' }}>Contatos recentes:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity 
                style={{ marginRight: 15, alignItems: 'center' }}
                onPress={() => {
                  setTransferenciaDestinatario('Giovane');
                  Alert.alert('Giovane selecionado', 'Digite o valor e confirme a transferência');
                }}
              >
                <Image
                  source={require('../../assets/images/giovane.png')}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    marginBottom: 5,
                    borderWidth: 2,
                    borderColor: theme.accent
                  }}
                />
                <Text style={{ color: theme.textPrimary, fontSize: 12 }}>Giovane</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{ marginRight: 15, alignItems: 'center' }}
                onPress={() => {
                  setTransferenciaDestinatario('Maidel');
                  Alert.alert('Maidel selecionado', 'Digite o valor e confirme a transferência');
                }}
              >
                <Image
                  source={require('../../assets/images/maidel.jpg')}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    marginBottom: 5,
                    borderWidth: 2,
                    borderColor: theme.accent
                  }}
                />
                <Text style={{ color: theme.textPrimary, fontSize: 12 }}>Maidel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{ marginRight: 15, alignItems: 'center' }}
                onPress={() => {
                  setTransferenciaDestinatario('Jiane');
                  Alert.alert('Jiane selecionado', 'Digite o valor e confirme a transferência');
                }}
              >
                <Image
                  source={require('../../assets/images/jiane.jpg')}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    marginBottom: 5,
                    borderWidth: 2,
                    borderColor: theme.accent
                  }}
                />
                <Text style={{ color: theme.textPrimary, fontSize: 12 }}>Jiane</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: theme.accent,
              padding: 15,
              borderRadius: 8,
              marginBottom: 15,
              shadowColor: theme.accent,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5
            }}
            onPress={handleTransferencia}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
              Confirmar Transferência
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setScreen('Home')}
            style={{ alignSelf: 'center' }}
          >
            <Text style={[styles.backButton, { color: theme.accent }]}>Voltar</Text>
          </TouchableOpacity>
        </View>
      );
    } 

    // Tela dos cartões
    else if (screen === 'Cartões') {
      return (
        <View style={[styles.screenContainer, { backgroundColor: theme.background, padding: 20, marginBottom: -200, marginTop: -60 }]}>
          <Text style={[styles.screenTitle, { color: theme.accent, fontSize: 24, marginBottom: 20, top: -40, }]}>Meus Cartões</Text>

          <View style={{
            borderWidth: 1,
            borderColor: theme.accent,
            borderRadius: 10,
            padding: 15,
            marginBottom: 20,
            backgroundColor: theme.card
          }}>
            <Text style={{ color: theme.textPrimary, fontWeight: 'bold', marginBottom: 10 }}>Cartão Principal</Text>
            <View style={{
              backgroundColor: theme.primary,
              padding: 15,
              borderRadius: 8,
              marginBottom: 15,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3
            }}>
              <Text style={{ color: 'white', marginBottom: 5, fontSize: 16 }}>•••• •••• •••• 1234</Text>
              <Text style={{ color: 'white', fontSize: 14 }}>VISA • Bryan K. Fagundes</Text>
              <Text style={{ color: 'white', marginTop: 10, fontSize: 12 }}>Validade: 12/25</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={{ padding: 8 }}>
                <Text style={{ color: theme.accent }}>Bloquear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 8 }}>
                <Text style={{ color: theme.accent }}>Detalhes</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: theme.accent,
              padding: 15,
              borderRadius: 8,
              marginBottom: 15,
              backgroundColor: theme.card
            }}
            onPress={() => Alert.alert('Cartão', 'Adicionar novo cartão')}
          >
            <Text style={{ color: theme.accent, textAlign: 'center', fontWeight: '500' }}>+ Adicionar novo cartão</Text>
          </TouchableOpacity>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: theme.textPrimary, marginBottom: 10, fontWeight: '500' }}>Cartões salvos:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <View style={{ width: '48%', marginRight: '4%', marginBottom: 10 }}>
                <TouchableOpacity style={{
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: theme.card
                }}>
                  <Text style={{ color: theme.textPrimary, fontWeight: '500' }}>Mastercard</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>•••• 5678</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: '48%' }}>
                <TouchableOpacity style={{
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: theme.card
                }}>
                  <Text style={{ color: theme.textPrimary, fontWeight: '500' }}>Elo</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>•••• 9012</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setScreen('Home')}
            style={{ alignSelf: 'center' }}
          >
            <Text style={[styles.backButton, { color: theme.accent }]}>Voltar</Text>
          </TouchableOpacity>
        </View>
      );

      // Tela do perfil
    } else if (screen === 'Perfil') {
      return (
        <View style={[styles.screenContainer, { backgroundColor: theme.background, padding: 20, marginTop: -100, top: 40, }]}>
          <Text style={[styles.screenTitle, { color: theme.accent, fontSize: 24, top: 0 }]}>Meu Perfil</Text>

          <View style={{
            alignItems: 'center',
            marginBottom: 20,
            backgroundColor: theme.card,
            padding: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.border,
            marginTop: -40,
            top: 55
          }}>
            <Image
              source={require('../../assets/images/bryan.jpg')}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 15,
                borderWidth: 2,
                borderColor: theme.accent,
              }}
            />
            <Text style={{ color: theme.textPrimary, fontSize: 20, fontWeight: 'bold' }}>Bryan Kauan Fagundes</Text>
            <Text style={{ color: theme.textSecondary, marginTop: 5 }}>3°D - Desenvolvimento de Sistemas</Text>
          </View>

          <View style={{
            backgroundColor: theme.card,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 15,
            marginBottom: 20,
            top: 55
          }}>
            <Text style={{ color: theme.textPrimary, fontWeight: 'bold', marginBottom: 10 }}>Informações Pessoais</Text>
            <View style={{ marginBottom: 15 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>CPF</Text>
              <Text style={{ color: theme.textPrimary }}>123.456.789-00</Text>
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>E-mail</Text>
              <Text style={{ color: theme.textPrimary }}>bryan@escola.com</Text>
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Telefone</Text>
              <Text style={{ color: theme.textPrimary }}>(11) 98765-4321</Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: theme.accent,
              padding: 15,
              borderRadius: 8,
              marginBottom: 15,
              top: 55
            }}
            onPress={() => Alert.alert('Configurações', 'Abrir configurações')}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              padding: 15,
              borderRadius: 8,
              marginBottom: 10,
              top: 55
            }}
            onPress={() => Alert.alert('Ajuda', 'Abrir ajuda')}
          >
            <Text style={{ color: theme.textPrimary, textAlign: 'center' }}>Ajuda e Suporte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setScreen('Home')}
            style={{ alignSelf: 'center' }}
          >
            <Text style={[styles.backButton, { color: theme.accent, top: 60, }]}>Voltar</Text>
          </TouchableOpacity>
        </View>
      );

      // Tela de chatbot
    } else if (screen === 'Chatbot') {
      return (
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: theme.background }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.chatHeader, { backgroundColor: theme.card }]}>
            <TouchableOpacity onPress={() => setScreen('Home')}>
              <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.chatTitle, { color: theme.textPrimary }]}>Assistente Virtual</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            style={styles.chatContainer}
            contentContainerStyle={{ paddingBottom: 80 }}
            ref={ref => {
              if (ref) {
                setTimeout(() => ref.scrollToEnd({ animated: true }), 100);
              }
            }}
          >
            {chatMessages.map((msg, index) => (
              <React.Fragment key={index}>
                <View
                  style={[
                    styles.messageBubble,
                    {
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      backgroundColor: msg.role === 'user' ? theme.accent : theme.card,
                      borderColor: theme.border
                    }
                  ]}
                >
                  <Text style={{ color: msg.role === 'user' ? '#fff' : theme.textPrimary }}>
                    {msg.content}
                  </Text>
                </View>
                {msg.showBackButton && (
                  <TouchableOpacity
                    style={[
                      styles.backButton,
                      {
                        alignSelf: 'center',
                        backgroundColor: theme.accent,
                        padding: 10,
                        borderRadius: 8,
                        marginTop: 10
                      }
                    ]}
                    onPress={() => setScreen('Home')}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Voltar à Tela Inicial</Text>
                  </TouchableOpacity>
                )}
              </React.Fragment>
            ))}
            {loading && (
              <View style={[styles.messageBubble, {
                alignSelf: 'flex-start',
                backgroundColor: theme.card,
                borderColor: theme.border
              }]}>
                <Text style={{ color: theme.textPrimary }}>Digitando...</Text>
              </View>
            )}
          </ScrollView>

          <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
            <TextInput
              style={[
                styles.chatInput,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.card,
                  borderColor: theme.border
                }
              ]}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={theme.textSecondary}
              value={userInput}
              onChangeText={setUserInput}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: theme.accent }]}
              onPress={handleSendMessage}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    } else {
      return (
        <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.screenTitle, { color: theme.accent }]}>Área de {screen}</Text>
          <TouchableOpacity onPress={() => setScreen('Home')}>
            <Text style={[styles.backButton, { color: theme.accent }]}>Voltar</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      {renderScreen()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: height * 0.075,
    paddingHorizontal: width * 0.07,
    marginBottom: height * 0.04,
  },
  meunome: {
    fontSize: width * 0.05,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    marginHorizontal: width * 0.05,
    borderRadius: 15,
    padding: height * 0.020,
    marginBottom: height * 0.025,
    borderWidth: 1,
  },
  card1: {
    marginHorizontal: width * 0.05,
    borderRadius: 15,
    padding: height * 0.025,
    marginBottom: height * 0.025,
    borderWidth: 1,
  },
  label: {
    fontSize: width * 0.04,
    marginBottom: 5,
    textAlign: 'center',
  },
  saldo: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  actionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    width: width * 0.2,
    marginHorizontal: -1,
    borderWidth: 1,
    left: 3.8,
  },
  buttonText: {
    marginTop: 8,
    fontWeight: '600',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
    minHeight: height,
  },
  screenTitle: {
    fontSize: width * 0.08,
    fontWeight: '700',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  backButton: {
    marginTop: height * 0.03,
    fontSize: width * 0.05,
    color: '#820ad1',
    fontWeight: 'bold',
  },
  iconcard: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -17.5,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
  },
  conversor: {
    fontSize: width * 0.05,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 10,
  },
  conversor2: {
    textAlign: 'center',
    marginBottom: height * 0.02,
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  pixInputContainer: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  pixInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  pixButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  pixBackButton: {
    marginTop: 10,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
  },
  chatInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});