using MediatR;

namespace WarGame.Mediator.Requests
{
    public class RStartGame : IRequest<RStartGame.Result>
    {
        public Guid PlayerId { get; set; }

        public bool isMaxRoundActive { get; set; }

        public bool isTimebankActive { get; set; }

        public class Result
        {
            public string TableId { get; set; }

        }
    }
}
