When server is started default state will be empty races, no ongoing race. 

Front desk will add races and drivers. Race-control interface will be updated with drivers of next race as this happens (). 

This currently starting state as we have 2 sample races added

Race starts - When drivers have been briefed and race is ready to start safety official clicks start race button, in database raceMode is changed from next race to ongoing race (function startRace(io,updatedRace))(race-control instructs dataStore to do mode change and dataStore informs all concerned interfaces to update), flag display is changed (socket.on('raceModeChange', mode)

During race - safety official can change race mode(raceModeChange) and finish race manually (function endRace). Timer, lap line tracker, leaderboard also do stuff here

Race finishes - As timer runs out or race is finished by safety official, checkered flag is displayed(raceModeChange) to instruct all drivers to proceed to pit area. Race mode needs to be changed to Finished (function endRace) Other interfaces need to be also informed

Race session is ended - As the cars have returned to the pit lane, the Safety Official can end the Session. Race-control driver list is updated () Race mode changes to "Danger" (raceModeChange) Next Race screen now displays the current session's drivers(nextRaceChange), and displays an extra message to tell them to proceed to the paddock ()