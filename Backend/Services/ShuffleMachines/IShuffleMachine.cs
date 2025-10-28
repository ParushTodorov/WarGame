using WarGame.Utilities.Enums;
using WarGame.Utilities.Types;

namespace WarGame.Services.ShuffleMachines
{
    public interface IShuffleMachine
    {
        void ShuffleCards();

        Card GetPlayerCard(Player player);

        void SetPlayerCard(Player player, Card card);

        int GetDeckSizeByPlayer(Player player);

        void ClearPlayersDecks();
    }
}
