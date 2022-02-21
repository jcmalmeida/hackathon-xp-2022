let json_data
let nome_Clientes
let dados_Cliente
let perfil_Investimentos
let nome_Cliente

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
  perfil_Investimentos = get_Perfil_Investimentos(dados_Cliente)

  //document.getElementById('text').innerHTML = perfil_Investimentos
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

function get_Perfil_Investimentos(dados_Cliente) {
  let indice_Banco = 0
  let bancos = []
  let investimentos_Banco1 = []; let investimentos_Banco2 = []
  let investimentos_Banco3 = []; let investimentos_Banco4 = []
  for(let i = 0; i < dados_Cliente['banks'].length; i++) {
    bancos.push(dados_Cliente['banks'][i]['institution']['bankId'])
  }

  investimentos_Banco1.push(bancos[indice_Banco])
  investimentos_Banco1.push(dados_Cliente['banks'][indice_Banco]['suitability'])
  investimentos_Banco1.push(dados_Cliente['banks'][indice_Banco]['saving']['balance'])
  let temp_calculo_Investimentos = calcula_Investimentos(indice_Banco)
  for(let i = 0; i < temp_calculo_Investimentos.length; i++) {
    investimentos_Banco1.push(temp_calculo_Investimentos[i])
  }
  console.log(investimentos_Banco1)
  
  indice_Banco = 1
  investimentos_Banco2.push(bancos[indice_Banco])
  investimentos_Banco2.push(dados_Cliente['banks'][indice_Banco]['suitability'])
  investimentos_Banco2.push(dados_Cliente['banks'][indice_Banco]['saving']['balance'])
  temp_calculo_Investimentos = calcula_Investimentos(indice_Banco)
  for(let i = 0; i < temp_calculo_Investimentos.length; i++) {
    investimentos_Banco2.push(temp_calculo_Investimentos[i])
  }
  console.log(investimentos_Banco2)

  indice_Banco = 2
  investimentos_Banco3.push(bancos[indice_Banco])
  investimentos_Banco3.push(dados_Cliente['banks'][indice_Banco]['suitability'])
  investimentos_Banco3.push(dados_Cliente['banks'][indice_Banco]['saving']['balance'])
  temp_calculo_Investimentos = calcula_Investimentos(indice_Banco)
  for(let i = 0; i < temp_calculo_Investimentos.length; i++) {
    investimentos_Banco3.push(temp_calculo_Investimentos[i])
  }
  console.log(investimentos_Banco3)

  indice_Banco = 3
  investimentos_Banco4.push(bancos[indice_Banco])
  investimentos_Banco4.push(dados_Cliente['banks'][indice_Banco]['suitability'])
  investimentos_Banco4.push(dados_Cliente['banks'][indice_Banco]['saving']['balance'])
  temp_calculo_Investimentos = calcula_Investimentos(indice_Banco)
  for(let i = 0; i < temp_calculo_Investimentos.length; i++) {
    investimentos_Banco4.push(temp_calculo_Investimentos[i])
  }
  console.log(investimentos_Banco4)

  return (investimentos_Banco1 + investimentos_Banco2 +
    investimentos_Banco3 + investimentos_Banco4)
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
