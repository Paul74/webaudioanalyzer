/*
Some code parts in this file are taken from Meyda project https://meyda.github.io/
MIT licence - Copyright (c) 2014 Hugh A. Rawlinson, Nevo Segal, Jakub Fiala
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function centroid(i, binsArray) {
  var numerator = 0;
  var denominator = 0;
  for (var k = 0; k < binsArray.length; k++) {
    numerator += Math.pow(k, i) * Math.abs(binsArray[k]);
    denominator += binsArray[k];
  }
  return numerator / denominator;
}


function flatness(binsArray) {
  var numerator = 0;
  var denominator = 0;
  for (var k = 0; k < binsArray.length; k++) {
    // avoiding log of 0
    if (binsArray[k]!==0){
    	numerator += Math.log(binsArray[k]);
    }
    denominator += binsArray[k];
  }
	//console.log(numerator + "/"+ denominator)
  return Math.exp(numerator / binsArray.length) *
      binsArray.length / denominator;
}


function slope(binsArray) {
//linear regression
  var ampSum = 0;
  var freqSum = 0;
  var freqs = new Float32Array(binsArray.length);
  var powFreqSum = 0;
  var ampFreqSum = 0;
  var result;

  for (var i = 0; i < binsArray.length; i++) {
    ampSum += binsArray[i];
    var curFreq = i * bandSize;// audioContext.sampleRate / analyserBars.fftSize;
    freqs[i] = curFreq;
    powFreqSum += curFreq * curFreq;
    freqSum += curFreq;
    ampFreqSum += curFreq * binsArray[i];
  }
  result = (binsArray.length * ampFreqSum - freqSum * ampSum) / (ampSum * (
        powFreqSum - Math.pow(freqSum, 2)));
  return parseFloat(Number(result).toFixed(10));
}


function rolloff(binsArray) {
  var ec = 0;
  for (var i = 0; i < binsArray.length; i++) {
    ec += binsArray[i];
  }
  var threshold = 0.99 * ec;
  var n = binsArray.length - 1;
  while (ec > threshold && n >= 0) {
    ec -= binsArray[n];
    --n;
  }
  return (n + 1) * bandSize;
}


function spread(binsArray){
	return Math.sqrt(mu(2, binsArray) - Math.pow(mu(1, binsArray), 2));
}


function skewness(binsArray) {
  var mu1 = mu(1, binsArray);
  var mu2 = mu(2, binsArray);
  var mu3 = mu(3, binsArray);
  var numerator = 2 * Math.pow(mu1, 3) - 3 * mu1 * mu2 + mu3;
  var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 3);
  return numerator / denominator;
}


function kurtosis(binsArray) {
  var mu1 = mu(1, binsArray);
  var mu2 = mu(2, binsArray);
  var mu3 = mu(3, binsArray);
  var mu4 = mu(4, binsArray);
  var numerator = -3 * Math.pow(mu1, 4) + 6 * mu1 * mu2 - 4 * mu1 * mu3 + mu4;
  var denominator = Math.pow(Math.sqrt(mu2 - Math.pow(mu1, 2)), 4);
  return numerator / denominator;	
}


function mu(i, amplitudeSpect) {
  var numerator = 0;
  var denominator = 0;
  for (var k = 0; k < amplitudeSpect.length; k++) {
    numerator += Math.pow(k, i) * Math.abs(amplitudeSpect[k]);
    denominator += amplitudeSpect[k];
  }
  return numerator / denominator;
}