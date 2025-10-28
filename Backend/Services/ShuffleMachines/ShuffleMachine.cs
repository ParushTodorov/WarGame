using System;
using System.Reflection;
using System.Security.Cryptography;
using WarGame.Utilities.Enums;
using WarGame.Utilities.Types;

namespace WarGame.Services.ShuffleMachines
{
    public class ShuffleMachine : IShuffleMachine
    {
        private List<Card> _cardDeck = new List<Card>();

        private Queue<Card> _playerOneDeck = new Queue<Card>();

        private Queue<Card> _playerTwoDeck = new Queue<Card>();

        public ShuffleMachine()
        {
            CreateDeck();
        }

        public void ShuffleCards()
        {
            int n = _cardDeck.Count;
            while (n > 1)
            {
                n--;
                int k = RandomNumberGenerator.GetInt32(n + 1);
                (_cardDeck[n], _cardDeck[k]) = (_cardDeck[k], _cardDeck[n]);
            }

            List<Card> playerOneDeck = _cardDeck.Take(_cardDeck.Count / 2).ToList();
            List<Card> playerTwoDeck = _cardDeck.Skip(_cardDeck.Count / 2).ToList();

            _playerOneDeck = new Queue<Card>(playerOneDeck);
            _playerTwoDeck = new Queue<Card>(playerTwoDeck);
        }

        public Card GetPlayerCard(Player player)
        {
            if (player == Player.One)
            {
                return _playerOneDeck.Dequeue();
            }

            return _playerTwoDeck.Dequeue();
        }

        public void SetPlayerCard(Player player, Card card)
        {
            if (player == Player.One)
            {
                _playerOneDeck.Enqueue(card);
                return;
            }

            _playerTwoDeck.Enqueue(card);
        }

        public int GetDeckSizeByPlayer(Player player)
        {
            if (player == Player.One)
            {
                return _playerOneDeck.Count;
            }

            return _playerTwoDeck.Count;
        }

        public void ClearPlayersDecks()
        {
            _playerOneDeck = new Queue<Card>();
            _playerTwoDeck = new Queue<Card>();
        }

        private void CreateDeck()
        {
            if (_cardDeck.Count >= 52)
            {
                return;
            }

            var rankValues = ((CardRank[])Enum.GetValues(typeof(CardRank)))
                .Select(r => (int)r)
                .ToArray();
            var suitValues = ((CardSuit[])Enum.GetValues(typeof(CardSuit)))
                .Select(r => (int)r)
                .ToArray();

            foreach (int rank in rankValues)
            {
                foreach (int suit in suitValues)
                {
                    Card card = new Card
                    {
                        Rank = (CardRank)rank,
                        Suit = (CardSuit)suit
                    };

                    _cardDeck.Add(card);
                }
            }
        }
    }
}
