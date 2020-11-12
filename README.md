# Mediavine Soccer Tournament Code Challenge
Author: Dave Young  dave@rev4media.com
This small program takes one command line argument: a data file containing the match results for soccer tournaments

It will calculate the number of points for each team based on each match's result over the course of the tournament

The number of points awarded for wins and ties are modifiable via the MATCH_WIN_POINTS and MATCH_TIE_POINTS constants
Currently, these are set to 3 points per win, and 1 point for a tie

If teams tie in the overall tournament points, they each will have the same rank

To run the program, type node index.js <datafilename> 
ex: "node index.js 2015-Matches.txt"

A data file is included from last season, 2015-Matches.txt