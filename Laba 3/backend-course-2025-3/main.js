import { program } from 'commander';  //імпортую обєкт програм з пакету командер
import fs from 'fs'; //імпортую модуль цілком для  роботи з файл сис
import path from 'path'; //шьпортую модуль для роботи з шляхами

//налаштовую параметри

program
  .requiredOption('-i, --input <path>', 'Path to input JSON file')
  .option('-o, --output <path>', 'Path to output file')
  .option('-d, --display', 'Display result in console')
  .option('-s, --survived', 'Show only survived passangers')
  .option('-a, --age', 'Display passenger age');

//required - обовязковий параметр , option - необовязковий

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
} //перевірка обовязквого параметру

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
} //перевірка існування файлу

let data;
try {
  const fileContent = fs.readFileSync(options.input, 'utf-8');
  
  //тут йде перевірка якщо файл починається з [ бо зіткнувася з проблемою парсингу
  if (fileContent.trim().startsWith('[')) {
    data = JSON.parse(fileContent);
  } else { //в такому випадку кожен рядок окремий жейсон
    data = fileContent
      .trim()
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
  }
} catch (error) {
  console.error('Error reading or parsing input file:', error.message);
  process.exit(1);
}


let filteredData = data; //фільтред типу фільтрація даних

if (options.survived) {
  filteredData = filteredData.filter(passenger => 
    passenger.Survived === 1 || passenger.Survived === "1"
  );
} //фільтруємо виживших

const result = filteredData.map(passenger => {
  let line = passenger.Name;
  
  if (options.age) {
    const age = passenger.Age || 'N/A';
    line += ` ${age}`;
  }
  
  line += ` ${passenger.Ticket}`;
  
  return line;
}).join('\n'); //тут ми формуємо результат

const shouldOutput = options.output || options.display; //а тут вже виводимо його

if (!shouldOutput) {
  //якщо не задано жодного необов параметра виводу
  process.exit(0);
}

if (options.display) {
  console.log(result);
}

if (options.output) {
  fs.writeFileSync(options.output, result, 'utf-8');
}




