/**
 * The smartest way to check whether number is prime or not. 
 * @param {number} num 
 * @returns boolean
 */
function isPrime(num){
    if(Number.isNaN(num)){
        return false
    }
    if(num < 2){
        return false
    }
    if(!Number.isInteger(num)){
        return false
    }
    
    let temp = num-1
    while(temp > 1){
        if(num % temp == 0){
            return false
        }
        temp-=1
    }
    return true
}
/*
console.log(isPrime(1))
console.log(isPrime(1.1))
console.log(isPrime(4))
console.log(isPrime(5))
*/

module.exports = {
    isPrime: isPrime
}
