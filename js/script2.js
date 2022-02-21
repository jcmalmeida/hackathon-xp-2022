let json_data
let nome_Clientes
let dados_Cliente
let nome_Cliente
let investimentos_Banco1 = []
let investimentos_Banco2 = []
let investimentos_Banco3 = []
let investimentos_Banco4 = []

document.getElementById('card1').addEventListener('click', () => atualiza_dados_Banco1())
document.getElementById('card2').addEventListener('click', () => atualiza_dados_Banco2())
document.getElementById('card3').addEventListener('click', () => atualiza_dados_Banco3())
document.getElementById('card4').addEventListener('click', () => atualiza_dados_Banco4())

// Coleta parâmetro de nome do cliente passado via URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
nome_Cliente = urlParams.get('cliente')
console.log(nome_Cliente)

$.getJSON("mock2.json", function(data) {
  json_data = data
  console.log(json_data)
  nome_Clientes = get_Nome_Clientes()
  console.log(nome_Clientes)
  dados_Cliente = get_Localizacao_Cliente(nome_Cliente)

  let indice_Banco = 0
  investimentos_Banco1 = get_Perfil_Investimentos(dados_Cliente, indice_Banco)
  indice_Banco++
  investimentos_Banco2 = get_Perfil_Investimentos(dados_Cliente, indice_Banco)
  indice_Banco++
  investimentos_Banco3 = get_Perfil_Investimentos(dados_Cliente, indice_Banco)
  indice_Banco++
  investimentos_Banco4 = get_Perfil_Investimentos(dados_Cliente, indice_Banco)

  atualiza_Dados_Dashboard()
});

function get_Nome_Clientes() {
  let vetor_nomes = []
  for(let i = 0; i < json_data.length; i++) {
    vetor_nomes.push(json_data[i]['name'])
  }
  return vetor_nomes
}

function get_Localizacao_Cliente(nome_usuario) {
  let j
  for (j = 0; (j < json_data.length) && (json_data[j]['name'] != nome_usuario); j++) {
  }
  console.log(json_data[j])
  return json_data[j]
}

function get_Perfil_Investimentos(dados_Cliente, indice_Banco) {
  let bancos = []
  let investimentos_Banco = []
  for(let i = 0; i < dados_Cliente['banks'].length; i++) {
    bancos.push(dados_Cliente['banks'][i]['institution']['bankId'])
  }

  investimentos_Banco.push(bancos[indice_Banco])
  investimentos_Banco.push(dados_Cliente['banks'][indice_Banco]['suitability'])
  investimentos_Banco.push(dados_Cliente['banks'][indice_Banco]['saving']['balance'])
  let temp_calculo_Investimentos = calcula_Investimentos(indice_Banco)
  for(let i = 0; i < temp_calculo_Investimentos.length; i++) {
    investimentos_Banco.push(temp_calculo_Investimentos[i])
  }
  console.log(investimentos_Banco)

  return investimentos_Banco
}

function calcula_Investimentos(indice_Banco) {
  let investimentos_Banco = []
  let soma_investimentos = 0
  // Ações, CDB, LCI, LCA, CRI, CRA
  let investimentos1 = ['stocks', 'cdb', 'lci', 'lca', 'cri', 'cra']
  for(let i = 0; i < investimentos1.length; i++) {
    for(let j = 0; j < dados_Cliente['banks'][indice_Banco]['investments'][investimentos1[i]].length; j++) {
      soma_investimentos = soma_investimentos +
        dados_Cliente['banks'][indice_Banco]['investments'][investimentos1[i]][j]['volumn'] * 
          dados_Cliente['banks'][indice_Banco]['investments'][investimentos1[i]][j]['value']
    }
    investimentos_Banco.push(soma_investimentos)
    soma_investimentos = 0
  }

  soma_investimentos = 0
  // Fundos de investimentos - FIIs, renda fixa, renda variável, multimercado
  let investimentos2 = ['fii', 'renda-fixa', 'renda-variável', 'multimercado']
  for(let i = 0; i < investimentos2.length; i++) {
    for(let j = 0; j < dados_Cliente['banks'][indice_Banco]['investments']['investmentFunds'].length; j++) {
      if(dados_Cliente['banks'][indice_Banco]['investments']['investmentFunds'][j]['type'] == investimentos2[i]) {
        soma_investimentos = soma_investimentos +
          dados_Cliente['banks'][indice_Banco]['investments']['investmentFunds'][j]['volumn'] *
            dados_Cliente['banks'][indice_Banco]['investments']['investmentFunds'][j]['value'] 
      }
    }
    investimentos_Banco.push(soma_investimentos)
    soma_investimentos = 0
  }

  return investimentos_Banco
}

function atualiza_Dados_Dashboard() {
  document.getElementById('name').innerHTML = nome_Cliente
  document.getElementById('data-nascimento').innerHTML = ("Data de nascimento: " + dados_Cliente['bornDate'])
  document.getElementById('cpf').innerHTML = ("CPF: " + dados_Cliente['cpf'])
  document.getElementById('salario').innerHTML = ("Salário: " + parseFloat(dados_Cliente['salary']).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}))

  document.getElementById('agencia-conta-xp').innerHTML = ("Agência: " + dados_Cliente['banks'][0]['institution']['agency'] + "<br>" +
                                                              "Conta: " + dados_Cliente['banks'][0]['institution']['number'])
  let soma_investimentos = 0
  let soma_total_investimentos = 0
  for(let i = 2; i < investimentos_Banco1.length; i++){
    soma_investimentos = soma_investimentos + investimentos_Banco1[i]
  }
  document.getElementById('valor-xp').innerHTML = soma_investimentos.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
  soma_total_investimentos = soma_total_investimentos + soma_investimentos

  document.getElementById('agencia-conta-banco-a').innerHTML = ("Agência: " + dados_Cliente['banks'][1]['institution']['agency'] + "<br>" +
  "Conta: " + dados_Cliente['banks'][1]['institution']['number'])
  soma_investimentos = 0
  for(let i = 2; i < investimentos_Banco2.length; i++){
    soma_investimentos = soma_investimentos + investimentos_Banco2[i]
  }
  document.getElementById('valor-banco-a').innerHTML = soma_investimentos.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
  soma_total_investimentos = soma_total_investimentos + soma_investimentos

  document.getElementById('agencia-conta-banco-b').innerHTML = ("Agência: " + dados_Cliente['banks'][2]['institution']['agency'] + "<br>" +
  "Conta: " + dados_Cliente['banks'][2]['institution']['number'])
  soma_investimentos = 0
  for(let i = 2; i < investimentos_Banco1.length; i++){
    soma_investimentos = soma_investimentos + investimentos_Banco3[i]
  }
  document.getElementById('valor-banco-b').innerHTML = soma_investimentos.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
  soma_total_investimentos = soma_total_investimentos + soma_investimentos

  document.getElementById('agencia-conta-banco-c').innerHTML = ("Agência: " + dados_Cliente['banks'][3]['institution']['agency'] + "<br>" +
  "Conta: " + dados_Cliente['banks'][3]['institution']['number'])
  soma_investimentos = 0
  for(let i = 2; i < investimentos_Banco1.length; i++){
    soma_investimentos = soma_investimentos + investimentos_Banco4[i]
  }
  document.getElementById('valor-banco-c').innerHTML = soma_investimentos.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
  soma_total_investimentos = soma_total_investimentos + soma_investimentos

  //Soma total dos investimentos
  console.log(soma_total_investimentos.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}))

  let soma_total_investimentos_tipo = [0, 0, 0]
  let maior_investimento = investimentos_Banco1[2] + investimentos_Banco2[2] + investimentos_Banco3[2] + investimentos_Banco4[2]
  let indice_maior_investimento = 0
  for(let i = 2; i < investimentos_Banco1.length; i++) {
    soma_total_investimentos_tipo[i] = investimentos_Banco1[i] + investimentos_Banco2[i] + investimentos_Banco3[i] + investimentos_Banco4[i]
    if (soma_total_investimentos_tipo[i] > maior_investimento) {
      maior_investimento = soma_total_investimentos_tipo[i]
      indice_maior_investimento = i
    }
  }
  console.log(soma_total_investimentos_tipo)
  console.log(maior_investimento.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}))
  console.log(indice_maior_investimento)

  document.getElementById('percentual-principal-investimento').innerHTML =
    ("(" + (parseInt(maior_investimento / soma_total_investimentos * 100)) + "% dos investimentos)")
  switch(indice_maior_investimento) {
    case 2:
      document.getElementById('principal-investimento').innerHTML = "Poupança"
      break
    case 3:
      document.getElementById('principal-investimento').innerHTML = "Ações"
      break
    case 4:
      document.getElementById('principal-investimento').innerHTML = "CDB"
      break
    case 5:
      document.getElementById('principal-investimento').innerHTML = "LCI"
      break
    case 6:
      document.getElementById('principal-investimento').innerHTML = "LCA"
      break
    case 7:
      document.getElementById('principal-investimento').innerHTML = "CRI"
      break
    case 8:
      document.getElementById('principal-investimento').innerHTML = "CRA"
      break
    case 9:
      document.getElementById('principal-investimento').innerHTML = "FII's"
      break
    case 10:
      document.getElementById('principal-investimento').innerHTML = "Fundos de renda fixa"
      break
    case 11:
      document.getElementById('principal-investimento').innerHTML = "Fundos de renda variável"
      break
    case 12:
      document.getElementById('principal-investimento').innerHTML = "Fundos multimercado"
      break
}

document.getElementById('indice-suitability').innerHTML = investimentos_Banco1[1]
document.getElementById('poupanca').innerHTML = investimentos_Banco1[2].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
document.getElementById('acoes').innerHTML = investimentos_Banco1[3].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
document.getElementById('cdb').innerHTML = investimentos_Banco1[4].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
document.getElementById('lci').innerHTML = investimentos_Banco1[5].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
document.getElementById('lca').innerHTML = investimentos_Banco1[6].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
document.getElementById('cri').innerHTML = investimentos_Banco1[7].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
document.getElementById('cra').innerHTML = investimentos_Banco1[8].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
document.getElementById('fiis').innerHTML = investimentos_Banco1[9].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
document.getElementById('frf').innerHTML = investimentos_Banco1[10].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
document.getElementById('frv').innerHTML = investimentos_Banco1[11].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
document.getElementById('fmm').innerHTML = investimentos_Banco1[12].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
document.getElementById('card1').style.border = '4px solid #ffc709';
}

function atualiza_dados_Banco1() {
  if(investimentos_Banco1.length > 1) {
    document.getElementById('indice-suitability').innerHTML = investimentos_Banco1[1]
    document.getElementById('poupanca').innerHTML = investimentos_Banco1[2].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('acoes').innerHTML = investimentos_Banco1[3].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('cdb').innerHTML = investimentos_Banco1[4].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('lci').innerHTML = investimentos_Banco1[5].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('lca').innerHTML = investimentos_Banco1[6].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('cri').innerHTML = investimentos_Banco1[7].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('cra').innerHTML = investimentos_Banco1[8].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('fiis').innerHTML = investimentos_Banco1[9].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('frf').innerHTML = investimentos_Banco1[10].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('frv').innerHTML = investimentos_Banco1[11].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('fmm').innerHTML = investimentos_Banco1[12].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('card1').style.border = '4px solid #ffc709';
    document.getElementById('card2').style.border = 'none';
    document.getElementById('card3').style.border = 'none';
    document.getElementById('card4').style.border = 'none';
  }
}

function atualiza_dados_Banco2() {
  if(investimentos_Banco2.length > 1) {
    document.getElementById('indice-suitability').innerHTML = investimentos_Banco2[1]
    document.getElementById('poupanca').innerHTML = investimentos_Banco2[2].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('acoes').innerHTML = investimentos_Banco2[3].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('cdb').innerHTML = investimentos_Banco2[4].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('lci').innerHTML = investimentos_Banco2[5].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('lca').innerHTML = investimentos_Banco2[6].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('cri').innerHTML = investimentos_Banco2[7].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('cra').innerHTML = investimentos_Banco2[8].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('fiis').innerHTML = investimentos_Banco2[9].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('frf').innerHTML = investimentos_Banco2[10].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('frv').innerHTML = investimentos_Banco2[11].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('fmm').innerHTML = investimentos_Banco2[12].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('card1').style.border = 'none';
    document.getElementById('card2').style.border = '4px solid #ffc709';
    document.getElementById('card3').style.border = 'none';
    document.getElementById('card4').style.border = 'none';
  }
}

function atualiza_dados_Banco3() {
  if(investimentos_Banco3.length > 1) {
    document.getElementById('indice-suitability').innerHTML = investimentos_Banco3[1]
    document.getElementById('poupanca').innerHTML = investimentos_Banco3[2].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('acoes').innerHTML = investimentos_Banco3[3].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('cdb').innerHTML = investimentos_Banco3[4].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('lci').innerHTML = investimentos_Banco3[5].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('lca').innerHTML = investimentos_Banco3[6].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('cri').innerHTML = investimentos_Banco3[7].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('cra').innerHTML = investimentos_Banco3[8].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('fiis').innerHTML = investimentos_Banco3[9].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('frf').innerHTML = investimentos_Banco3[10].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('frv').innerHTML = investimentos_Banco3[11].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('fmm').innerHTML = investimentos_Banco3[12].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('card1').style.border = 'none';
    document.getElementById('card2').style.border = 'none';
    document.getElementById('card3').style.border = '4px solid #ffc709';
    document.getElementById('card4').style.border = 'none';
  }
}

function atualiza_dados_Banco4() {
  if(investimentos_Banco4.length > 1) {
    document.getElementById('indice-suitability').innerHTML = investimentos_Banco4[1]
    document.getElementById('poupanca').innerHTML = investimentos_Banco4[2].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('acoes').innerHTML = investimentos_Banco4[3].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('cdb').innerHTML = investimentos_Banco4[4].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('lci').innerHTML = investimentos_Banco4[5].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('lca').innerHTML = investimentos_Banco4[6].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('cri').innerHTML = investimentos_Banco4[7].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('cra').innerHTML = investimentos_Banco4[8].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('fiis').innerHTML = investimentos_Banco4[9].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('frf').innerHTML = investimentos_Banco4[10].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('frv').innerHTML = investimentos_Banco4[11].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('fmm').innerHTML = investimentos_Banco4[12].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    document.getElementById('card1').style.border = 'none';
    document.getElementById('card2').style.border = 'none';
    document.getElementById('card3').style.border = 'none';
    document.getElementById('card4').style.border = '4px solid #ffc709';
  }
}
