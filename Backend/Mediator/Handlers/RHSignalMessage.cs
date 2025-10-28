using MediatR;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using WarGame.Communication.SignalHub;
using WarGame.Mediator.Notifications;

namespace WarGame.Mediator.Handlers
{
    public class RHSignalMessage : INotificationHandler<RSignalMessage>
    {
        private IHubContext<SignalConnectionHub, ISignalConnectionHub> _hub;

        public RHSignalMessage(IHubContext<SignalConnectionHub, ISignalConnectionHub> hub)
        {
            _hub = hub;
        }

        public Task Handle(RSignalMessage request, CancellationToken cancellationToken)
        {
            JsonSerializerOptions options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            string msg = JsonSerializer.Serialize(request.Message, options);

            _hub.Clients.Group(request.TableId).Message(msg);

            return Task.CompletedTask;
        }
    }
}
