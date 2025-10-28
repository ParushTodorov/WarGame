using MediatR;
using WarGame.Mediator.Requests;
using WarGame.Services.TableManager;

namespace WarGame.Mediator.Handlers
{
    public class RHStartGame : IRequestHandler<RStartGame, RStartGame.Result>
    {
        private readonly ITableManager _tableManager;

        public RHStartGame(ITableManager tableManager)
        {
            _tableManager = tableManager;
        }

        public Task<RStartGame.Result> Handle(RStartGame request, CancellationToken cancellationToken)
        {
            Guid tableId = _tableManager.AddPlayerToTable(request.PlayerId, request.isMaxRoundActive, request.isTimebankActive);

            RStartGame.Result result = new RStartGame.Result { TableId = tableId.ToString() };

            return Task<RStartGame.Result>.FromResult(result);
        }
    }
}
