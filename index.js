// Dave Young  dave@rev4media.com
// Mediavine Code Test 1
// https://www.notion.so/Soccer-Rank-Calculator-851109ed5c7f489792617b8fe9498c40
// This file takes input arguments for score data and outputs tournament results

const fs = require('fs').promises;

let tournamentData = [];
const MATCH_WIN_POINTS = 3;
const MATCH_TIE_POINTS = 1;

async function calculateTournamentResults(){

    //1 - get the score data from an input file
    let matchResultsData = await getMatchResultsData();
    if(matchResultsData.length === 0 ){
        console.log("error: invalid match score data");
        return
    }

    //2 - process the match results data into tournament matches and points by team
    processMatchResults(matchResultsData);

    //3 - sort the tournament score data by points and names
    tournamentData = sortTournamentScores(tournamentData);

    //4 - output the tournament results by team rank
    outputTournamentResults(tournamentData);
}


/////////////////////////
// creates an array of match results given a command line argument for input data file
/////////////////////////
async function getMatchResultsData(){
    
    let scoreLines = [];
    //console.log(process.argv);
    let inputArgs = process.argv.slice(2);
    //console.log(inputArgs);

    if(inputArgs.length === 0){
        console.log("error: missing input file paramater");
        return;
    }

    let inputFile = inputArgs[0];
    //console.log("Reading match info from: " + inputFile);
    
    try {
        const data = await fs.readFile(inputFile, "utf8");

        //Split the data file by line
        scoreLines = data.split("\r\n");
        return scoreLines;

    } catch (err) {
        console.log(err);
        return scoreLines;
    }
    
}

function processMatchResults(scoreData){
    
    //console.log(scoreData);
    scoreData.forEach((matchInfo,matchInfoIndex) => {
        
        //keep track of the current line number, for data debugging help
        let matchResultNumber = matchInfoIndex + 1;

        //Split the match data into 2 parts: team 1 info and team 2 info
        let thisMatchInfo = matchInfo.split(",");

        if(thisMatchInfo.length < 2){
            console.log("ERROR on match result #" + matchResultNumber + ": invalid number of teams/scores supplied for match result");
            return;
        }

        //Remove any whitespace before/after
        let team1Data = thisMatchInfo[0].trim();
        let team2Data = thisMatchInfo[1].trim();

        //Split the team info into 2 parts: team name and score
        let matchTeam1Data = team1Data.split(" ");
        let matchTeam2Data = team2Data.split(" ");

        if(matchTeam1Data.length < 2){
            console.log("ERROR on match result #" + matchResultNumber + ": invalid Team 1 name/score data supplied for match result");
            return;
        }

        if(matchTeam2Data.length < 2){
            console.log("ERROR on match result #" + matchResultNumber + ": invalid Team 2 name/score data supplied for match result");
            return;
        }

      
        //Assign the team variables and parse/compare scores
        //Note: the team name itself can have a space in it, so use the last array position as the score
        let team1ScoreIndex = matchTeam1Data.length - 1;        
        let team1Name = matchTeam1Data.slice(0,-1).join(" ");
        let team1Score = parseInt(matchTeam1Data[team1ScoreIndex]);
        
        let team2ScoreIndex = matchTeam2Data.length - 1;
        let team2Name = matchTeam2Data.slice(0,-1).join(" ");
        let team2Score = parseInt(matchTeam2Data[team2ScoreIndex]);


        if(isNaN(team1Score)){
            console.log("ERROR on match result #" + matchResultNumber + ": match score for Team 1 is missing or is not a number")
            return;
        }

        if(isNaN(team2Score)){
            console.log("ERROR on match result #" + matchResultNumber + ": match score for Team 2 is missing or is not a number")
            return;
        }


        //console.log("Team 1: " + team1Name + " Score: " + team1Score);
        //console.log("Team 2: " + team2Name + " Score: " + team2Score);

        //Initialize tournament points (the assign function will skip if not needed)
        validateTournamentTeams(team1Name,team2Name);
        
        //Who won the match? Assign tournament points
        if(team1Score > team2Score){
            assignTournamentPoints(team1Name,MATCH_WIN_POINTS);
        }

        if(team2Score > team1Score){
            assignTournamentPoints(team2Name,MATCH_WIN_POINTS);
        }

        if(team1Score === team2Score){
            assignTournamentPoints(team1Name,MATCH_TIE_POINTS);
            assignTournamentPoints(team2Name,MATCH_TIE_POINTS);
        }
    });
}

function assignTournamentPoints(teamName, points){
    //console.log("Assigning " + points + " points to " + teamName);
    
    //Look for the team in the tournament list and add points, otherwise initialize with given points
    var teamIndex = tournamentData.findIndex(x => x.name==teamName)

    if(teamIndex === -1){
        let teamObject = {
            name: teamName,
            points: points
        };

        tournamentData.push (teamObject);
    } else {
        tournamentData[teamIndex].points += points;
    }
       
}

function validateTournamentTeams(team1Name, team2Name){
    //Each team starts with 0 points
    assignTournamentPoints(team1Name,0);
    assignTournamentPoints(team2Name,0);
}

function sortTournamentScores(scoreSet){

    scoreSet.sort(function (team1, team2) {

        // Sort by tournament points, higher points = lower rank number
        if (team1.points < team2.points) return 1;
        if (team1.points > team2.points) return -1;

        // Secondary sort by team name, alphabetically
        if (team1.name > team2.name) return 1;
        if (team1.name < team2.name) return -1;

    });

    return scoreSet;
}

function outputTournamentResults(tournamentData){
    
    let lastRank = 1;
    let lastPoints = -999;
    //console.log(tournamentData);
    tournamentData.forEach((teamInfo,rankCounter) => {
        
        //Increment the displayed rank
        let displayRank = rankCounter + 1;

        //Do we have the same points as the last team displayed? If so, the displayed rank stays the same
        if(teamInfo.points == lastPoints){
            displayRank = lastRank;
        }

        console.log(displayRank + ". " + teamInfo.name + " " + teamInfo.points);
        lastPoints = teamInfo.points;
        lastRank = displayRank;
    });
}

calculateTournamentResults();