import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: '1pt solid #e2e8f0',
    paddingBottom: 15,
  },
  logoContainer: {
    flexDirection: 'column',
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  logoAi: {
    color: '#10b981',
  },
  logoSubtitle: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
    width: '50%',
  },
  section: {
    marginBottom: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1e293b',
    backgroundColor: '#f1f5f9',
    padding: 5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 2,
    color: '#334155',
  },
  text: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#475569',
    marginBottom: 5,
  },
  law: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#64748b',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    textAlign: 'center',
    color: '#94a3b8',
    borderTop: '1pt solid #cbd5e1',
    paddingTop: 5,
  }
});

export const MilitaryGuidePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoTitle}>jurun<Text style={styles.logoAi}>.ai</Text></Text>
          <Text style={styles.logoSubtitle}>a Justiça tá AI</Text>
        </View>
        <Text style={styles.header}>Guia Prático: Procedimentos e Direitos do Militar</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.title}>1. Ordens Superiores e Ilegalidade Manifesta</Text>
        <Text style={styles.subtitle}>Procedimento:</Text>
        <Text style={styles.text}>O militar deve obediencia as ordens superiores, exceto quando forem manifestamente ilegais ou criminosas. Caso receba uma ordem com indicio de ilegalidade, deve solicitar que seja dada por escrito para resguardar sua responsabilidade.</Text>
        <Text style={styles.subtitle}>Amparo Legal:</Text>
        <Text style={styles.law}>- Estatuto dos Militares (Lei 6.880/80), Art. 38, par. 2.</Text>
        <Text style={styles.law}>- Codigo Penal Militar (CPM), Art. 38, par. 2.</Text>
        <Text style={styles.law}>- Constituicao Federal (CF), Art. 5, II (Principio da Legalidade).</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>2. Punicoes Disciplinares e Ampla Defesa</Text>
        <Text style={styles.subtitle}>Procedimento:</Text>
        <Text style={styles.text}>Nenhuma punicao disciplinar pode ser aplicada sem que seja garantido o direito previo de defesa (FATD/FAD/DRD). O militar nao deve assinar concordancia com punicoes sem antes exercer seu direito de apresentar justificativa por escrito no prazo regulamentar.</Text>
        <Text style={styles.subtitle}>Amparo Legal:</Text>
        <Text style={styles.law}>- Constituicao Federal, Art. 5, LV (Aos litigantes, em processo judicial ou administrativo, sao assegurados o contraditorio e ampla defesa).</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>3. Prisao Disciplinar e Habeas Corpus</Text>
        <Text style={styles.subtitle}>Procedimento:</Text>
        <Text style={styles.text}>Embora a CF vede Habeas Corpus para punicoes disciplinares, o STF firmou entendimento de que o HC e cabivel para questionar a LEGALIDADE da prisao (competencia da autoridade, formalidade do ato, tempo de prisao e previsao legal), mas nao o merito da punicao.</Text>
        <Text style={styles.subtitle}>Amparo Legal:</Text>
        <Text style={styles.law}>- Constituicao Federal, Art. 142, par. 2.</Text>
        <Text style={styles.law}>- Jurisprudencia do STF (Sumula 694 e jurisprudencia pacificada sobre controle de legalidade).</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>4. Acidente de Servico e Doencas Ocupacionais</Text>
        <Text style={styles.subtitle}>Procedimento:</Text>
        <Text style={styles.text}>Em caso de lesao ou doenca adquirida em decorrencia do servico, o militar deve requerer IMEDIATAMENTE a lavratura do Atestado de Origem (AO) ou a instauracao de Inquerito Sanitario de Origem (ISO). Isso garante direitos futuros como reforma com proventos integrais ou de grau hierarquico superior.</Text>
        <Text style={styles.subtitle}>Amparo Legal:</Text>
        <Text style={styles.law}>- Estatuto dos Militares, Art. 108, incisos III e IV (Incapacidade definitiva).</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>5. Transferencias e Protecao a Familia</Text>
        <Text style={styles.subtitle}>Procedimento:</Text>
        <Text style={styles.text}>Movimentacoes ex officio que prejudiquem gravemente o tratamento de saude do militar ou de seus dependentes podem ser suspensas ou anuladas via requerimento administrativo ou acao judicial, mediante comprovacao por junta medica.</Text>
        <Text style={styles.subtitle}>Amparo Legal:</Text>
        <Text style={styles.law}>- Estatuto dos Militares, Art. 50, alinea 'e'.</Text>
        <Text style={styles.law}>- Constituicao Federal, Art. 226 (A familia e base da sociedade e tem especial protecao do Estado).</Text>
      </View>

      <Text style={styles.footer}>
        Este documento e um resumo orientativo gerado por jurun.ai e nao substitui a consulta formal a um advogado especialista em Direito Militar ou a assessoria juridica da sua Organizacao Militar.
      </Text>
    </Page>
  </Document>
);
