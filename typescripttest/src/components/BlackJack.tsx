import React, { useState } from 'react';

type Card = {
  value: number; // 2-10 for numbers, 11 for Jack, Queen, King, and Ace is 1 or 11
  suit: string; // Clubs, Diamonds, Hearts, Spades
};

type Player = {
  name: string;
  hand: Card[];
  score: number;
};

const BlackJack: React.FC = () => {
  const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // 11 represents Jack/Queen/King/Ace for simplicity

  const [deck, setDeck] = useState<Card[]>([]);
  const [player, setPlayer] = useState<Player>({ name: 'Player', hand: [], score: 0 });
  const [dealer, setDealer] = useState<Player>({ name: 'Dealer', hand: [], score: 0 });
  const [message, setMessage] = useState<string>('Start the game!');

  // Helper: Create a shuffled deck
  const createDeck = () => {
    const newDeck: Card[] = [];
    for (const suit of suits) {
      for (const value of values) {
        newDeck.push({ value, suit });
      }
    }
    return newDeck.sort(() => Math.random() - 0.5); // Shuffle the deck
  };

  // Helper: Calculate hand score
  const calculateScore = (hand: Card[]) => {
    let score = 0;
    let aceCount = 0;

    hand.forEach((card) => {
      score += card.value;
      if (card.value === 11) aceCount++;
    });

    // Handle Aces: Adjust score if it exceeds 21
    while (score > 21 && aceCount > 0) {
      score -= 10;
      aceCount--;
    }

    return score;
  };

  // Start or reset the game
  const startGame = () => {
    const newDeck = createDeck();
    const playerHand = [newDeck.pop()!, newDeck.pop()!];
    const dealerHand = [newDeck.pop()!, newDeck.pop()!];

    setDeck(newDeck);
    setPlayer({ name: 'Player', hand: playerHand, score: calculateScore(playerHand) });
    setDealer({ name: 'Dealer', hand: dealerHand, score: calculateScore(dealerHand) });
    setMessage('Your turn!');
  };

  // Player hits to draw a card
  const hit = () => {
    if (player.score >= 21) return;

    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...player.hand, newCard];
    const newScore = calculateScore(newHand);

    setDeck(newDeck);
    setPlayer({ ...player, hand: newHand, score: newScore });

    if (newScore > 21) {
      setMessage('You bust! Dealer wins.');
    }
  };

  // Player stands, dealer plays
  const stand = () => {
    let newDeck = [...deck];
    let dealerHand = [...dealer.hand];
    let dealerScore = dealer.score;

    while (dealerScore < 17) {
      const newCard = newDeck.pop()!;
      dealerHand.push(newCard);
      dealerScore = calculateScore(dealerHand);
    }

    setDeck(newDeck);
    setDealer({ ...dealer, hand: dealerHand, score: dealerScore });

    if (dealerScore > 21 || player.score > dealerScore) {
      setMessage('You win!');
    } else if (player.score < dealerScore) {
      setMessage('Dealer wins!');
    } else {
      setMessage('It\'s a tie!');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Blackjack</h1>
      <button onClick={startGame}>Start Game</button>
      <h2>{message}</h2>

      <div>
        <h3>{player.name}</h3>
        <div>
          {player.hand.map((card, index) => (
            <span key={index}>
              {card.value} of {card.suit}
              {index < player.hand.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
        <p>Score: {player.score}</p>
        <button onClick={hit} disabled={player.score >= 21}>
          Hit
        </button>
        <button onClick={stand} disabled={player.score > 21}>
          Stand
        </button>
      </div>

      <hr />

      <div>
        <h3>{dealer.name}</h3>
        <div>
          {dealer.hand.map((card, index) => (
            <span key={index}>
              {card.value} of {card.suit}
              {index < dealer.hand.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
        <p>Score: {dealer.score}</p>
      </div>
    </div>
  );
};

export default BlackJack;
