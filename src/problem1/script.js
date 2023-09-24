// Three Ways to Sum to N

// for loop iterative solution
var sum_to_n_a = function(n) {
    let sum = 0
    for (let i = 1; i <= n; i++) {
        sum += i
    }
    return sum
};

// recursive solution
var sum_to_n_b = function(n) {
    if (n === 1) {
        return n
    }
    return n + sum_to_n_b(n - 1)
};

// with math formula (arithmetic sequence)
var sum_to_n_c = function(n) {
    return (n * (n + 1)) /2
};


