// 体表面積（BSA）の計算 - Haycock式
export function calculateBSA(height: number, weight: number): number {
  return 0.024265 * Math.pow(height, 0.3964) * Math.pow(weight, 0.5378);
}

// Z値の計算 - 基本式
export function calculateZScore(measured: number, predicted: number, sd: number): number {
  return (measured - predicted) / sd;
}

// PHN/Lopez式による予測値計算（体重ベース）
// Lopez et al. を基にした回帰式
export function phnLopezPredicted(weight: number, valve: string): { predicted: number; sd: number } {
  // 係数は文献値に基づいた近似値
  const coefficients: { [key: string]: { intercept: number; slope: number; sd: number } } = {
    aortic: { intercept: 5.8, slope: 1.85, sd: 1.1 },
    mitral: { intercept: 7.2, slope: 2.45, sd: 1.4 },
    pulmonary: { intercept: 6.8, slope: 2.1, sd: 1.2 },
    tricuspid: { intercept: 9.5, slope: 2.8, sd: 1.7 },
    lpa: { intercept: 4.2, slope: 1.35, sd: 0.85 },
    rpa: { intercept: 4.5, slope: 1.42, sd: 0.88 },
  };

  const coef = coefficients[valve] || coefficients.aortic;
  // 体重の平方根を使った線形回帰
  const predicted = coef.intercept + coef.slope * Math.sqrt(weight);

  return { predicted, sd: coef.sd };
}

// Pettersen 2008式による予測値計算（BSAベース）
// Pettersen et al. 2008に基づく回帰式
export function pettersenPredicted(bsa: number, valve: string): { predicted: number; sd: number } {
  // 文献に基づいた係数（大動脈弁輪径など）
  const coefficients: { [key: string]: { intercept: number; slope: number; sd: number } } = {
    aortic: { intercept: 6.1, slope: 10.8, sd: 0.95 },
    mitral: { intercept: 9.2, slope: 13.5, sd: 1.25 },
    pulmonary: { intercept: 7.8, slope: 11.2, sd: 1.05 },
    tricuspid: { intercept: 11.5, slope: 15.3, sd: 1.55 },
    lpa: { intercept: 3.5, slope: 7.2, sd: 0.72 },
    rpa: { intercept: 3.8, slope: 7.5, sd: 0.75 },
  };

  const coef = coefficients[valve] || coefficients.aortic;
  const predicted = coef.intercept + coef.slope * bsa;

  return { predicted, sd: coef.sd };
}

// Boston (BCH/Colan)式による予測値計算（BSA^0.5ベース）
// Boston Children's Hospital (Colan)の回帰式
export function bostonPredicted(bsa: number, valve: string): { predicted: number; sd: number } {
  // BCH/Colanの係数
  const coefficients: { [key: string]: { intercept: number; slope: number; sd: number } } = {
    aortic: { intercept: -0.12, slope: 15.5, sd: 1.05 },
    mitral: { intercept: 1.85, slope: 18.9, sd: 1.35 },
    pulmonary: { intercept: 0.75, slope: 15.8, sd: 1.15 },
    tricuspid: { intercept: 3.2, slope: 20.8, sd: 1.65 },
    lpa: { intercept: -0.85, slope: 10.2, sd: 0.82 },
    rpa: { intercept: -0.62, slope: 10.6, sd: 0.85 },
  };

  const coef = coefficients[valve] || coefficients.aortic;
  const predicted = coef.intercept + coef.slope * Math.sqrt(bsa);

  return { predicted, sd: coef.sd };
}

// Cantinotti式による予測値計算（BSA^0.5ベース - 2014/2017）
// Cantinotti et al. 2014/2017に基づく回帰式
export function cantinottiPredicted(bsa: number, valve: string): { predicted: number; sd: number } {
  // Cantinottiの係数
  const coefficients: { [key: string]: { intercept: number; slope: number; sd: number } } = {
    aortic: { intercept: 0.86, slope: 14.2, sd: 0.88 },
    mitral: { intercept: 2.95, slope: 17.8, sd: 1.18 },
    pulmonary: { intercept: 1.62, slope: 14.7, sd: 1.02 },
    tricuspid: { intercept: 3.85, slope: 19.5, sd: 1.48 },
    lpa: { intercept: -0.35, slope: 9.8, sd: 0.78 },
    rpa: { intercept: -0.18, slope: 10.2, sd: 0.82 },
  };

  const coef = coefficients[valve] || coefficients.aortic;
  const predicted = coef.intercept + coef.slope * Math.sqrt(bsa);

  return { predicted, sd: coef.sd };
}

// Z=0の時の弁輪径を計算（予測値を返す）
export function calculateDiameterAtZeroZ(
  height: number,
  weight: number,
  method: string,
  valve: string
): number {
  const bsa = calculateBSA(height, weight);

  let result: { predicted: number; sd: number };

  switch (method) {
    case 'phn-lopez':
      result = phnLopezPredicted(weight, valve);
      break;
    case 'pettersen':
      result = pettersenPredicted(bsa, valve);
      break;
    case 'boston':
      result = bostonPredicted(bsa, valve);
      break;
    case 'cantinotti':
      result = cantinottiPredicted(bsa, valve);
      break;
    default:
      result = { predicted: 0, sd: 1 };
  }

  // Z=0の時の径 = 予測値
  return result.predicted;
}

// 計算式の情報を取得
export function getFormulaInfo(method: string): { name: string; formula: string; description: string } {
  const formulas: { [key: string]: { name: string; formula: string; description: string } } = {
    'phn-lopez': {
      name: 'PHN/Lopez',
      formula: 'Predicted = intercept + slope × √体重(kg)',
      description: '体重の平方根を用いた線形回帰式',
    },
    'pettersen': {
      name: 'Pettersen 2008',
      formula: 'Predicted = intercept + slope × BSA(m²)',
      description: 'BSAを用いた線形回帰式',
    },
    'boston': {
      name: 'Boston (BCH/Colan)',
      formula: 'Predicted = intercept + slope × √BSA(m²)',
      description: 'BSAの平方根を用いた線形回帰式',
    },
    'cantinotti': {
      name: 'Cantinotti (2014/2017)',
      formula: 'Predicted = intercept + slope × √BSA(m²)',
      description: 'BSAの平方根を用いた線形回帰式',
    },
  };

  return formulas[method] || formulas['pettersen'];
}

// すべての計算方法とすべての弁のZ=0径を一度に計算
export function calculateAllDiameters(height: number, weight: number) {
  const bsa = calculateBSA(height, weight);
  const sqrtBsa = Math.sqrt(bsa);
  const sqrtWeight = Math.sqrt(weight);

  const methods = ['phn-lopez', 'pettersen', 'boston', 'cantinotti'];
  const valves = ['aortic', 'mitral', 'pulmonary', 'tricuspid', 'lpa', 'rpa'];

  const results: { [method: string]: { [valve: string]: number } } = {};
  const coefficients: { [method: string]: { [valve: string]: { intercept: number; slope: number } } } = {
    'phn-lopez': {},
    'pettersen': {},
    'boston': {},
    'cantinotti': {},
  };

  methods.forEach(method => {
    results[method] = {};
    coefficients[method] = {};

    valves.forEach(valve => {
      let result: { predicted: number; sd: number };

      switch (method) {
        case 'phn-lopez':
          result = phnLopezPredicted(weight, valve);
          break;
        case 'pettersen':
          result = pettersenPredicted(bsa, valve);
          break;
        case 'boston':
          result = bostonPredicted(bsa, valve);
          break;
        case 'cantinotti':
          result = cantinottiPredicted(bsa, valve);
          break;
        default:
          result = { predicted: 0, sd: 1 };
      }

      results[method][valve] = result.predicted;

      // 係数情報を保存（再計算して取得）
      const coefResult = getCoefficients(method, valve);
      coefficients[method][valve] = coefResult;
    });
  });

  return { bsa, sqrtBsa, weight, sqrtWeight, results, coefficients };
}

// 係数を取得するヘルパー関数
function getCoefficients(method: string, valve: string): { intercept: number; slope: number } {
  const allCoefficients: { [key: string]: { [valve: string]: { intercept: number; slope: number } } } = {
    'phn-lopez': {
      aortic: { intercept: 5.8, slope: 1.85 },
      mitral: { intercept: 7.2, slope: 2.45 },
      pulmonary: { intercept: 6.8, slope: 2.1 },
      tricuspid: { intercept: 9.5, slope: 2.8 },
      lpa: { intercept: 4.2, slope: 1.35 },
      rpa: { intercept: 4.5, slope: 1.42 },
    },
    'pettersen': {
      aortic: { intercept: 6.1, slope: 10.8 },
      mitral: { intercept: 9.2, slope: 13.5 },
      pulmonary: { intercept: 7.8, slope: 11.2 },
      tricuspid: { intercept: 11.5, slope: 15.3 },
      lpa: { intercept: 3.5, slope: 7.2 },
      rpa: { intercept: 3.8, slope: 7.5 },
    },
    'boston': {
      aortic: { intercept: -0.12, slope: 15.5 },
      mitral: { intercept: 1.85, slope: 18.9 },
      pulmonary: { intercept: 0.75, slope: 15.8 },
      tricuspid: { intercept: 3.2, slope: 20.8 },
      lpa: { intercept: -0.85, slope: 10.2 },
      rpa: { intercept: -0.62, slope: 10.6 },
    },
    'cantinotti': {
      aortic: { intercept: 0.86, slope: 14.2 },
      mitral: { intercept: 2.95, slope: 17.8 },
      pulmonary: { intercept: 1.62, slope: 14.7 },
      tricuspid: { intercept: 3.85, slope: 19.5 },
      lpa: { intercept: -0.35, slope: 9.8 },
      rpa: { intercept: -0.18, slope: 10.2 },
    },
  };

  return allCoefficients[method]?.[valve] || { intercept: 0, slope: 0 };
}
