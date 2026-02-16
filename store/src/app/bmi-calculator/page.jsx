'use client';

import { useState } from 'react';
import { Scale, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('metric'); // metric or imperial
  const [results, setResults] = useState(null);

  const calculateBMI = (e) => {
    e.preventDefault();

    if (!height || !weight) {
      alert('Please enter both height and weight');
      return;
    }

    let heightInMeters, weightInKg;

    if (unit === 'metric') {
      heightInMeters = parseFloat(height) / 100;
      weightInKg = parseFloat(weight);
    } else {
      // Convert imperial to metric (height in feet.inches, weight in lbs)
      const parts = height.split('.');
      const feet = parseFloat(parts[0]) || 0;
      const inches = parseFloat(parts[1]) || 0;
      const heightInCm = (feet * 12 + inches) * 2.54;
      heightInMeters = heightInCm / 100;
      weightInKg = parseFloat(weight) * 0.453592;
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);

    let category = '';
    let categoryColor = '';
    let recommendations = [];

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-blue-600';
      recommendations = [
        'Consult a healthcare provider for personalized nutrition plan',
        'Include more protein and healthy fats in your diet',
        'Engage in regular exercise to build muscle',
        'Ensure adequate calorie intake for your activities',
      ];
    } else if (bmi < 25) {
      category = 'Normal Weight';
      categoryColor = 'text-green-600';
      recommendations = [
        'Maintain your current healthy lifestyle',
        'Continue regular physical activity (150+ mins/week)',
        'Eat a balanced diet rich in fruits and vegetables',
        'Get 7-9 hours of quality sleep daily',
      ];
    } else if (bmi < 30) {
      category = 'Overweight';
      categoryColor = 'text-orange-600';
      recommendations = [
        'Gradually increase physical activity',
        'Reduce calorie intake by 500-750 calories daily',
        'Focus on portion control and healthy eating',
        'Consult a nutritionist for guidance',
      ];
    } else {
      category = 'Obese';
      categoryColor = 'text-red-600';
      recommendations = [
        'Consult a healthcare provider immediately',
        'Work with a registered dietitian for a meal plan',
        'Start with low-impact exercises like walking',
        'Consider joining a weight management program',
      ];
    }

    setResults({
      bmi: bmi.toFixed(1),
      category,
      categoryColor,
      recommendations,
      heightInMeters: heightInMeters.toFixed(2),
      weightInKg: weightInKg.toFixed(1),
    });
  };

  const handleReset = () => {
    setHeight('');
    setWeight('');
    setUnit('metric');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            BMI Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate your Body Mass Index and get personalized health recommendations
          </p>
        </div>

        {/* Input Section */}
        {!results && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-2xl mx-auto">
            <form onSubmit={calculateBMI}>
              {/* Unit Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Measurement Unit
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="unit"
                      value="metric"
                      checked={unit === 'metric'}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700 font-medium">Metric (cm, kg)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="unit"
                      value="imperial"
                      checked={unit === 'imperial'}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700 font-medium">Imperial (ft/in, lbs)</span>
                  </label>
                </div>
              </div>

              {/* Height Input */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Height {unit === 'metric' ? '(cm)' : '(feet.inches)'}
                </label>
                <div className="relative">
                  <Scale className="absolute left-4 top-4 text-blue-500 h-6 w-6" />
                  <input
                    type="number"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={unit === 'metric' ? '170' : '5.10'}
                    className="w-full pl-14 pr-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
              </div>

              {/* Weight Input */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
                </label>
                <div className="relative">
                  <Scale className="absolute left-4 top-4 text-blue-500 h-6 w-6" />
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={unit === 'metric' ? '70' : '150'}
                    className="w-full pl-14 pr-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600 flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-500" />
                  <span>Enter your accurate height and weight measurements for most accurate results.</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-xl transition transform hover:scale-105 shadow-lg"
                >
                  Calculate BMI
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div>
            {/* BMI Result Hero Section - International Standard Gauge */}
            <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl shadow-2xl p-12 mb-12">
              <div className="flex flex-col items-center">
                {/* Header */}
                <div className="text-center mb-12">
                  <p className="text-base text-gray-600 font-medium tracking-wide uppercase">Your BMI Result</p>
                  <h2 className="text-5xl font-bold text-gray-900 mt-2">
                    <span className="text-blue-600">{results.bmi}</span>
                    <span className="text-2xl text-gray-500 ml-2">kg/m²</span>
                  </h2>
                  <p className={`text-3xl font-bold mt-4 ${results.categoryColor}`}>
                    {results.category}
                  </p>
                </div>

                {/* Gauge */}
                <div className="w-full max-w-2xl flex justify-center mb-12">
                  <svg viewBox="0 0 500 280" width="100%" height="auto" className="drop-shadow-lg">
                    {/* Underweight Section - Blue */}
                    <path
                      d="M 50 250 A 200 200 0 0 1 120 70"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="35"
                      strokeLinecap="round"
                    />
                    
                    {/* Normal Weight Section - Green */}
                    <path
                      d="M 120 70 A 200 200 0 0 1 250 30"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="35"
                      strokeLinecap="round"
                    />
                    
                    {/* Overweight Section - Yellow */}
                    <path
                      d="M 250 30 A 200 200 0 0 1 380 70"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="35"
                      strokeLinecap="round"
                    />
                    
                    {/* Obese Section - Red */}
                    <path
                      d="M 380 70 A 200 200 0 0 1 450 250"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="35"
                      strokeLinecap="round"
                    />

                    {/* Center circle */}
                    <circle cx="250" cy="250" r="70" fill="white" stroke="#e5e7eb" strokeWidth="2" />

                    {/* Needle */}
                    <g transform={`rotate(${(parseFloat(results.bmi) - 10) * 4.5} 250 250)`}>
                      <line x1="250" y1="250" x2="250" y2="50" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
                      <circle cx="250" cy="250" r="10" fill="#1f2937" />
                    </g>

                    {/* BMI Value in Center */}
                    <text x="250" y="265" fontSize="48" fontWeight="bold" textAnchor="middle" fill="#1f2937">
                      {results.bmi}
                    </text>

                    {/* Category Labels with Ranges */}
                    {/* Underweight */}
                    <text x="70" y="295" fontSize="11" fontWeight="600" textAnchor="middle" fill="#1e40af">Underweight</text>
                    <text x="70" y="310" fontSize="10" textAnchor="middle" fill="#64748b">&lt;18.5</text>

                    {/* Normal */}
                    <text x="250" y="25" fontSize="11" fontWeight="600" textAnchor="middle" fill="#166534">Normal</text>
                    <text x="250" y="40" fontSize="10" textAnchor="middle" fill="#64748b">18.5-24.9</text>

                    {/* Overweight */}
                    <text x="430" y="295" fontSize="11" fontWeight="600" textAnchor="middle" fill="#b45309">Overweight</text>
                    <text x="430" y="310" fontSize="10" textAnchor="middle" fill="#64748b">25-29.9</text>

                    {/* Obese - positioned better */}
                    <text x="480" y="180" fontSize="11" fontWeight="600" textAnchor="middle" fill="#991b1b">Obese</text>
                    <text x="480" y="195" fontSize="10" textAnchor="middle" fill="#64748b">≥30</text>
                  </svg>
                </div>

                {/* BMI Categories Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
                  <div className={`p-4 rounded-xl text-center border-2 transition ${results.category === 'Underweight' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                    <p className="text-xs font-semibold text-gray-600 mb-1">UNDERWEIGHT</p>
                    <p className="text-lg font-bold text-blue-600">&lt;18.5</p>
                  </div>
                  
                  <div className={`p-4 rounded-xl text-center border-2 transition ${results.category === 'Normal Weight' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <p className="text-xs font-semibold text-gray-600 mb-1">NORMAL</p>
                    <p className="text-lg font-bold text-green-600">18.5-24.9</p>
                  </div>
                  
                  <div className={`p-4 rounded-xl text-center border-2 transition ${results.category === 'Overweight' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                    <p className="text-xs font-semibold text-gray-600 mb-1">OVERWEIGHT</p>
                    <p className="text-lg font-bold text-yellow-600">25-29.9</p>
                  </div>
                  
                  <div className={`p-4 rounded-xl text-center border-2 transition ${results.category === 'Obese' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                    <p className="text-xs font-semibold text-gray-600 mb-1">OBESE</p>
                    <p className="text-lg font-bold text-red-600">≥30</p>
                  </div>
                </div>

                {/* Recalculate Button */}
                <button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105 shadow-lg"
                >
                  Recalculate
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* BMI Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">BMI Categories</h3>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-2 ${results.category === 'Underweight' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg text-blue-600">Underweight</h4>
                          <p className="text-sm text-gray-600">BMI less than 18.5</p>
                        </div>
                        {results.category === 'Underweight' && <span className="text-3xl">✓</span>}
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border-2 ${results.category === 'Normal Weight' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg text-green-600">Normal Weight</h4>
                          <p className="text-sm text-gray-600">BMI 18.5 - 24.9</p>
                        </div>
                        {results.category === 'Normal Weight' && <span className="text-3xl">✓</span>}
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border-2 ${results.category === 'Overweight' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg text-orange-600">Overweight</h4>
                          <p className="text-sm text-gray-600">BMI 25 - 29.9</p>
                        </div>
                        {results.category === 'Overweight' && <span className="text-3xl">✓</span>}
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border-2 ${results.category === 'Obese' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg text-red-600">Obese</h4>
                          <p className="text-sm text-gray-600">BMI 30 or higher</p>
                        </div>
                        {results.category === 'Obese' && <span className="text-3xl">✓</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Measurements */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Measurements</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <p className="text-sm text-gray-600 mb-2">Height</p>
                      <p className="text-3xl font-bold text-blue-600">{results.heightInMeters}m</p>
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-6 border border-cyan-200">
                      <p className="text-sm text-gray-600 mb-2">Weight</p>
                      <p className="text-3xl font-bold text-cyan-600">{results.weightInKg}kg</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Recommendations */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 border border-blue-200 sticky top-22">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Recommendations</h4>
                  <ul className="space-y-3">
                    {results.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-blue-600 font-bold flex-shrink-0">→</span>
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Important Information</h3>
              <ul className="text-blue-800 space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold">•</span>
                  <span>BMI is a general screening tool and should not replace professional medical advice.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold">•</span>
                  <span>BMI may not accurately reflect body composition for athletes and people with significant muscle mass.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold">•</span>
                  <span>Consult a healthcare provider for personalized health and weight management advice.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold">•</span>
                  <span>Pregnant women should consult their healthcare provider, as BMI categories differ during pregnancy.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
