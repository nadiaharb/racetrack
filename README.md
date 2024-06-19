## Table of Contents
- [Introduction](#introduction)
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

This project aims has developed a real-time system to address these needs, based on the user stories and requirements provided by the Product Manager.

This is the Minimum Viable Product (MVP).


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

A race session is an instance of a race where up to 8 Race Drivers participate.
The race finishes after 10 minutes (in normal mode).

## Race Cars

Each race car is equal in performance and is represented by a number, which is used to track performance during races.

## Current Race Modes

The system uses flags to communicate race modes:

- **Safe:** Solid Green flag.
- **Hazard:** Solid Yellow flag, drive slowly.
- **Danger:** Solid Red flag, stop driving.
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

- **Server:** NodeJS
- **Real-time Functionality:** Socket.IO
- **Start Server:** `export RECEPTIONIST_KEY=8ded6076 export OBSERVER_KEY=662e0f6c export SAFETY_KEY=a2d393bc && npm start` (10-minute race duration)
- **Development Mode:** `export RECEPTIONIST_KEY=8ded6076 export OBSERVER_KEY=662e0f6c export SAFETY_KEY=a2d393bc && npm run dev` (1-minute race duration)
- **Test Mode:** `npm test` (1-minute race duration, no need to set env vars - Default password is `1`). [BONUS FUNCTIONALITY]

## Security

Employee interfaces are protected by access keys set as environment variables.

## Getting Started

### Prerequisites

- NodeJS

### Installation

1. Clone the repository:

    ```bash
    git clone https://gitea.kood.tech/taavitaht/racetrack.git
    cd racetrack
    ```

2. Install dependencies:

    ```bash
    npm i loglevel socket.io sqlite3 @socket.io/admin-ui
    ```

3. Set environment variables (Define keys for restricted views):

    ```bash
    export RECEPTIONIST_KEY=8ded6076
    export OBSERVER_KEY=662e0f6c
    export SAFETY_KEY=a2d393bc
    ```

4. Start the server (Race timers are set to 10 minutes):

    ```bash
    npm start
    ```

5. For development mode (Race timers are set to 1 minute):

    ```bash
    npm run dev
    ```

## Usage Guide

### Front Desk (```/front-desk```)

- **Add/Remove Race Sessions:** Allows the receptionist to manage race sessions.
- **Add/Remove/Edit Race Drivers:** Allows the receptionist to manage drivers.

### Safety Official View (```/race-control```)

- **Start Race:** Starts the race and changes the race mode to "Safe".
- **Control Race Modes:** Changes the race mode (Safe, Hazard, Danger, Finish).
- **End Race:** Ends the race and changes the race mode to "Finished".

### Lap-Line Observer (```/lap-line-tracker```)

- **Record Lap Times:** Records when cars cross the lap line.

### Leader Board (```/leader-board```)

- **View Lap Times:** Displays the fastest laptimes for each driver along with their positions in relation to each other in terms of shortest (best) laps.

### Next Race (```/next-race```)

- **View Next Race:** Displays the list of drivers and assigned cars for the next race session.

### Race Countdown (```/race-countdown```)

- **View Countdown:** Displays the race countdown timer.

### Race Flag (```/race-flags```)

- **View Flag Display:** Displays the current race mode using flag colors.

## Extra Features

- **Persist Data:** Implemented data persistence so that the server can be restarted without losing data. 
(COMING SOON)

- **Select Cars:** Allows the receptionist to define which cars drivers will race in.

## Bonus Functionality

- **NGROK hosting:** App supports hosting over [ngrok](https://ngrok.com/download) and can be easily hosted after successfully installing ngrok:

```ngrok http 3000```

- **Data persistence** Simple data persistence via [SQLite3](https://www.npmjs.com/package/sqlite3) has been implemented via socket events along with advanced error handling for various edge cases so that data is not lost upon program crashes. Resuming the program is possible and requires no additional input from the user.

Other ports can be used if the user modifies the .env file to specify a different port alias.


## Relevant Topics

- [Socket.IO](https://socket.io/)
- [Node.JS](https://nodejs.org/)
- [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product)
- [Product Manager](https://en.wikipedia.org/wiki/Product_manager)
- [User Stories](https://en.wikipedia.org/wiki/User_story)
- [User Personas](https://en.wikipedia.org/wiki/User_persona)

## What the project demonstrates

- Real-time functionality
- Socket.IO
- Environment variables
- Node.JS