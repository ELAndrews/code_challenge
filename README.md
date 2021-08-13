# Chronomics Code Challenge Submission

## Brief

Attached is a file "input_tiny.vcf" - this is an extract from a real genetic file, reporting the genetic sequence of someone. Any line starting with # is a comment. For a given chromosome (column "CHROM") and position(column "POS  ID"), we need to extract the allele (column "ALT").

Write a simple function that takes inputs chromosome and position and outputs the matching allele.
Don't worry about performance or tests for now.

For example:
chr1:16837 is "C"
chr1:17655 is "T"

Hint: treat the file like you would a CSV file

Use any libraries, packages or search on the internet as you would normally code.
Do not spend more than 1 hour on this - not looking for a perfect solution that is production-ready and full tested, more how you approach the problem and thinking behind it.

Please also provide:
What are the limitation/problems with this solution?
How would it scale?
How would you test it efficiently?  

## Submission

CLI using prompts for user interaction.

### Basic usage

```
npm install
npm start 
```

Running the code in `src/index.js` prompt to provide text input of the required chromosome and it's position.

### Alternative Solutions

As the solution provided is not performant in circumstances of large dataset, there are a number of alternative solutions which would fare better. To create a time complexity of O(1), I would want to utilise composite keys. Either by creating a hashtable - creating a unique key by combining the chromosome and position values, or alternatively I would prefer to have the data saved in an SQL database enforcing a unique composite constraint.