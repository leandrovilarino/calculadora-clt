'use client';

import { useState } from 'react';

export default function CalculadoraCLT() {
  const [salario, setSalario] = useState<string>('');
  const [valeRefeicao, setValeRefeicao] = useState<string>('');
  const [valeTransporte, setValeTransporte] = useState<string>('');
  const [percentualVR, setPercentualVR] = useState<string>('');
  const [isSimples, setIsSimples] = useState<boolean>(false);
  const [percentualSistemaS, setPercentualSistemaS] = useState<string>('');
  const [percentualRat, setPercentualRat] = useState<string>('');
  const [percentualEducacao, setPercentualEducacao] = useState<string>('');

  const calcularINSS = (salario: number): number => {
    if (salario <= 1412.00) return salario * 0.075;
    if (salario <= 2666.68) return (salario * 0.09) - 21.18;
    if (salario <= 4000.03) return (salario * 0.12) - 101.18;
    if (salario <= 7786.02) return (salario * 0.14) - 181.18;
    return 877.22;
  };

  const calcularIRRF = (salario: number, inss: number): number => {
    const base = salario - inss;
    if (base <= 2112.00) return 0;
    if (base <= 2826.65) return (base * 0.075) - 158.40;
    if (base <= 3751.05) return (base * 0.15) - 370.40;
    if (base <= 4664.68) return (base * 0.225) - 651.73;
    return (base * 0.275) - 884.96;
  };

  const calcularCustos = () => {
    const salarioBase = Number(salario);
    const vrDiario = Number(valeRefeicao);
    const vtDiario = Number(valeTransporte);
    const percentVR = Number(percentualVR);

    // Encargos patronais
    const inssPatronal = isSimples ? 0 : salarioBase * 0.20;
    const sistemaS = isSimples ? 0 : salarioBase * (Number(percentualSistemaS) / 100 || 0);
    const salarioEducacao = isSimples ? 0 : salarioBase * (Number(percentualEducacao) / 100 || 0);
    const rat = isSimples ? 0 : salarioBase * (Number(percentualRat) / 100 || 0);
    const fgts = salarioBase * 0.08;
    const multaFGTS = (salarioBase * 0.08) * 0.5;
    
    // Total Encargos
    const totalEncargos = inssPatronal + sistemaS + salarioEducacao + rat + fgts + multaFGTS;
    
    // Provisões
    const provisoes = salarioBase * (1/12 + 1/12 + 1/36);
    
    // Benefícios
    const custoVR = (vrDiario * 22) * (1 - percentVR/100);
    const custoVT = Math.min(vtDiario * 22, salarioBase * 0.06);

    // Descontos do funcionário
    const inss = calcularINSS(salarioBase);
    const irrf = calcularIRRF(salarioBase, inss);
    const descontoVR = (vrDiario * 22) * (percentVR/100);
    const descontoVT = Math.min(vtDiario * 22, salarioBase * 0.06);
    const salarioLiquido = salarioBase - inss - irrf - descontoVR - descontoVT;

    const totalBeneficios = custoVR + custoVT;
    
    return {
      salarioBase,
      inss,
      irrf,
      descontoVR,
      descontoVT,
      salarioLiquido,
      inssPatronal,
      sistemaS,
      salarioEducacao,
      rat,
      fgts,
      multaFGTS,
      totalEncargos,
      provisoes,
      totalBeneficios,
      custoTotal: salarioBase + totalEncargos + provisoes + totalBeneficios
    };
  };

  const custos = salario ? calcularCustos() : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">Calculadora CLT 2024</h1>
      
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isSimples}
            onChange={(e) => setIsSimples(e.target.checked)}
            className="mr-2"
          />
          <span>Empresa do Simples Nacional</span>
        </label>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block mb-2">Salário Base (R$)</label>
          <input
            type="number"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Vale Refeição Diário (R$)</label>
          <input
            type="number"
            value={valeRefeicao}
            onChange={(e) => setValeRefeicao(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">% Desconto VR do funcionário</label>
          <input
            type="number"
            value={percentualVR}
            onChange={(e) => setPercentualVR(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Vale Transporte Diário (R$)</label>
          <input
            type="number"
            value={valeTransporte}
            onChange={(e) => setValeTransporte(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {!isSimples && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold mb-4">Percentuais de Encargos:</h3>
            
            <div>
              <label className="block mb-2">Sistema S (%)</label>
              <input
                type="number"
                value={percentualSistemaS}
                onChange={(e) => setPercentualSistemaS(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Ex: 3.35"
              />
            </div>

            <div>
              <label className="block mb-2">RAT/SAT (%)</label>
              <input
                type="number"
                value={percentualRat}
                onChange={(e) => setPercentualRat(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Ex: 1, 2 ou 3"
              />
            </div>

            <div>
              <label className="block mb-2">Salário Educação (%)</label>
              <input
                type="number"
                value={percentualEducacao}
                onChange={(e) => setPercentualEducacao(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Ex: 2.5"
              />
            </div>
          </div>
        )}
      </div>

      {custos && (
        <div className="mt-8 space-y-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Resumo para o Funcionário:</h3>
            <div className="space-y-3">
              <p>Salário Base: R$ {custos.salarioBase.toFixed(2)}</p>
              <p>Desconto INSS: R$ {custos.inss.toFixed(2)}</p>
              <p>Desconto IRRF: R$ {custos.irrf.toFixed(2)}</p>
              <p>Desconto VR: R$ {custos.descontoVR.toFixed(2)}</p>
              <p>Desconto VT: R$ {custos.descontoVT.toFixed(2)}</p>
              <p className="font-bold text-lg">Salário Líquido: R$ {custos.salarioLiquido.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Custos para a Empresa:</h3>
            <p className="mb-3">Salário Base: R$ {custos.salarioBase.toFixed(2)}</p>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Encargos {isSimples ? '(Simples Nacional)' : ''}:</h4>
              {!isSimples && (
                <div className="space-y-3">
                  <p>INSS Patronal (20%): R$ {custos.inssPatronal.toFixed(2)}</p>
                  <p>Sistema S ({percentualSistemaS}%): R$ {custos.sistemaS.toFixed(2)}</p>
                  <p>Salário Educação ({percentualEducacao}%): R$ {custos.salarioEducacao.toFixed(2)}</p>
                  <p>RAT/SAT ({percentualRat}%): R$ {custos.rat.toFixed(2)}</p>
                </div>
              )}
              <p className="mt-3">FGTS (8%): R$ {custos.fgts.toFixed(2)}</p>
              <p className="mb-3">Provisão Multa FGTS (4%): R$ {custos.multaFGTS.toFixed(2)}</p>
              <p className="font-semibold">Total Encargos: R$ {custos.totalEncargos.toFixed(2)}</p>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Provisões:</h4>
              <p>13º, Férias e 1/3: R$ {custos.provisoes.toFixed(2)}</p>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Benefícios:</h4>
              <p>VR e VT: R$ {custos.totalBeneficios.toFixed(2)}</p>
            </div>
            
            <div className="mt-8 space-y-3 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold">Resumo dos Custos para Empresa:</h4>
              <p>Total Salário Base: R$ {custos.salarioBase.toFixed(2)}</p>
              <p>Total Encargos: R$ {custos.totalEncargos.toFixed(2)}</p>
              <p>Total Provisões: R$ {custos.provisoes.toFixed(2)}</p>
              <p>Total Benefícios: R$ {custos.totalBeneficios.toFixed(2)}</p>
              <p className="text-xl font-bold pt-3 border-t">
                Custo Total: R$ {custos.custoTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-gray-600 border-t pt-6">
        <p>Desenvolvido pela equipe de IA da Sanville Contabilidade</p>
        <p className="text-sm mt-2">© {new Date().getFullYear()} Sanville Contabilidade</p>
      </footer>
    </div>
  );
}