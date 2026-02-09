'use client';

import { useState } from 'react';
import { calculateAllDiameters, getFormulaInfo } from '@/lib/zscore';

type ResultsType = {
  bsa: number;
  sqrtBsa: number;
  weight: number;
  sqrtWeight: number;
  results: { [method: string]: { [valve: string]: number } };
  coefficients: { [method: string]: { [valve: string]: { intercept: number; slope: number } } };
} | null;

export default function Home() {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [results, setResults] = useState<ResultsType>(null);

  const methodNames: { [key: string]: string } = {
    'phn-lopez': 'PHN/Lopez',
    'pettersen': 'Pettersen 2008',
    'boston': 'Boston (BCH/Colan)',
    'cantinotti': 'Cantinotti (2014/2017)',
  };

  const valveNames: { [key: string]: string } = {
    'aortic': '大動脈弁',
    'mitral': '僧帽弁',
    'pulmonary': '肺動脈弁',
    'tricuspid': '三尖弁',
    'lpa': 'LPA',
    'rpa': 'RPA',
  };

  const handleCalculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      alert('有効な身長と体重を入力してください');
      return;
    }

    const calculatedResults = calculateAllDiameters(h, w);
    setResults(calculatedResults);
  };

  const handleReset = () => {
    setHeight('');
    setWeight('');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
            弁輪径計算ツール
          </h1>
          <p className="text-center text-sm text-gray-600 mb-8">
            弁輪径を計算します
          </p>

          <div className="space-y-5">
            {/* 入力フォーム */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 身長入力 */}
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                  身長 (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="例: 100.0"
                />
              </div>

              {/* 体重入力 */}
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  体重 (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="例: 15.0"
                />
              </div>
            </div>

            {/* ボタン */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCalculate}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                計算
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                リセット
              </button>
            </div>

            {/* 結果表示 */}
            {results && (
              <div className="mt-6 space-y-4">
                {/* 計算過程の表示 */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">計算過程</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <p>
                        <strong>身長:</strong> {height} cm
                      </p>
                      <p>
                        <strong>体重:</strong> {weight} kg
                      </p>
                      <p>
                        <strong>√体重:</strong> {results.sqrtWeight.toFixed(4)} kg<sup>0.5</sup>
                      </p>
                      <p>
                        <strong>BSA (Haycock式):</strong> {results.bsa.toFixed(4)} m²
                      </p>
                      <p className="md:col-span-2">
                        <strong>√BSA:</strong> {results.sqrtBsa.toFixed(4)} m²<sup>0.5</sup>
                      </p>
                    </div>
                    <div className="pt-2 border-t border-green-300">
                      <p className="text-xs text-gray-600">
                        BSA = 0.024265 × 身長<sup>0.3964</sup> × 体重<sup>0.5378</sup>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 計算式の説明 */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">使用する計算式</h3>
                  <div className="space-y-2">
                    {Object.keys(methodNames).map(method => {
                      const info = getFormulaInfo(method);
                      return (
                        <div key={method} className="text-sm">
                          <p className="font-semibold text-gray-800">{info.name}</p>
                          <p className="text-gray-600 ml-2">{info.formula}</p>
                          <p className="text-xs text-gray-500 ml-2">{info.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 結果テーブル */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">計算方法</th>
                        {Object.keys(valveNames).map(valve => (
                          <th key={valve} className="px-4 py-3 text-center text-sm font-semibold">
                            {valveNames[valve]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Object.keys(methodNames).map((method, idx) => (
                        <tr key={method} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {methodNames[method]}
                          </td>
                          {Object.keys(valveNames).map(valve => (
                            <td key={valve} className="px-4 py-3 text-center text-sm text-gray-700">
                              <span className="font-semibold text-blue-600">
                                {results.results[method][valve].toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">mm</span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 係数表示 */}
                <details className="bg-gray-50 rounded-lg border border-gray-300">
                  <summary className="px-4 py-3 cursor-pointer font-semibold text-gray-800 hover:bg-gray-100">
                    使用した係数の詳細を表示
                  </summary>
                  <div className="px-4 pb-4 space-y-3">
                    {Object.keys(methodNames).map(method => (
                      <div key={method} className="border-t border-gray-200 pt-3">
                        <h4 className="font-semibold text-gray-800 mb-2">{methodNames[method]}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                          {Object.keys(valveNames).map(valve => {
                            const coef = results.coefficients[method][valve];
                            const variable = method === 'phn-lopez' ? results.sqrtWeight : results.sqrtBsa;
                            const variableName = method === 'phn-lopez' ? '√体重' : '√BSA';
                            const calculation = method === 'pettersen'
                              ? `${coef.intercept.toFixed(2)} + ${coef.slope.toFixed(2)} × ${results.bsa.toFixed(4)}`
                              : `${coef.intercept.toFixed(2)} + ${coef.slope.toFixed(2)} × ${variable.toFixed(4)}`;

                            return (
                              <div key={valve} className="bg-white p-2 rounded border border-gray-200">
                                <p className="font-semibold text-gray-700">{valveNames[valve]}</p>
                                <p className="text-gray-600">
                                  intercept: {coef.intercept.toFixed(2)}
                                </p>
                                <p className="text-gray-600">
                                  slope: {coef.slope.toFixed(2)}
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                  = {calculation}
                                </p>
                                <p className="text-blue-600 font-semibold">
                                  = {results.results[method][valve].toFixed(2)} mm
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>

          {/* 注意書き */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>注意:</strong> この計算ツールは参考値です。実際の臨床判断には、必ず文献の原著や専門家の意見を参照してください。計算式の係数は一般的な値を使用しており、実際の臨床使用前に原著論文で確認する必要があります。
            </p>
          </div>

          {/* 参考文献 */}
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">参考文献</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-gray-800">PHN/Lopez</p>
                <p className="ml-4">
                  Lopez L, et al. Recommendations for quantification methods during the performance of a pediatric echocardiogram.{' '}
                  <a
                    href="https://pubmed.ncbi.nlm.nih.gov/20620859/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    J Am Soc Echocardiogr. 2010;23(5):465-95.
                  </a>
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Pettersen 2008</p>
                <p className="ml-4">
                  Pettersen MD, et al. Regression equations for calculation of z scores of cardiac structures in a large cohort of healthy infants, children, and adolescents.{' '}
                  <a
                    href="https://pubmed.ncbi.nlm.nih.gov/18559201/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    J Am Soc Echocardiogr. 2008;21(8):922-34.
                  </a>
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Boston (BCH/Colan)</p>
                <p className="ml-4">
                  Sluysmans T, Colan SD. Theoretical and empirical derivation of cardiovascular allometric relationships in children.{' '}
                  <a
                    href="https://pubmed.ncbi.nlm.nih.gov/15735044/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    J Appl Physiol. 2005;99(2):445-57.
                  </a>
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Cantinotti (2014/2017)</p>
                <p className="ml-4">
                  Cantinotti M, et al. Nomograms for two-dimensional echocardiography derived valvular and arterial dimensions in Caucasian children.{' '}
                  <a
                    href="https://pubmed.ncbi.nlm.nih.gov/28110790/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    J Cardiothorac Surg. 2017;12(1):11.
                  </a>
                </p>
                <p className="ml-4 mt-1">
                  Cantinotti M, et al. Echocardiographic nomograms for chamber diameters and areas in Caucasian children.{' '}
                  <a
                    href="https://pubmed.ncbi.nlm.nih.gov/25260402/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    J Am Soc Echocardiogr. 2014;27(12):1279-92.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
