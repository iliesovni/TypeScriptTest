import React from 'react';
import { useState, useEffect } from 'react';

type Carte = {
    chiffre: number;
    signe: string;
  };

type Joueur = {
    nom: string;
    main: Carte[];
    score: number;
    joue?: number;
    jouesigne?: string;
    brule?: number;
    brulesigne?: string;
    rejoue?: number;
    rejouesigne?: string;
  };

const Bataille: React.FC = () => {

    const signes = ['♣', '♦', '♥', '♠'];
    const chiffres = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // 11 c le Valet, 12 la reine, 13 le roi et 14 l'as (fo que je gère ça)

    const [deck, setDeck] = useState<Carte[]>([]);
    const [joueur, setJoueur] = useState<Joueur>({ nom: 'Joueur', main: [], score: 0 });
    const [bot, setBot] = useState<Joueur>({ nom: 'Bot', main: [], score: 0 });
    const [brule, setBrule] = useState<Joueur>({ nom: 'Brule', main: [], score: -999 });
    const [message, setMessage] = useState<string>('');

    // useEffect car ce truc marchait pas avec un console log dans la fonction
    useEffect(() => {
        console.log(joueur);
    }, [joueur]);
    
    useEffect(() => {
        console.log(bot);
    }, [bot]);


    const deckMelange = () => {
        const deckRandom: Carte[] = [];
        for (const signe of signes) {
          for (const chiffre of chiffres) {
            deckRandom.push({ chiffre, signe });
          }
        }
        deckRandom.sort(() => Math.random() - 0.5);
        const mid = Math.floor(deckRandom.length / 2);
        setJoueur(prevJoueur => ({ ...prevJoueur, main: deckRandom.slice(0, mid) }));
        setBot(prevBot => ({ ...prevBot, main: deckRandom.slice(mid) }));
        setDeck(deckRandom);
        console.log(deckRandom);
    };

    const jouerRound = (index: number) => {
        const carteJoueur = joueur.main[index];
        const carteBot = bot.main[0];
        const nouvelleMainJoueur = [...joueur.main.slice(0, index), ...joueur.main.slice(index + 1)];
        const nouvelleMainBot = bot.main.slice(1);
        joueur.joue = carteJoueur.chiffre;
        bot.joue = carteBot.chiffre;    
        joueur.jouesigne = carteJoueur.signe;
        bot.jouesigne = carteBot.signe;  
        joueur.brule = 0;
        joueur.brulesigne = "";
        bot.brule = 0;
        bot.brulesigne = "";
        joueur.rejoue = 0;
        bot.rejoue = 0;    
        joueur.rejouesigne = "";
        bot.rejouesigne = "";  

        //conditions de victoire de manche (si égalité on fait un deuxième round où on prend la première carte des deux decks)
        if (carteJoueur.chiffre > carteBot.chiffre) {
            setJoueur(prevJoueur => ({ ...prevJoueur, main: [...nouvelleMainJoueur, carteJoueur, carteBot] }));
            setBot(prevBot => ({ ...prevBot, main: nouvelleMainBot }));
            setMessage('Le joueur gagne');
        } else if (carteJoueur.chiffre < carteBot.chiffre) {
            setBot(prevBot => ({ ...prevBot, main: [...nouvelleMainBot, carteBot, carteJoueur] }));
            setJoueur(prevJoueur => ({ ...prevJoueur, main: nouvelleMainJoueur }));
            setMessage('Le bot gagne');
        } else {
            //deuxième round en cas d'égalité (si ya encore égalité c cho 1 peu)
            if (nouvelleMainJoueur.length > 0 && nouvelleMainBot.length > 0) {
                const carteJoueurSuivante = nouvelleMainJoueur[0];
                joueur.rejoue = carteJoueurSuivante.chiffre;
                joueur.rejouesigne = carteJoueurSuivante.signe;
                const carteBotSuivante = nouvelleMainBot[0];
                bot.rejoue = carteBotSuivante.chiffre; 
                bot.rejouesigne = carteBotSuivante.signe; 
                const mainjouerprov = nouvelleMainJoueur.slice(1);
                const mainbotprov = nouvelleMainBot.slice(1);
    

                const cartebruleejou = mainjouerprov[0];
                joueur.brule = cartebruleejou.chiffre;
                joueur.brulesigne = cartebruleejou.signe;
                const cartebruleebot = mainbotprov[0];
                bot.brule = cartebruleebot.chiffre;
                bot.brulesigne = cartebruleebot.signe;
                const nouvelleMainJoueurSuivante = mainjouerprov.slice(1);
                const nouvelleMainBotSuivante = mainbotprov.slice(1);

                if (carteJoueurSuivante.chiffre > carteBotSuivante.chiffre) {
                    setJoueur(prevJoueur => ({ ...prevJoueur, main: [...nouvelleMainJoueurSuivante, carteJoueur, carteBot, carteJoueurSuivante, carteBotSuivante, cartebruleejou, cartebruleebot] }));
                    setBot(prevBot => ({ ...prevBot, main: nouvelleMainBotSuivante }));
                    setMessage('Le joueur gagne après égalité');
                } else if (carteJoueurSuivante.chiffre < carteBotSuivante.chiffre) {
                    setBot(prevBot => ({ ...prevBot, main: [...nouvelleMainBotSuivante, carteBot, carteJoueur, carteBotSuivante, carteJoueurSuivante, cartebruleejou, cartebruleebot] }));
                    setJoueur(prevJoueur => ({ ...prevJoueur, main: nouvelleMainJoueurSuivante }));
                    setMessage('Le bot gagne après égalité');
                } else {
                    setBrule(prevBrule => ({ ...prevBrule, main: [...prevBrule.main, carteJoueur, carteBot, carteJoueurSuivante, carteBotSuivante, cartebruleejou, cartebruleebot] }));
                    setJoueur(prevJoueur => ({ ...prevJoueur, main: nouvelleMainJoueurSuivante }));
                    setBot(prevBot => ({ ...prevBot, main: nouvelleMainBotSuivante }));
                    setMessage('Egalité deux fois');
                }
            } else {
                setBrule(prevBrule => ({ ...prevBrule, main: [...prevBrule.main, carteJoueur, carteBot] }));
                setJoueur(prevJoueur => ({ ...prevJoueur, main: nouvelleMainJoueur }));
                setBot(prevBot => ({ ...prevBot, main: nouvelleMainBot }));
                setMessage('Egalité');
            }
        }
    };
        //les signes sur les cartes du bot c'est pour ajouter un peu de suspens
    return (
        <div>
            <div>
            {bot.main.slice(0, 5).map((carte, index) => (
                <span key={index}>
                    ᔑᓭ|| {carte.signe}
                </span>
            ))}
                <h3>main du bot</h3>
            </div>
            {bot.main.length > 0 && (
                <span>
                    {bot.joue} {bot.jouesigne}
                </span>
            )}
            <p>resultat : { message }</p>
            {joueur.brule !== undefined && joueur.brule > 0 && bot.brule !== undefined && bot.brule > 0 && (
                <p>brulé : joueur : { joueur.brule } { joueur.brulesigne } | bot : { bot.brule } { bot.brulesigne }</p>
            )}
            {joueur.rejoue !== undefined && joueur.rejoue > 0 && bot.rejoue !== undefined && bot.rejoue > 0 && (
                <p>rejoué : joueur : { joueur.rejoue } { joueur.rejouesigne } | bot : { bot.rejoue } { bot.rejouesigne }</p>
            )}
            {joueur.main.length > 0 && (
                <span>
                    {joueur.joue} {joueur.jouesigne}
                </span>
            )}
            <div>
                <h3>main du joueur</h3>
                {joueur.main.slice(0, 5).map((carte, index) => (
                    <button className='carte' key={index} onClick={() => jouerRound(index) } disabled={joueur.main.length === 0 || bot.main.length === 0}>
                        {carte.chiffre} {carte.signe}
                    </button>
                ))}
                {joueur.main.length > 5 && (
                    <p>carte suivante : { joueur.main[5].chiffre } { joueur.main[5].signe } | {joueur.main.length} cartes restantes</p>
                )}
            </div>
            <button onClick={deckMelange}>Melanger</button>
        </div>
    );
};

export default Bataille;