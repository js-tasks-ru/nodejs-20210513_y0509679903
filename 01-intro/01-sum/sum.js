function sum(a, b) {
  if (!(isNaN(a) && isNaN(b)) && (typeof a === 'number' && typeof b === 'number')) {
    return a + b;
  }

  throw new TypeError('Arguments must be numbers.');
}

module.exports = sum;
