const result = Math.floor(Math.random() * 10);

while (true) {
    const guess = prompt('Guess a number between 0 and 10');

    if (guess == result) {
        console.log('You guessed correctly!');
        break;
    } else if (guess > result) {
        console.log('Your guess is higher than the result');
    } else {
        console.log('Your guess is lower than the result');
    }
}