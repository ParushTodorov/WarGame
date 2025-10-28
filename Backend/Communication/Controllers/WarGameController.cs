using Microsoft.AspNetCore.Mvc;

using MediatR;
using WarGame.Communication.Controllers.Responses;
using WarGame.Mediator.Requests;

namespace WarGame.Communication.Controllers
{
    [Route("api/war")]
    [ApiController]
    public class WarGameController : ControllerBase
    {
        private readonly IMediator _mediator;

        public WarGameController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> StartGame([FromQuery] bool maxrounds, bool timebank)
        {
            Guid playerId = Guid.NewGuid();

            RStartGame.Result result = await _mediator.Send(
                new RStartGame
                {
                    PlayerId = playerId,
                    isMaxRoundActive = maxrounds,
                    isTimebankActive = timebank
                }
            );

            AuthResponse response = new AuthResponse
            {
                PlayerId = playerId.ToString(),
                TableId = result.TableId
            };

            return Ok(response);
        }
    }
}
