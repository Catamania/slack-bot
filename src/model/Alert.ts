export class Alert {
    private date: Date;
    private acceleration: number;
    private isBullish: boolean;

    constructor(isBullish: boolean, acceleration: number) {
        this.isBullish = isBullish;
        this.acceleration = acceleration;
        this.date = new Date();
    }

    public getDate(): Date {
        return this.date;
    }

    public getAcceleration(): number {
        return this.acceleration;
    }

    public isBulish(): boolean {
        return this.isBullish;
    }
}