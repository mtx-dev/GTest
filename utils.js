/**
 Utils
 */

function deleteText(text, delWord) {
  if (!text.includes(delWord)) return 'This text not exist';
  let pos = 0;
  let counter = 0;
  while (pos !== -1) {
    pos = text.indexOf(delWord, pos + 1);
    counter++;
  }
  let result = `Delete "${delWord}" - ${counter} entries\n\n`;
  result += `${text.split(delWord).join()}\n`;
  return result;
}

function countWords(text, nWord) {
  const wordsArr = text.match(/[^_\W]+/g);
  let result = `There are ${wordsArr.length} words in text \n`;
  if (nWord) {
    const strNWords = wordsArr.filter((item, index) => !index % nWord === 0);
    result += `There are each ${nWord}-th word of text (${strNWords.length} items): \n`;
    result += `${strNWords.join(', ')}\n`;
  }
  return result;
}

function printNSentenceRevers(text, numSensence) {
  const sentences = text.split('\r\n').filter((item) => item !== '');
  if (numSensence > sentences.length) return 'No such sentence';

  const words = sentences[numSensence - 1].match(/[^_\W]+/g);
  const words2 = words.map((item) => item.split('').reverse().join(''));
  return `${numSensence}th sentence with reverse letters: \n${words2.join(' ')}\n`;
}

const utilsInit = () => ({
  commands: [
    {
      name: 'delw',
      descr: 'Delete word from text',
      param: '',
      desParam: 'Enter text which you want to delete: ',
      execute: (data, param) => deleteText(data, param),
    },
    {
      name: 'count',
      descr: 'Count words and print Nth words',
      param: '',
      desParam: 'Enter ordinal word of text ',
      execute: (data, param) => countWords(data, param),
    },
    {
      name: 'sents',
      descr: 'Print Nth sentence and reverse letters',
      param: '',
      desParam: 'Enter ordinal sentece of text ',
      execute: (data, param) => printNSentenceRevers(data, param),
    },
  ],
});

module.exports.create = utilsInit;
