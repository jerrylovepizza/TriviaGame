var questionCounter=10;
var rightCounter=0;
var wrongCounter=0;
var noAnswerCounter=0;
var indexList = [];
var pauseTimerId=0;
var intervalTimerId=0;
var secondsCounter=30;
var soundtrack=null;

$(document).ready (function(){
    soundtrack = document.getElementById("soundtrack"); 
    soundtrack.play();
})

//====================================================================
//  start() gets called each time the game starts.
//====================================================================
function start()
{
    console.log("start()");

    // Append all the fields

    $(".container").empty();
    $(".container").append('<h1><strong>TOTALLY TRIVIAL TRIVIA!</strong></h1>')
    $(".container").append('<h3 id="timer"></h3>');
    $(".container").append('<h3 id="question"></h3>');
    $(".container").append('<h3 id="answer"></h3>');
    $(".container").append('<h3 id="answer2"></h3>');
    $(".container").append('<div id="section1"></div>');
    $(".container").append('<div id="section2"></div>');
    $(".container").append('<div id="section3"></div>');
    $(".container").append('<div id="section4"></div>');
    var choice1 = $('<input/>').attr({type:'button', id:'choice1', index:'0', class:'choice', value:'choice1'});
    $("#section1").append(choice1);
    var choice2 = $('<input/>').attr({type:'button', id:'choice2', index:'0', class:'choice', value:'choice2'});
    $("#section2").append(choice2);
    var choice3 = $('<input/>').attr({type:'button', id:'choice3', index:'0', class:'choice', value:'choice3'});
    $("#section3").append(choice3);
    var choice4 = $('<input/>').attr({type:'button', id:'choice4', index:'0', class:'choice', value:'choice4'});
    $("#section4").append(choice4);

    // Start the trivia
    soundtrack.pause();
    gotoNextQuestion();
}


//====================================================================
//  User clicks are processed here.
//====================================================================
$(document).on("click", ".choice", function(){

    // Stop all timers
    clearTimeout(pauseTimerId);
    clearInterval(intervalTimerId);

    // hide the answers 
    hideButtons();

    // Get user's choice
    var userChoice = this.value;
    console.log(userChoice);
    
    var index = this.getAttribute("index");
    console.log(index);
    
    // Look up the choice in the trivia table
    var trivia = infoSource.trivia[index];


    // validate answer and display result
    if (trivia.answer[0] === userChoice[0])
    {
        $("#answer").html("Correct!!");
        $("#answer2").html(trivia.answer.substr(2));
        rightCounter++;
    }
    else
    {
        $("#answer").html("Sorry!");
        $("#answer2").html("The correct answer was: "+ trivia.answer.substr(2));
        wrongCounter++;
    }

    // pause 5 seconds before the next question
    puaseTimerId = setTimeout(gotoNextQuestion, 5000);
});

//====================================================================
//                      goToNextQuestion()
//====================================================================

function gotoNextQuestion()
{
    console.log("goToNextQuestion()");

    // clear the answers and show the possible choices for next question
    showButtons();
    $("#answer").html("");
    $("#answer2").html("");

    // if still less than 10 questions
    if (questionCounter)
    {
        // set the 30 second timer
        secondsCounter=30;
        $("#timer").html("Time Remaining: "+secondsCounter+" Seconds");

        questionCounter--;

        // pick a unique random question
        var index = generateNextRandom();
        var trivia = infoSource.trivia[index];

        //display the question and answer choices
        $("#question").html(trivia.question);
        $(".choice").attr("index", index);
        $("#choice1").attr("value", trivia.choice1);
        $("#choice2").attr("value", trivia.choice2);
        $("#choice3").attr("value", trivia.choice3);
        $("#choice4").attr("value", trivia.choice4);

        // start the 1 second interval timer and process the timeout here
        intervalTimerId = setInterval(function() {

            // decrement the seconds when the timer goes off
            secondsCounter--;
            $("#timer").html("Time Remaining: "+secondsCounter+" Seconds");

            // if time is up, display "Timeout!" and the correct answer 
            if (secondsCounter === 0)
            {
                clearTimeout(pauseTimerId);
                clearInterval(intervalTimerId);
                $("#timer").html("Time Remaining: 0 Seconds");
                hideButtons();

                console.log("timerExpired()");

                noAnswerCounter++;
                var trivia = infoSource.trivia[index];
                $("#answer").html("TIME OUT!");
                $("#answer2").html("The answer was: "+ trivia.answer.substr(2));

                //go to the next question
                pauseTimerId = setTimeout(gotoNextQuestion, 5000);
            }
        }, 1000);
    }
    else
    {   // After 10 questions have been selected, display the final results
        displayFinalResults();
    }
}


//=================================================
//                  displayFinalResults
//================================================= 

function displayFinalResults()
{
    //clear all timers and update the fields as needed to display final results
    clearTimeout(pauseTimerId);
    clearTimeout(intervalTimerId);

    console.log("displayFinalResults()");
    
    soundtrack.play();

    $("#answer").remove();
    $("#answer2").remove();
    $("#choice1").remove();
    $("#choice2").remove();
    $("#choice3").remove();
    $("#choice4").remove();

    $("#question").html("All done, here is how you did!");
    $(".container").append('<h4 id="rightAnswer"></h4>');
    $(".container").append('<h4 id="wrongAnswer"></h4>');
    $(".container").append('<h4 id="noAnswer"></h4>');    
    var startOver = $('<input/>').attr({type:'button', id:'refresh', onClick:'start()', value:'Start Over?'});
    $("#noAnswer").after(startOver);

    $("#rightAnswer").html("Correct Answers: "+rightCounter);
    $("#wrongAnswer").html("Incorrect Answers: "+wrongCounter); 
    $("#noAnswer").html("Unanswered: "+noAnswerCounter);

    // reset all global variables
    questionCounter=10;
    rightCounter=0;
    wrongCounter=0;
    noAnswerCounter=0;
    indexList.length = 0;
}

//=================================================
//                  generateNextRandom()
//================================================= 

function generateNextRandom()
{
    // generate a unique index between 0 and the length of the trivia table
    var randomIndex = Math.floor((Math.random()* infoSource.trivia.length));
    var searchForRandom = true;
    var i=0;

    while (searchForRandom)
    {
        for (i=0; i<indexList.length; i++)
        {
            if (indexList[i] === randomIndex)
            {
                randomIndex = Math.floor((Math.random()* infoSource.trivia.length));
                break;
            }
        }
        if (i === indexList.length)
        {
            searchForRandom = false;
            indexList.push(randomIndex);
            console.log("indexList: "+indexList);
        }
    }
    return randomIndex;
}

//=================================================
//                  hideButtons()
//=================================================  

function hideButtons()
{
    // hide choices and show the final answer
    $("#choice1").hide();
    $("#choice2").hide();
    $("#choice3").hide();
    $("#choice4").hide();
    $("#question").after('<h3 id="answer"></h3>');
    $("#answer").after('<h3 id="answer2"></h3>');
}


//=================================================
//                  showButtons()
//=================================================  

function showButtons()
{
    // remove answer and show new choices to be selected
    $("#answer").remove();
    $("#answer2").remove();
    $("#choice1").show();
    $("#choice2").show();
    $("#choice3").show();
    $("#choice4").show();
}

//=================================================
//                  JSON Data
//=================================================   

infoSource = {
"trivia":[
{"question":"Which hit song featured the following lyric: The love we share seems to go nowhere and I’ve lost my light ?",
"choice1":"a. Teardrops", 
"choice2":"b. Tainted Love", 
"choice3":"c. Love Action (I Believe In Love)",
"choice4":"d. Superwoman", 
"answer":"b. Tainted Love"},
{"question":"Who sang the title track of the late 80s James Bond film Licence to Kill?",
"choice1":"a. Tina Turner",
"choice2":"b. Patti LaBelle",
"choice3":"c. Gladys Knight",
"choice4":"d. Shirley Bassey",
"answer":"c. Gladys Knight",
},
{"question":"The Magic Number was a 1989 hit for the band De La Soul. Which album of theirs did it appear on?",
"choice1":"a. 3 Feet High and Rising",
"choice2":"b. Buhloone Mindstate",
"choice3":"c. De La Soul Is Dead",
"choice4":"d. The Grind State",
"answer":"a. 3 Feet High and Rising"
},
{"question":"Which 80s Clash song, when re-released in 1991, went straight to number one in the UK?",
"choice1":"a. London Calling",
"choice2":"b. Straight to Hell",
"choice3":"c. Rock the Casbah",
"choice4":"d. Should I Stay or Should I Go?",
"answer":"d. Should I Stay or Should I Go?"
},
{"question":"Which Duran Duran song opened with a sample of laughter from the keyboardist’s girlfriend?",
"choice1":"a. Is There Something I Should Know?",
"choice2":"b. Hungry Like the Wolf",
"choice3":"c. Girls on Film",
"choice4":"d. The Wild Boys",
"answer":"b. Hungry Like the Wolf"
},
{"question":"Which New Wave band scored the mid-80s hit Somewhere in My Heart?",
"choice1":"a. Aztec Camera",
"choice2":"b. Blondie",
"choice3":"c. Ultravox",
"choice4":"d. Thompson Twins",
"answer":"a. Aztec Camera"
},
{"question":"The work of Fritz Lang inspired which Madonna video?",
"choice1":"a. Cherish",
"choice2":"b. Express Yourself",
"choice3":"c. Like a Prayer",
"choice4":"d. Oh Father",
"answer":"b. Express Yourself"
},
{"question":"The pencil-sketch animation technique used in the A-ha video Take On Me was known as what?",
"choice1":"a. Onion skinning",
"choice2":"b. Still motion",
"choice3":"c. Pinscreen",
"choice4":"d. Rotoscoping",
"answer":"d. Rotoscoping"
},
{"question":"How many singles were released from the Prince album Lovesexy?",
"choice1":"a. 2",
"choice2":"b. 3",
"choice3":"c. 4",
"choice4":"d. 5",
"answer":"b. 3"
},
{"question":"Which British band had the massive hit Fools Gold?",
"choice1":"a. The Stone Roses",
"choice2":"b. Lloyd Cole and the Commotions",
"choice3":"c. Pixies",
"choice4":"d. Joy Division",
"answer":"a. The Stone Roses"
},
{"question":"Which one of these songs by The Police did not chart in the 80s?",
"choice1":"a. Don’t Stand So Close to Me",
"choice2":"b. Every Breathe You Take",
"choice3":"c. Walking on the Moon",
"choice4":"d. Wrapped Around Your Finger",
"answer":"c. Walking on the Moon"
},
{"question":"Now known as a songwriter of hits like the Britney Spears song Toxic, Cathy Dennis was once a solo artist. Which 80s song marked her debut?",
"choice1":"a. Pump Up the Volume",
"choice2":"b. C’mon and Get My Love",
"choice3":"c. Theme from S’Express",
"choice4":"d. It Doesn’t Have To Be",
"answer":"b. C’mon and Get My Love"
},
{"question":"Which Grace Jones video featured excerpts from the experimental documentary film Koyaanisqatsi? ",
"choice1":"a. I Need a Man",
"choice2":"b. Slave to the Rhythmn",
"choice3":"c. Love on Top of Love",
"choice4":"d. Pull Up to the Bumper",
"answer":"d. Pull Up to the Bumper"
},
{"question":"Which Pet Shop Boys’ song was about the lead singer’s Catholic upbringing? ",
"choice1":"a. It’s a Sin",
"choice2":"b. What Have I Done to Deserve This?",
"choice3":"c. Always on my Mind",
"choice4":"d. Heart",
"answer":"a. It’s a Sin"
},
{"question":"‘Need You Tonight’ was released by which rock band?",
"choice1":"a. The Cure",
"choice2":"b. Metallica",
"choice3":"c. INXS",
"choice4":"d. Aerosmith",
"answer":"c. INXS"
},
{"question":"Kylie Minogue began her music career in the late 80s. Which one of the following has she not done a duet with? ",
"choice1":"a. Jimmy Plant",
"choice2":"b. Nick Cave",
"choice3":"c. Coldplay",
"choice4":"d. Shakira",
"answer":"d. Shakira"
},
{"question":"Which Frankie Goes to Hollywood song was banned on UK radio play in 1984, because of its lyrics?:",
"choice1":"a. Two Tribes",
"choice2":"b. Relax",
"choice3":"c. Welcome to the Pleasuredome",
"choice4":"d. Rage Hard",
"answer":"b. Relax "
},
{"question":"Which Peter Gabriel song was not a gigantic hit in the 80s?",
"choice1":"a. Red Rain",
"choice2":"b. Games Without Frontiers",
"choice3":"c. Don’t Give Up",
"choice4":"d. Sledgehammer",
"answer":"a. Red Rain"
},
{"question":"Which female singer was responsible for the song Could’ve Been?",
"choice1":"a. Debbie Gibson",
"choice2":"b. Paula Abdul",
"choice3":"c. Belinda Carlisle",
"choice4":"d. Tiffany",
"answer":"d. Tiffany"
},
{"question":"The French song Joe le Taxi, by Vanessa Paradis, charted at what position on the UK chart?",
"choice1":"a. 1",
"choice2":"b. 3",
"choice3":"c. 5",
"choice4":"d. 7",
"answer":"b. 3"
},
{"question":"Which Eurythmics song featured the lead singer entering a derelict cottage in a nightgown?",
"choice1":"a. Here Comes the Rain Again",
"choice2":"b. Right by Your Side",
"choice3":"c. Would I Lie to You",
"choice4":"d. Sweet Dreams (Are Made of This)",
"answer":"a. Here Comes the Rain Again"}]
}