class Score {
    constructor() {
        this.score = 0;
    }
    increaseScore(deltaT) {
        this.score += deltaT ;
        window.dispatchEvent(new Event('increaseScore'));
    }
}