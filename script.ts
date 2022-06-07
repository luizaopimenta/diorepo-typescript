interface Veiculo{
    nome: String;
    placa: String;
    entrada: any | String;
}

(function() {
    const $ = (query: string) : HTMLInputElement | null => document.querySelector(query);
    function patio(){
        function ler() : Veiculo[]{
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos: Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo:Veiculo, salva?: boolean){
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class="delete" data-placa="${veiculo.placa}"> X </button>
            </td>
            `;
            $("#patio")?.appendChild(row);

            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa);
            });

            if(salva){ 
                salvar([...ler(), veiculo]);
            }

        }

        function calcTemp(mil: number){
            const min = Math.floor(mil/60000);
            const sec = Math.floor((mil%60000) /1000);
            return `${min}m e ${sec}s`;
        }
        
        function remover(placa: string){
            const {entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            const tempo = calcTemp( new Date().getTime() - new Date(entrada).getTime() );
            if(confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)){
                salvar(ler().filter(veiculo=> veiculo.placa !== placa));
                render();
            }else{
                return;
            }
        }
        
        function render(){

            $("#patio")!.innerHTML = "";
            const patio = ler();
            if(patio.length){
               patio.forEach((veiculo) => adicionar(veiculo));
            }

        }
        return{ler, adicionar, remover, salvar, render}
    }

    patio().render();
    $("#cadastrar")?.addEventListener("click", () =>{
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        if(!nome || !placa){
            alert("Nome ou placa são obrigatórios!");
            return;
        }

        patio().adicionar({nome, placa, entrada: new Date().toISOString() }, true)
       
    })
})();