# War

This game is based on the classic card game **War** — two players and a single deck of cards!

## Game Rules

- A standard 52-card deck is split equally between two players (26 cards each).  
- Players simultaneously reveal their top cards.  
- The higher card wins both cards (Ace is highest, 2 is lowest).  
- On a tie: skip the round — both cards go to the bottom of their respective decks.

---

## Game Modes

The game offers **three modes**:

- **Full Victory** — the game continues until one player collects all the cards.  
- **Limited Modes:**
  - max rounds  
  - timebank  

### Mode Details

- **Full Victory Mode:** The game runs until one player wins all cards.  
- **Max Rounds Mode:** The game continues for a pre-defined number of rounds.  
- **Timebank Mode:** The game ends when the timebank runs out (after the current round finishes).

To enable limited modes, add the corresponding **query parameters**:

| Mode | Query Parameter |
|------|------------------|
| Max Rounds | ?maxrounds=true |
| Timebank | ?timebank=true |

If both parameters are added, **Max Rounds** takes priority, and the game starts in that mode.  
The time and round limits can be configured in the **Back Office settings** using the parameters:

- MaxRoundsForSpeedGame  
- TimebankInSec  

---

## Game Flow

Each game progresses through the following stages:

1. **PreStart** – waiting for the second player  
2. **StartGame** – initializing the game and setting parameters  
3. **StartRound** – beginning each round  
4. **RoundResult** – announcing the round result  
5. **EndGame** – announcing the final winner  

The duration of each stage is controlled via configuration settings.

When the first player starts a game, a session is created in the Back Office and waits for a second player.  
The game begins only after both players have joined.

---

## Project Setup

### Backend

1. Open the project using WarGame.sln  
2. Requirements:
   - Visual Studio  
   - .NET 8  
3. Once the solution is loaded, start the server using IIS Express.

---

### Frontend

1. Navigate to the frontend project folder  
2. Install dependencies (requires Node v22.12.0) using:  
   npm install  
3. Start a development instance with:  
   npm run dev  
   The development server will run at:  
   http://localhost:1209/

---

## Starting a Game

Simply open the game URL in your browser to begin.  
To play in a specific mode, apply the corresponding query parameters as described above.

---

**Enjoy your game of WAR!**
