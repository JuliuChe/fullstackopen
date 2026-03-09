const animals=[
    {name:'Flufykins',  species:'rabbit'},
    {name:'Caro',       species:'dog'},
    {name:'Hamilton',   species:'dog'},
    {name:'Harold',     species:'fish'},
    {name:'Ursula',     species:'cat'},
    {name:'Jimmy',      species:'hamster'}
]

///FILTER
// Filter - for loop
let forDogs=[]
for(let animal in animals){
    if(animals[animal].species==='dog'){
        forDogs.push(animals[animal])
    }
}
console.log(forDogs)

//Filter - filter
function filter_dogs(animal){
    return animal.species=='dog'
}
let filterDogs=animals.filter(filter_dogs)
console.log(filterDogs)

//MAP
//Extract names - for loop
let names=[]
for(let animal in animals){
    names.push(animals[animal].name)
}
console.log(names)

//Extract names - MAP
let mapNames=animals.map(function(animal){return animal.name + " is a " + animal.species})
console.log(mapNames)

mapNames = animals.map((animal) => animal.name + "is a " + animal.species)
console.log(mapNames)

//REDUCE
var orders = [
    {amount:250},
    {amount:400},
    {amount:100},
    {amount:325}
]

//For loop
let totalAmount=0
for(let order in orders) {
    totalAmount+=orders[order].amount
}
console.log(totalAmount)

//Basic reduce
totalAmount=orders.reduce((sum, order) => {
    console.log('Hello', sum, order)
    return sum+order.amount},0)
console.log(totalAmount)

//"Adanced" reduce
import fs from 'fs'
const output=fs.readFileSync('data.txt','utf8')
    .trim()
    .split('\r\n')
    .map((line)=> line.split('\t'))
    .reduce((customers, line) =>{
        customers[line[0]]=customers[line[0]] ||[]
        customers[line[0]].push({
            name:line[1],
            price:Number(line[2]),
            quantity:Number(line[3])
        })
        return customers
    },{})
console.log(output)

// let totalValue=kitchenTools.reduce(())