exports.randomNumberGen = (max, min = 1) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
