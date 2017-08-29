export class Bot {

    private static globalId: number = 0;
    private _id: number;
    private slackUser: string;
    private currencyPair: string;
    private intervalle: number;
    /* TODO enum 1, 5, 15, 30, 60, 240, 1440, 10080, 21600 */

    constructor(slackUser: string, currencyPair: string, intervalle: number) {
        this._id = Bot.globalId++;
        this.slackUser = slackUser;
        this.currencyPair = currencyPair;
        this.intervalle = intervalle;
    }

    get id(): number {
        return this._id;
    }

}