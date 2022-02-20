let json_data
let nome_Clientes
let dados_Cliente
let perfil_Investimentos

$.getJSON("mock2.json", function(data) {
  json_data = data
  console.log(json_data)
  nome_Clientes = get_Nome_Clientes()
  console.log(nome_Clientes)
  mostrar_Nomes_Clientes(nome_Clientes)

  //document.getElementById('text').innerHTML = perfil_Investimentos
});

function get_Nome_Clientes() {
  let vetor_nomes = []
  for(let i = 0; i < json_data.length; i++) {
    vetor_nomes.push(json_data[i]['name'])
  }
  return vetor_nomes
}

function mostrar_Nomes_Clientes(nome_Clientes) {
  for(let i = 0; i < nome_Clientes.length; i++) {
    const node = document.createElement("option")
    const textnode = document.createTextNode(nome_Clientes[i])
    node.appendChild(textnode);
    node.setAttribute('value', nome_Clientes[i])
    document.getElementById('cliente').appendChild(node);
  }
  console.log(document.getElementById('cliente'))
}