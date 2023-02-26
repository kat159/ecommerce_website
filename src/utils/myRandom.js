export default {
  randomElementFromArray: (array, elementCount=1, randomCount=false) => {
    if (randomCount) {
      elementCount = Math.floor(Math.random() * array.length) + 1;
    }
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(elementCount, shuffled.length));
  },
}
