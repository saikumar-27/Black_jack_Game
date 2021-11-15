let blackjack_game = {         // Created an nested object named blackjack_game
    you: {
      scoreSpan: "#your-blackjack-result",   // Getting access with all id's and classes.
      div: "#your-box",                         
      boxSize: ".flex-blackjack-row-2 div",
      score: 0,
    },
  
    dealer: {                                  // Getting access with all id's and classes.
      scoreSpan: "#dealer-blackjack-result",
      div: "#dealer-box",                       
      boxSize: ".flex-blackjack-row-2 div",
      score: 0,
    },
  
    //cards holds the array of strings.
    cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"], 
  
    //cardsMap access the value of game .
    cardsMap: {
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      K: 10,
      J: 10,
      Q: 10,
      A: [1, 11],
    },
  
    wins: 0,             
    losses: 0,
    draws: 0,                         //Initially given the values for properties
    isStand: false,
    isTurnsOver: false,
    pressOnce: false,
  };
  
  const YOU = blackjack_game["you"];   //Accessing the property {you} that created in nested object
  const DEALER = blackjack_game["dealer"];   // Accessing {dealer} property
  
  const hitSound = new Audio("sounds/swish.m4a");  //Audio plays when user click button Hit
  const winSound = new Audio("sounds/cash.mp3");   //Audio plays when 'you' wins
  const loseSound = new Audio("sounds/aww.mp3");   //Audio plays then 'you' lose a game
  
  let windowWidth = window.screen.width;      // windowWidth to adjust according to screen size.
  let windowHeight = window.screen.height;    //windowHeight to adjust according to screen size.
  let winner;                                 // initially let is assigned to winner
  
  //Button Event Listeners
  document
    .querySelector("#blackjack-hit-button")
    .addEventListener("click", blackjackHit); //blackjackHit function executes when user clicks button hit
  document
    .querySelector("#blackjack-stand-button")
    .addEventListener("click", blackjackStand);//blackjackStand function executes when user clicks button stand
  document
    .querySelector("#blackjack-deal-button")
    .addEventListener("click", blackjackDeal);//blackjackDeal function executes when user clicks button Deal
  document
    .querySelector("#blackjack-restart-button")
    .addEventListener("click", blackjackRestart);//blackjackRestart function executes when user clicks button Restart
  
  function blackjackHit() {                       //blackjackHit function
    if (blackjack_game["isStand"] === false) {    //If isStand is false then
      let card = randomCard();                       //randomCard function
      showCard(card, YOU);                           //showCard function
      updateScore(card, YOU);                        //updateScore function
      showScore(YOU);                                //showScore function executes
    }
  }
  
  function randomCard() {                     
    let randomIndex = Math.floor(Math.random() * 13);      // selects value from 0 to 12
    return blackjack_game["cards"][randomIndex];           // returns blackjack_game and access[cards]
  }
  
  function showCard(card, activePlayer) {    //showCard function takes two parameters
    if (activePlayer["score"] <= 21) {
      let cardImage = document.createElement("img");    // creating html element
      cardImage.src = `images/${card}.png`;            //string interpolation
      cardImage.style = `width:${widthSize()}; height:${heightSize()};`;   // Returns height and width of the card
      document.querySelector(activePlayer["div"]).appendChild(cardImage);
      hitSound.play();
    }
  }
  
  function widthSize() {          //widthSize function to reize the window.screen
    if (windowWidth > 1000) {    // If windowWidth greater than 1000 then returns neWidthSize
      let newWidthSize = window.screen.width * 0.1;
      return newWidthSize;
    } else {
      return window.screen.width * 0.18;     
    }
  }
  
  function heightSize() {         //heightSize function to resize the window.screen
    if (windowHeight > 700) {      // If windowHeight greater than 700 then returns neHeightSize
      let newHeightSize = window.screen.height * 0.18;
      return newHeightSize;
    } else {
      return window.screen.height * 0.15;
    }
  }
  
  function updateScore(card, activePlayer) {    // updateScore function that updates the score
    if (card === "A") {
      if (activePlayer["score"] + blackjack_game["cardsMap"][card][1] <= 21) {  //Accessing 'A' card
        activePlayer["score"] += blackjack_game["cardsMap"][card][1];
      } else {
        activePlayer["score"] += blackjack_game["cardsMap"][card][0];  //Gives the value 1
      }
    } else {
      activePlayer["score"] += blackjack_game["cardsMap"][card];   //Gets a regular score 
    }
  
    console.log(activePlayer["score"]);
  }
  
  function showScore(activePlayer) {     //showScore function to show score and a message.
    //Bust logic if score is over 21
    if (activePlayer["score"] > 21) {
      document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
      document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
    } else {
      document.querySelector(activePlayer["scoreSpan"]).textContent =
        activePlayer["score"];
    }
  }
  
  function blackjackStand() {           //blackjackStand function 
    if (blackjack_game.pressOnce === false) { // if pressOnce property is false
      blackjack_game["isStand"] = true;    // intially changing it to true
      let yourImages = document          // 'yourImages' holds #your-box and #img
        .querySelector("#your-box")     // used to get same number of cards
        .querySelectorAll("img");
  
      for (let i = 0; i < yourImages.length; i++) { //If you get 3 cards then dealer also gets 3 cards
        let card = randomCard();  // Selects random card for dealer
        showCard(card, DEALER);   // Show the card of the dealer
        updateScore(card, DEALER); // Shows the score of the dealer
        showScore(DEALER);
      }
  
      blackjack_game["isTurnsOver"] = true;  // Now the dealer turn is over
  
      computeWinner();
      showWinner(winner);
    }
  
    blackjack_game.pressOnce = true;
  }
  
  function computeWinner() {    //ComputeWinner function decides who is the winner.
    if (YOU["score"] <= 21) {
      if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
        winner = YOU;
      } else if (YOU["score"] < DEALER["score"]) {
        winner = DEALER;
      } else if (YOU["score"] === DEALER["score"]) {
        winner = "Draw";
      }
    } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
      winner = DEALER;
    } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
      winner = "None";
    }
  
    return winner;
  }
  
  function showWinner(winner) {  //showWinner function to declares the winner.
    let message, messageColor;   
  
    if (winner === YOU) {
      message = "You Won";        //  A pop up message you won
      messageColor = "#00e676";
      document.querySelector("#wins").textContent = blackjack_game["wins"] += 1; //Increase the score
      winSound.play();              // plays the sound when 'You' wins
    } else if (winner === DEALER) {
      message = "You Lost";        // A pop up message you lost
      messageColor = "red";
      document.querySelector("#losses").textContent = blackjack_game[
        "losses"
      ] += 1;                        // Increase the score
      loseSound.play();
    } else if (winner === "Draw") {
      message = "You Draw";
      messageColor = "yellow";
      document.querySelector("#draws").textContent = blackjack_game["draws"] += 1;
      loseSound.play();
    } else if (winner === "None") {
      message = "You Both Busted!";
      messageColor = "orange";
      loseSound.play();
    }
  
    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
  }
  
  function blackjackDeal() {
    if (blackjack_game["isTurnsOver"] === true) {
      // Select all the images in both the user and dealer box
      let yourImages = document
        .querySelector("#your-box")
        .querySelectorAll("img");
      let dealerImages = document
        .querySelector("#dealer-box")
        .querySelectorAll("img");
  
      document.querySelector("#blackjack-result").style.color = "white";
  
      //Sets the user and dealers scors to zero
      YOU["score"] = DEALER["score"] = 0;
      document.querySelector("#your-blackjack-result").textContent = 0;
      document.querySelector("#dealer-blackjack-result").textContent = 0;
  
      //Reset color back to white
      document.querySelector("#your-blackjack-result").style.color = "white";
      document.querySelector("#dealer-blackjack-result").style.color = "white";
  
      //Reset to Let's Play
      document.querySelector("#blackjack-result").textContent = "Lets Play";
  
      //Removes the cards in the user's box
      for (let i = 0; i < yourImages.length; i++) {
        yourImages[i].remove();
        dealerImages[i].remove();
      }
  
      blackjack_game["isStand"] = false;
      blackjack_game.pressOnce = false;
      blackjack_game["isTurnsOver"] = false;
    }
  }
  // blackjackRestart function reset the entire game i,e wins,losses,draws to 0
  function blackjackRestart() {
    blackjackDeal();
    document.querySelector("#wins").textContent = 0;
    document.querySelector("#losses").textContent = 0;
    document.querySelector("#draws").textContent = 0;
  
    blackjack_game.wins = 0;
    blackjack_game.losses = 0;
    blackjack_game.draws = 0;
  }
  