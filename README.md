# Racetrack Info-Screens

A local racetrack needs a system to control races and inform spectators. You'll create a real-time system so that everyone has the information they need, exactly when they need it.

## Table of Contents
- [Introduction](#introduction)
- [Functional Requirements](#functional-requirements)
- [User Personas](#user-personas)
- [Race Sessions](#race-sessions)
- [Race Cars](#race-cars)
- [Current Race Modes](#current-race-modes)
- [Interfaces](#interfaces)
- [Technology](#technology)
- [Security](#security)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Extra Requirements](#extra-requirements)
- [Bonus Functionality](#bonus-functionality)

## Introduction

Beachside Racetrack is located next to a beach in a very touristic area. To reduce reliance on staff, the racetrack requires a way to prepare the next race, control races, and inform spectators.

This project aims to develop a real-time system to address these needs, based on the user stories and requirements provided by the Product Manager.

## Functional Requirements

Beachside Racetrack is looking for a Minimum Viable Product (MVP) to solve their biggest problems.

## User Personas

- **Employee:** An employee of Beachside Racetrack.
  - **Safety Official:** Controls the race and ensures safety.
  - **Lap-line Observer:** Records when cars cross the lap line.
  - **Flag Bearer:** Uses flags to communicate safety instructions to drivers.
  - **Receptionist:** Welcomes guests and registers race drivers.
- **Guest:** A person present at Beachside Racetrack who is not an employee.
  - **Race Driver:** A guest who takes part in a race.
  - **Spectator:** A guest who watches a race.

## Race Sessions

A race session is an instance of a race where up to 8 drivers try to get the fastest lap. The race finishes after 10 minutes, and the winner is the driver with the fastest lap time.

## Race Cars

Each race car is equal in performance and is represented by a number, which is used to track performance during races.

## Current Race Modes

The system uses flags to communicate race modes:

- **Safe:** No flag.
- **Hazard:** Yellow flag, drive slowly.
- **Danger:** Red flag, stop driving.
- **Finish:** Chequered flag, proceed to the pit lane.

## Interfaces

### Employee Interfaces

| Interface       | Persona          | Route          |
|-----------------|------------------|----------------|
| Front Desk      | Receptionist     | /front-desk    |
| Race Control    | Safety Official  | /race-control  |
| Lap-line Tracker| Lap-line Observer| /lap-line-tracker|

### Public Displays

| Interface       | Persona     | Route         |
|-----------------|-------------|---------------|
| Leader Board    | Guest       | /leader-board |
| Next Race       | Race Driver | /next-race    |
| Race Countdown  | Race Driver | /race-countdown|
| Race Flag       | Race Driver | /race-flags   |

## Technology

- **Server:** Node.js
- **Real-time Functionality:** Socket.IO
- **Start Server:** `npm start`
- **Development Mode:** `npm run dev` (1-minute race duration)

## Security

Employee interfaces are protected by access keys set as environment variables.

Example:
```bash
export receptionist_key=8ded6076
export observer_key=662e0f6c
export safety_key=a2d393bc
npm start



When server is started default state will be empty races, no ongoing race. 

Front desk will add races and drivers. Race-control interface will be updated with drivers of next race as this happens (). 

-This is currently the default starting state as we have 2 sample races added

Race starts - When drivers have been briefed and race is ready to start safety official clicks start race button, in database raceMode is changed from next race to ongoing race (function startRace(io,updatedRace))(race-control instructs dataStore to do mode change and dataStore informs all concerned interfaces to update), flag display is changed (socket.on('raceModeChange', mode)

During race - safety official can change race mode(raceModeChange) and finish race manually (function endRace). Timer, lap line tracker, leaderboard also do stuff here

Race finishes - As timer runs out or race is finished by safety official, checkered flag is displayed(raceModeChange) to instruct all drivers to proceed to pit area. Race mode needs to be changed to Finished (function endRace) Other interfaces need to be also informed

Race session is ended - As the cars have returned to the pit lane, the Safety Official can end the Session. Race-control driver list is updated () Race mode changes to "Danger" (raceModeChange) Next Race screen now displays the current session's drivers(nextRaceChange), and displays an extra message to tell them to proceed to the paddock ()