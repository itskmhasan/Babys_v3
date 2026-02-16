'use client';

import { useState } from 'react';
import { Calendar, HelpCircle, MessageCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const zodiacSigns = {
  0: { sign: 'Capricorn', symbol: '♑', traits: 'Responsible, disciplined, ambitious' },
  1: { sign: 'Aquarius', symbol: '♒', traits: 'Original, intellectual, humanitarian' },
  2: { sign: 'Pisces', symbol: '♓', traits: 'Compassionate, artistic, intuitive' },
  3: { sign: 'Aries', symbol: '♈', traits: 'Courageous, passionate, motivated' },
  4: { sign: 'Taurus', symbol: '♉', traits: 'Reliable, patient, practical' },
  5: { sign: 'Gemini', symbol: '♊', traits: 'Curious, outgoing, spontaneous' },
  6: { sign: 'Cancer', symbol: '♋', traits: 'Protective, loyal, emotional' },
  7: { sign: 'Leo', symbol: '♌', traits: 'Confident, generous, creative' },
  8: { sign: 'Virgo', symbol: '♍', traits: 'Analytical, practical, organized' },
  9: { sign: 'Libra', symbol: '♎', traits: 'Fair, social, thoughtful' },
  10: { sign: 'Scorpio', symbol: '♏', traits: 'Resourceful, brave, passionate' },
  11: { sign: 'Sagittarius', symbol: '♐', traits: 'Optimistic, adventurous, honest' },
};

const birthstones = {
  0: 'Garnet - Symbol of protection and prosperity',
  1: 'Amethyst - Symbol of peace and balance',
  2: 'Aquamarine - Symbol of calm and courage',
  3: 'Diamond - Symbol of strength and eternal love',
  4: 'Emerald - Symbol of rebirth and growth',
  5: 'Pearl - Symbol of purity and innocence',
  6: 'Ruby - Symbol of passion and vitality',
  7: 'Peridot - Symbol of peace and happiness',
  8: 'Sapphire - Symbol of wisdom and truth',
  9: 'Opal - Symbol of imagination and creativity',
  10: 'Topaz - Symbol of strength and protection',
  11: 'Blue Topaz - Symbol of peace and calmness',
};

const babyDevelopment = {
  0: { size: 'poppy seed', emoji: '🌱', details: 'Embryo is beginning to develop' },
  4: { size: 'apple seed', emoji: '🍎', details: 'Heart is starting to beat' },
  8: { size: 'grape', emoji: '🍇', details: 'Eyelids forming, limbs developing' },
  12: { size: 'plum', emoji: '🍑', details: 'Baby can make a fist, facial features forming' },
  16: { size: 'avocado', emoji: '🥑', details: 'Baby can move around, fingers and toes well defined' },
  20: { size: 'banana', emoji: '🍌', details: 'Baby can hear sounds, eyebrows and lashes appearing' },
  24: { size: 'corn cob', emoji: '🌽', details: 'Lungs beginning to develop, skin forming' },
  28: { size: 'eggplant', emoji: '🍆', details: 'Brain waves beginning, baby can open eyes' },
  32: { size: 'jicama', emoji: '🥔', details: 'Baby is settling into head-down position, bones hardening' },
  36: { size: 'papaya', emoji: '🧡', details: 'Baby is fully formed, just growing bigger' },
  40: { size: 'small pumpkin', emoji: '🎃', details: 'Baby is ready to be born!' },
};

export default function PregnancyCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [results, setResults] = useState(null);

  const getZodiacSign = (date) => {
    const month = date.getMonth();
    const day = date.getDate();

    if ((month === 0 && day <= 19) || (month === 11 && day >= 22)) return zodiacSigns[0];
    if ((month === 0 && day >= 20) || (month === 1 && day <= 18)) return zodiacSigns[1];
    if ((month === 1 && day >= 19) || (month === 2 && day <= 20)) return zodiacSigns[2];
    if ((month === 2 && day >= 21) || (month === 3 && day <= 19)) return zodiacSigns[3];
    if ((month === 3 && day >= 20) || (month === 4 && day <= 20)) return zodiacSigns[4];
    if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return zodiacSigns[5];
    if ((month === 5 && day >= 21) || (month === 6 && day <= 22)) return zodiacSigns[6];
    if ((month === 6 && day >= 23) || (month === 7 && day <= 22)) return zodiacSigns[7];
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[8];
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[9];
    if ((month === 9 && day >= 23) || (month === 10 && day <= 21)) return zodiacSigns[10];
    if ((month === 10 && day >= 22) || (month === 11 && day <= 21)) return zodiacSigns[11];
  };

  const getBabySize = (weeksPregnant) => {
    for (let i = 40; i >= 0; i -= 4) {
      if (weeksPregnant >= i && babyDevelopment[i]) {
        return babyDevelopment[i];
      }
    }
    return babyDevelopment[0];
  };

  const calculatePregnancy = (e) => {
    e.preventDefault();

    if (!lastPeriodDate) {
      alert('Please enter your last period date');
      return;
    }

    const lmpDate = new Date(lastPeriodDate);
    const today = new Date();

    // Calculate weeks pregnant
    const daysPregnant = Math.floor(
      (today - lmpDate) / (1000 * 60 * 60 * 24)
    );
    const weeksPregnant = Math.floor(daysPregnant / 7);
    const daysOfWeek = daysPregnant % 7;

    // Calculate estimated due date (280 days from LMP)
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280);

    // Calculate trimester info
    let trimester = 'Not pregnant';
    let trimesterStart = null;
    let trimesterEnd = null;

    if (weeksPregnant >= 1 && weeksPregnant <= 13) {
      trimester = 'First';
      trimesterStart = new Date(lmpDate);
      trimesterEnd = new Date(lmpDate);
      trimesterEnd.setDate(trimesterEnd.getDate() + 91);
    } else if (weeksPregnant > 13 && weeksPregnant <= 27) {
      trimester = 'Second';
      trimesterStart = new Date(lmpDate);
      trimesterStart.setDate(trimesterStart.getDate() + 92);
      trimesterEnd = new Date(lmpDate);
      trimesterEnd.setDate(trimesterEnd.getDate() + 189);
    } else if (weeksPregnant > 27) {
      trimester = 'Third';
      trimesterStart = new Date(lmpDate);
      trimesterStart.setDate(trimesterStart.getDate() + 190);
      trimesterEnd = dueDate;
    }

    // Calculate weeks until due date
    const weeksUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24 * 7));

    // Calculate progress percentage
    const progressPercentage = Math.min(
      Math.round((daysPregnant / 280) * 100),
      100
    );

    const zodiacInfo = getZodiacSign(dueDate);
    const babySize = getBabySize(weeksPregnant);

    setResults({
      weeksPregnant,
      daysOfWeek,
      dueDate,
      trimester,
      trimesterStart,
      trimesterEnd,
      weeksUntilDue,
      progressPercentage,
      daysPregnant,
      zodiacInfo,
      babySize,
      month: dueDate.toLocaleString('en-US', { month: 'long' }),
    });
  };

  const handleReset = () => {
    setLastPeriodDate('');
    setResults(null);
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Pregnancy Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate your due date and track your pregnancy journey
          </p>
        </div>

        {/* Input Section */}
        {!results && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-2xl mx-auto">
            <form onSubmit={calculatePregnancy}>
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Last Menstrual Period (LMP)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 text-pink-500 h-6 w-6" />
                  <input
                    type="date"
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                    className="w-full pl-14 pr-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600 flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-pink-500" />
                  <span>Enter the date of your last menstrual period to calculate your due date and current pregnancy stage.</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition transform hover:scale-105 shadow-lg"
                >
                  Calculate Due Date
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div>
            {/* Due Date Hero Section */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-2xl p-12 mb-12 text-white text-center">
              <p className="text-lg opacity-90 mb-3">Congratulations! Your due date is</p>
              <h2 className="text-6xl font-bold mb-3">
                {results.dueDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h2>
              <p className="text-xl opacity-90">
                You are currently <span className="font-bold">{results.weeksPregnant} weeks and {results.daysOfWeek} days</span> pregnant
              </p>
              <button
                onClick={handleReset}
                className="mt-6 bg-white text-pink-600 font-semibold py-2 px-6 rounded-lg hover:bg-pink-50 transition"
              >
                Recalculate
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Baby Development - HIGHLIGHTED AND ON TOP */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-2xl shadow-2xl p-8 border-2 border-orange-400">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-red-300 rounded-full blur-xl opacity-60 animate-pulse"></div>
                      <div className="relative bg-white rounded-full w-24 h-24 flex items-center justify-center text-6xl shadow-2xl border-4 border-orange-300">
                        {results.babySize.emoji}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Week {results.weeksPregnant} Development</h3>
                  </div>
                  <div className="bg-white rounded-lg p-6 mb-4">
                    <p className="text-2xl font-bold text-orange-600 mb-3">
                      Your baby is about the size of a {results.babySize.size}.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">{results.babySize.details}</p>
                    <Link
                      href={`#`}
                      className="text-orange-600 hover:text-orange-700 font-bold text-lg inline-block"
                    >
                      Learn more about week {results.weeksPregnant} →
                    </Link>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-10">Your Pregnancy Timeline</h3>
                  
                  {/* Timeline Visualization */}
                  <div className="mb-12">
                    {/* Progress Line */}
                    <div className="relative mb-16">
                      {/* Background line container */}
                      <div className="flex gap-0 h-3 rounded-full overflow-hidden bg-gray-300">
                        {/* First Trimester Progress */}
                        <div 
                          className="bg-pink-500 rounded-l-full transition-all duration-500"
                          style={{ width: `${results.trimester === 'First' ? Math.min((results.weeksPregnant / 13) * 100, 100) : 33.33}%` }}
                        />
                        
                        {/* Second Trimester Progress */}
                        <div 
                          className={`transition-all duration-500 ${results.trimester === 'Second' ? 'bg-pink-500' : 'bg-gray-300'}`}
                          style={{ 
                            width: '33.33%',
                            opacity: results.trimester === 'Second' || results.trimester === 'Third' ? 1 : 0.5
                          }}
                        />
                        
                        {/* Third Trimester Progress */}
                        <div 
                          className={`rounded-r-full transition-all duration-500 ${results.trimester === 'Third' ? 'bg-pink-500' : 'bg-gray-300'}`}
                          style={{ 
                            width: '33.33%',
                            opacity: results.trimester === 'Third' ? 1 : 0.5
                          }}
                        />
                      </div>
                      
                      {/* Current Position Marker */}
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-500"
                        style={{ 
                          left: `${results.trimester === 'First' 
                            ? (results.weeksPregnant / 13) * 33.33 
                            : results.trimester === 'Second' 
                            ? 33.33 + ((results.weeksPregnant - 14) / 14) * 33.33
                            : 66.66 + ((results.weeksPregnant - 28) / 12) * 33.33}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-lg flex items-center justify-center text-2xl border-4 border-white">
                            👶
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trimester Labels */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                      {/* First Trimester Label */}
                      <div className="text-center">
                        <h4 className={`font-bold text-lg mb-2 ${results.trimester === 'First' ? 'text-pink-600' : 'text-gray-600'}`}>
                          1st Trimester
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(results.dueDate.getTime() - 280 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                          {new Date(results.dueDate.getTime() - 189 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>

                      {/* Second Trimester Label */}
                      <div className="text-center">
                        <h4 className={`font-bold text-lg mb-2 ${results.trimester === 'Second' ? 'text-pink-600' : 'text-gray-600'}`}>
                          2nd Trimester
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(results.dueDate.getTime() - 189 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                          {new Date(results.dueDate.getTime() - 91 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>

                      {/* Third Trimester Label */}
                      <div className="text-center">
                        <h4 className={`font-bold text-lg mb-2 ${results.trimester === 'Third' ? 'text-pink-600' : 'text-gray-600'}`}>
                          3rd Trimester
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(results.dueDate.getTime() - 91 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                          {results.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Progress</p>
                      <p className="text-3xl font-bold text-pink-600">{results.progressPercentage}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Time Remaining</p>
                      <p className="text-3xl font-bold text-pink-600">{Math.max(0, results.weeksUntilDue)}w</p>
                    </div>
                  </div>
                </div>

                {/* Trimester Timeline */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Pregnancy Timeline</h3>
                  <div className="space-y-4">
                    {/* First Trimester */}
                    <div className={`p-4 rounded-lg border-2 ${results.trimester === 'First' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-bold text-lg ${results.trimester === 'First' ? 'text-pink-600' : 'text-gray-700'}`}>
                          1st Trimester
                        </h4>
                        <span className="text-sm font-semibold text-gray-600">Weeks 1-13</span>
                      </div>
                      <p className="text-gray-700 mb-2">
                        {new Date(results.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                        {new Date(results.dueDate.getTime() - 189 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600">Foundation of baby's development. Major organs forming.</p>
                    </div>

                    {/* Second Trimester */}
                    <div className={`p-4 rounded-lg border-2 ${results.trimester === 'Second' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-bold text-lg ${results.trimester === 'Second' ? 'text-pink-600' : 'text-gray-700'}`}>
                          2nd Trimester
                        </h4>
                        <span className="text-sm font-semibold text-gray-600">Weeks 14-27</span>
                      </div>
                      <p className="text-gray-700 mb-2">
                        {new Date(results.dueDate.getTime() - 189 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                        {new Date(results.dueDate.getTime() - 91 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600">Baby bump appears. You'll start feeling baby kicks!</p>
                    </div>

                    {/* Third Trimester */}
                    <div className={`p-4 rounded-lg border-2 ${results.trimester === 'Third' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-bold text-lg ${results.trimester === 'Third' ? 'text-pink-600' : 'text-gray-700'}`}>
                          3rd Trimester
                        </h4>
                        <span className="text-sm font-semibold text-gray-600">Weeks 28-40</span>
                      </div>
                      <p className="text-gray-700 mb-2">
                        {new Date(results.dueDate.getTime() - 91 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                        {results.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600">Final preparations. Baby is getting ready for birth!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Updated */}
              <div className="space-y-6">
                {/* Key Stats */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Statistics</h3>
                  <div className="border-b pb-4">
                    <p className="text-sm text-gray-600 mb-1">Current Trimester</p>
                    <p className="text-2xl font-bold text-pink-600">{results.trimester}</p>
                  </div>
                  <div className="border-b pb-4">
                    <p className="text-sm text-gray-600 mb-1">Days Pregnant</p>
                    <p className="text-2xl font-bold text-pink-600">{results.daysPregnant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Due Date In</p>
                    <p className="text-2xl font-bold text-pink-600">
                      {Math.max(0, results.weeksUntilDue)} weeks
                    </p>
                  </div>
                </div>

                {/* Pregnancy Milestones */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Important Milestones</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🩺</span>
                      <div>
                        <p className="font-semibold text-gray-900">First Trimester Screening</p>
                        <p className="text-sm text-gray-600">Weeks 11-13</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">👶</span>
                      <div>
                        <p className="font-semibold text-gray-900">Anatomy Scan</p>
                        <p className="text-sm text-gray-600">Weeks 18-22</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">❤️</span>
                      <div>
                        <p className="font-semibold text-gray-900">Third Trimester Monitoring</p>
                        <p className="text-sm text-gray-600">Week 28 onwards</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pregnancy Tips */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border border-purple-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Pregnancy Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Stay hydrated and get proper nutrition</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Exercise regularly with doctor's approval</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Attend prenatal appointments</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Get adequate sleep and rest</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Reduce stress and practice relaxation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Community & Resources Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Community Discussions */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="h-8 w-8 text-pink-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Community</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Join thousands of expectant mothers discussing pregnancy, symptoms, and tips with others due in {results.month} {results.dueDate.getFullYear()}.
                </p>
                <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition">
                  Join Community Discussions
                </button>
              </div>

              {/* Recommended Products */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBag className="h-8 w-8 text-pink-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Essential Products</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Explore prenatal vitamins, pregnancy pillows, maternity wear, and other essential products recommended for your pregnancy stage.
                </p>
                <Link href="/search?q=prenatal">
                  <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition">
                    Browse Pregnancy Products
                  </button>
                </Link>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Important Information</h3>
              <ul className="text-blue-800 space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold">•</span>
                  <span>This calculator is for informational purposes only and should not replace professional medical advice.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold">•</span>
                  <span>Only 1 in 20 babies are born on their actual due date. Normal pregnancies last 38-42 weeks.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold">•</span>
                  <span>Due dates calculated from Last Menstrual Period (LMP) may be adjusted after your first ultrasound.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold">•</span>
                  <span>Always consult with your healthcare provider for personalized pregnancy information and care.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
