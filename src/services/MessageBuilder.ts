export class MessageBuilder {

    /* attributs statiques */
    private static iconUrl: string = "https://www.bruno-faugeroux.fr/images/catia-transparant.png";
    private static sellBaseUrl = "https://www.cat-amania.com"; 
    private static buyBaseUrl = "https://www.google.fr"; 
    private static graphBaseurl = "http://78.212.193.11:8182/macd/";

    /* attributs du builder */
    private sellUrl: string;
    private buyUrl: string;
    private graphUrl: string;


    constructor(intervalle: string) {
        this.sellUrl = MessageBuilder.sellBaseUrl;
        this.buyUrl = MessageBuilder.buyBaseUrl;
        this.graphUrl =  `${MessageBuilder.graphBaseurl}?grain=${intervalle}`;
    }

    public getGraphUrl() {
        return this.graphUrl;
    }


    /**
     * Construit le bouton de vente
     */
    private sellButton() {
        return {
            "text": "Vendre 1 eth",
            "type": "button",
            "url": this.sellUrl,
            "confirm": {
                "title": "Confirmer la vente",
                "text": "Êtes-vous vraiment sûr de vouloir vendre 1 eth ?",
                "ok_text": "J'en suis sûr",
                "dismiss_text": "Annuler"
            }
        };
    }

    /**
     * Construit le bouton d'achat
     */
    private buyButton() {
        return {
            "text": "Acheter 1 eth",
            "type": "button",
            "url": this.buyUrl,
            "confirm": {
                "title": "Confirmer l'achat",
                "text": "Êtes-vous vraiment sûr de vouloir acheter 1 eth ?",
                "ok_text": "J'en suis sûr",
                "dismiss_text": "Annuler"
                }
        };
    }
    

    /**
     * Construit le json du message avec les boutons correspondant au signal
     * @param isBullish 
     */
    public buildParams(isBullish: boolean) {
        let actionButton;
        if (isBullish) {
            actionButton = this.buyButton();
        } else {
            actionButton = this.sellButton();
        }
        
        let actions = [
            actionButton,
            {
                "text": "Afficher l'analyse",
                "type": "button",
                "url": `${this.graphUrl}`,
            }
        ]

        let params = {
            icon_url : MessageBuilder.iconUrl,
            attachments: [
                {
                    "fallback": "TODO",
                    "color": "#3AA3E3",
                    "actions": actions
                }]
        };

        return params;
    }
}