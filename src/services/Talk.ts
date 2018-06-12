export class Talk {

    private bullishMessages = [
        "Le vent vient de tourner. Je serais vous, j'en achéterais un paquet tant qu'il est reste encore, ça va partir comme des petits pains sous peu",
        "Les signes sont formels : les acheteurs sont de sortie, c'est le moment de faire les stocks",
        "Les réacteurs chauffent, décollage imminent du cours, montez rapidement à bord",
    ];

    private bearishMessages = [
        "J'ai l'impression que la tendance est plutôt à la baisse, je vous conseille de vendre pour l'instant",
    ];

    /**
     * Generate a random bullish or bearish message according to the indicators
     *
     * @param {boolean} isBullish
     * @param {number} acceleration
     * @returns {string}
     */
    public generateMessage(isBullish : boolean, acceleration : number) : string {

        let messages = isBullish ? this.bullishMessages : this.bearishMessages;

        return messages[Math.floor(Math.random() * (messages.length))] + " (" + acceleration + ")";
    }

    /**
     * Generate a hello message (could be randomised too)
     *
     * @param {string} name
     * @returns {string}
     */
    static generateHelloMessage(name : string) {
        return "Bonjour, je suis " + name +". Je vais surveiller le marché et essayer de vous guider dans vos échanges."
    }
}