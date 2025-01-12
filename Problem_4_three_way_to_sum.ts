//1 recursion algorithm
function recursive(n: number): number {
    if (n <= 0) return 0;
    return n + recursive(n - 1);
}

//2 loop
function loop(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}


//3 mathematic sum formula
function mathSumFormula(n: number): number {
    return (n * (n + 1)) / 2;
}
