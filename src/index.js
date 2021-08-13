/*
 When given the brief, it quickly became apparent that the explanation within the first paragraph
 did not match the given example. As the written explanation would return the following:
   For example:
   chr1:16837 is "<NON_REF>"
   chr1:17655 is "<NON_REF>"
 Therefore, to ensure that I return the examples given I have taken the allele found in the "REF" column.
 In a normal working environment, I would confirm with the project lead what the desired output is.
 
 The normal library I would use to read a CSV did not transfer as expected, as a result and not wanted to go
 over the time limit, I went with the below implementation.
 
 What are the limitation/problems with this solution?
   There are a few limitations to this solution: I am assuming that each data row is unique to its given 
   chromosome and its position. In line 82, I am also removing all '#' which I assume no future headers will
   require. In the first instance I am iterating over each line of data to build a new data object, which isnt  
   very performant. 
 How would it scale?
   Nope, not well in the slightest. The time complexity of a .fiter() is O(n) which isn't appropriate for
   large datasets. Thus, the larger the dataset the longer slower the performance. Ideally you would want
   to aim for 0(1) (more thoughts on more appropriate solutions in README.md)
 How would you test it efficiently?
   I would want to load test it by creating an event listener to create a loop of continuous calls, and
   review the speed of each execution. You could use a package such as Artillery or go vanilla in this case.
*/


const prompts = require('prompts');
const readFile = require('fs').readFile;

(() => {
  try{
    readFile('data/input_tiny.vcf', 'utf-8', async (error, content) => {
      if (error) {
        throw new Error(error.message);
      } else {

        const dataArray = csvToDataArray(content)

        let invalidResponse = true;

        while(invalidResponse) {
        const response = await prompts(
            [
              {
                type: 'text',
                name: 'chromosome',
                message: 'Enter your chromosome and its position using the correct format:',
                initial: 'chr1:16837'
              }
            ]
          );

          if (response) {
            const regex = new RegExp(/(chr)[0-9]{1,2}:[0-9]{5}/);
            if (regex.test(response.chromosome)) {
              const requestedChromosome = response.chromosome.split(':')[0];
              const requestedPosition = response.chromosome.split(':')[1];

              let matchingChromosomeWithPositionsAllele = simpleLookupFunction(requestedChromosome, requestedPosition, dataArray);

              if (matchingChromosomeWithPositionsAllele) {
                console.log(`${response.chromosome} is "${matchingChromosomeWithPositionsAllele}"`)
                invalidResponse = false;
              }
            } else {
            console.log('You have not provided a correctly formatted request.');
            }
          }
        }
      }
    })
  } catch (error) {
    console.log('Your data file is missing.')
    throw new Error(error.message);
  }
})();

function csvToDataArray(content){
  const contentArray = content.split('\n')
  let contentData = contentArray.filter(dataRow => !dataRow.startsWith('##'))
  const headers = contentData[0].replace('#', '').split('\t');

  contentData.shift();

  let dataArray = [];

  contentData.forEach(dataString => {
    const dataStringArray = dataString.split('\t');
    let dataObject = {};
    for (let index in headers) {
      dataObject[headers[index]] = dataStringArray[index]
    }
    dataArray.push(dataObject);
  })

  return dataArray;
}


function simpleLookupFunction(requestedChromosome, requestedPosition, contentArray){
  let matchingChromosomesWithPosition = contentArray.filter(dataRow => 
    (dataRow['CHROM'] == requestedChromosome && dataRow['POS'] == requestedPosition)
  );

  if (matchingChromosomesWithPosition.length < 1) {
    console.log(`There is no chromosome, ${requestedChromosome}, with the requested position, ${requestedPosition}.`);
    return null
  } else {
    return matchingChromosomesWithPosition[0]['REF'];
  }
}