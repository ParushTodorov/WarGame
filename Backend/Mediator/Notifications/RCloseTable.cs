using MediatR;

namespace WarGame.Mediator.Notifications
{
    public class RCloseTable : INotification
    {
        public Guid TableId { get; set; }
    }
}
