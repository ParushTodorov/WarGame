using MediatR;
using WarGame.Mediator.Notifications;
using WarGame.Services.TableManager;

namespace WarGame.Mediator.Handlers
{
    public class RHCloseTable : INotificationHandler<RCloseTable>
    {
        private readonly ITableManager _tableManager;

        public RHCloseTable(ITableManager tableManager)
        {
            _tableManager = tableManager;
        }

        public Task Handle(RCloseTable request, CancellationToken cancellationToken)
        {
            _tableManager.CloseTable(request.TableId);

            return Task.CompletedTask;
        }
    }
}