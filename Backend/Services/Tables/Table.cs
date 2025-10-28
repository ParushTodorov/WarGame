
using MediatR;
using WarGame.Mediator.Notifications;
using WarGame.Utilities.Enums;
using WarGame.Utilities.Types;
using WarGame.Communication.SignalHub.Messages;
using WarGame.Communication.SignalHub.Messages.Data;
using WarGame.Services.ShuffleMachines;

namespace WarGame.Services.Tables
{
    public class Table : ITable
    {
        public Guid Id { get; set; }

        private readonly IShuffleMachine _shuffleMachine;
        private readonly IMediator _mediator;
        private readonly GameConfig _gameConfig;

        private Guid _playerOneId;
        private Guid _playerTwoId;

        private GameState _gameState = GameState.PreStart;

        private int _roundId = 0;
        private DateTime _startTime;

        private bool _maxRoundActive = false;
        private bool _timebankActive = false;

        private Dictionary<GameState, int> _timerConfig;
        private Dictionary<GameState, Action> _tmeActions;

        public Table(IShuffleMachine shuffleMachine, IMediator mediator, GameConfig gameConfig)
        {
            _shuffleMachine = shuffleMachine;
            _mediator = mediator;
            _gameConfig = gameConfig;

            Id = Guid.NewGuid();

            _timerConfig = new Dictionary<GameState, int>
            {
                { GameState.PreStart,   Math.Max(_gameConfig.TimeSettings.PreStart, 1) },
                { GameState.StartGame,  Math.Max(_gameConfig.TimeSettings.StartGame, 1) },
                { GameState.StartRound, Math.Max(_gameConfig.TimeSettings.StartRound, 1) },
                { GameState.RoundResult,Math.Max(_gameConfig.TimeSettings.RoundResult, 1) }
            };

            _tmeActions = new Dictionary<GameState, Action>
            {
                { GameState.StartGame, StartRound },
                { GameState.StartRound, EndRound },
                { GameState.RoundResult, StartRound },
                { GameState.PreStart, StartGame }
            };
        }

        public bool TroopAssembly(Guid playerName)
        {
            if (_playerOneId == Guid.Empty)
            {
                _playerOneId = playerName;
                return false;
            }

            _playerTwoId = playerName;
            ActivateTimer();

            return true;
        }

        public void ActivateMaxRounds()
        {
            _maxRoundActive = true;
        }

        public void ActivateTimebank()
        {
            _timebankActive = true;
        }

        private void StartGame()
        {
            _shuffleMachine.ShuffleCards();

            _gameState = GameState.StartGame;

            _roundId = 0;

            int maxRounds = 0;
            int timebankInSec = 0;

            if (_timebankActive)
            {
                _startTime = DateTime.UtcNow;
                timebankInSec = _gameConfig.TimebankInSec;
            }

            if (_maxRoundActive)
            {
                maxRounds = _gameConfig.MaxRoundsForSpeedGame;
            }

            StartGame message = new StartGame
            {
                PlayerOneId = _playerOneId.ToString(),
                PlayerTwoId = _playerTwoId.ToString(),
                TimeToWaitInSec = _timerConfig[_gameState],
                MaxRounds = maxRounds,
                TimebankInSec = timebankInSec
            };

            SendMessage(OutgoingMessagesType.StartGame, message);
        }

        private void EndGame()
        {
            _gameState = GameState.EndGame;

            Player winner = IsWinner();

            GameEnd message = new GameEnd
            {
                Winner = winner,
            };

            SendMessage(OutgoingMessagesType.EndGame, message);

            _mediator.Publish(new RCloseTable
            {
                TableId = Id
            });
        }

        private void StartRound()
        {
            if (IsGameEnded())
            {
                EndGame();
                return;
            }

            _gameState = GameState.StartRound;
            _roundId++;

            int timeLeft = 0;

            if (_timebankActive)
            {
                timeLeft = (int)(Math.Floor(_gameConfig.TimebankInSec - (DateTime.UtcNow - _startTime).TotalSeconds));
            }

            StartRound data = new StartRound
            {
                TimeToWaitInSec = _timerConfig[GameState.StartRound],
                RoundId = _roundId,
                TimeLeft = timeLeft
            };

            SendMessage(OutgoingMessagesType.StartNewRound, data);
        }

        private void EndRound()
        {
            _gameState = GameState.RoundResult;

            Card playerOneCard = _shuffleMachine.GetPlayerCard(Player.One);
            Card playerTwoCard = _shuffleMachine.GetPlayerCard(Player.Two);

            Player winner = CompareRoundCards(playerOneCard, playerTwoCard);
            string winnerId = GetPlayerId(winner);

            ReturnCardsToDecks(winner, playerOneCard, playerTwoCard);

            int playerOneDeckSize = _shuffleMachine.GetDeckSizeByPlayer(Player.One);
            int playerTwoDeckSize = _shuffleMachine.GetDeckSizeByPlayer(Player.Two);

            RoundResult result = new RoundResult
            {
                PlayerOneCard = playerOneCard,
                PlayerTwoCard = playerTwoCard,
                PlayerOneCardsLeft = playerOneDeckSize,
                PlayerTwoCardsLeft = playerTwoDeckSize,
                Winner = winner,
                WinnerId = winnerId,
                TimeToWaitInSec = _timerConfig[_gameState]
            };

            SendMessage(OutgoingMessagesType.RoundResult, result);
        }

        private bool IsGameEnded()
        {
            int playerOneDeckSize = _shuffleMachine.GetDeckSizeByPlayer(Player.One);
            int playerTwoDeckSize = _shuffleMachine.GetDeckSizeByPlayer(Player.Two);

            if (playerOneDeckSize == 0 || playerTwoDeckSize == 0)
            {
                return true;
            }

            if (_maxRoundActive && _gameConfig.MaxRoundsForSpeedGame == _roundId)
            {
                return true;
            }

            if (_timebankActive && (DateTime.UtcNow - _startTime).TotalSeconds >= _gameConfig.TimebankInSec)
            {
                return true;
            }

            return false;
        }

        private Player CompareRoundCards(Card playerOneCard, Card playerTwoCard)
        {
            if (playerOneCard.Rank > playerTwoCard.Rank)
            {
                return Player.One;
            }

            if (playerTwoCard.Rank > playerOneCard.Rank)
            {
                return Player.Two;
            }

            return Player.None;
        }

        private void ReturnCardsToDecks(Player winner, Card playerOneCard, Card playerTwoCard)
        {

            if (winner == Player.None)
            {
                _shuffleMachine.SetPlayerCard(Player.One, playerOneCard);
                _shuffleMachine.SetPlayerCard(Player.Two, playerTwoCard);
                return;
            }

            if (winner == Player.Two)
            {
                _shuffleMachine.SetPlayerCard(Player.Two, playerOneCard);
                _shuffleMachine.SetPlayerCard(Player.Two, playerTwoCard);
                return;
            }

            _shuffleMachine.SetPlayerCard(Player.One, playerOneCard);
            _shuffleMachine.SetPlayerCard(Player.One, playerTwoCard);
        }

        private Player IsWinner()
        {
            int playerOneDeckSize = _shuffleMachine.GetDeckSizeByPlayer(Player.One);
            int playerTwoDeckSize = _shuffleMachine.GetDeckSizeByPlayer(Player.Two);

            if (playerOneDeckSize > playerTwoDeckSize)
            {
                return Player.One;
            }

            if (playerTwoDeckSize > playerOneDeckSize)
            {
                return Player.Two;
            }

            return Player.None;
        }

        private string GetPlayerId(Player player)
        {
            if (player == Player.One)
            {
                return _playerOneId.ToString();
            }

            if (player == Player.Two)
            {
                return _playerTwoId.ToString();
            }

            return String.Empty;
        }

        private void ActivateTimer()
        {
            if (_gameState == GameState.EndGame)
            {
                return;
            }

            int time = _timerConfig[_gameState];
            Console.WriteLine(time);

            System.Timers.Timer timer = new System.Timers.Timer();
            timer.AutoReset = false;
            timer.Elapsed += CallTimer;
            timer.Interval = time * 1000;
            timer.Start();
        }

        private void CallTimer(object? sender, EventArgs e)
        {
            _tmeActions.TryGetValue(_gameState, out Action action);

            action?.Invoke();

            ActivateTimer();
        }

        private void SendMessage<T>(OutgoingMessagesType type, T data)
        {
            OutgoingMessage<T> message = new OutgoingMessage<T>
            {
                Type = type,
                Data = data
            };

            _mediator.Publish(new RSignalMessage
            {
                Message = message,

                TableId = Id.ToString()
            });
        }
    }
}
