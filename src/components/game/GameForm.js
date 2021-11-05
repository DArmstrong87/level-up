import React, { useState, useEffect, useRef } from "react"
import { useHistory } from 'react-router-dom'
import { createGame, getGameTypes } from './GameManager.js'
import "../../index.css"

export const GameForm = () => {
    const history = useHistory()
    const [gameTypes, setGameTypes] = useState([])
    const skillLevel = useRef()

    /*
        Since the input fields are bound to the values of
        the properties of this state variable, you need to
        provide some default values.
    */
    const [currentGame, setCurrentGame] = useState({
        skillLevel: 1,
        numberOfPlayers: 0,
        title: "",
        maker: "",
        gameTypeId: 0
    })

    useEffect(() => {
        getGameTypes()
            .then(types => setGameTypes(types))
    }, [])

    /*
        REFACTOR CHALLENGE START

        Can you refactor this code so that all property
        state changes can be handled with a single function
        instead of five functions that all, largely, do
        the same thing?
        
        One hint: [event.target.name]
        */
    const changeGameState = (event) => {
        const newGameState = { ...currentGame }
        newGameState[event.target.name] = event.target.value
        setCurrentGame(newGameState)

        if (newGameState.skillLevel > 5) {
            newGameState.skillLevel = 0
            setCurrentGame(newGameState)
            skillLevel.current.showModal()
        }
    }
    console.log(currentGame)

    return (<>
        <dialog ref={skillLevel}>
            <h3>Please enter a number between 1-5</h3>
            <button onClick={() => skillLevel.current.close()}>Close</button>
        </dialog>

        <form className="gameForm">
            <h2 className="gameForm__title">Register New Game</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="title">Title: </label>
                    <input type="text" name="title" required autoFocus className="form-control"
                        value={currentGame.title}
                        onChange={changeGameState}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="maker">Maker: </label>
                    <input type="text" name="maker" required autoFocus className="form-control"
                        value={currentGame.maker}
                        onChange={changeGameState}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="maker">Game Type: </label>
                    <select type="text" name="gameTypeId" required autoFocus className="form-control"
                        value={currentGame.gameTypeId}
                        onChange={changeGameState}
                    >
                        <option disabled value={0}>Select game type</option>
                        {gameTypes.map(gameType => {
                            return <option value={gameType.id}>{gameType.label}</option>
                        })}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="skillLevel">Skill Level: </label>
                    <input type="number" max='5' name="skillLevel" required autoFocus className="form-control"
                        value={currentGame.skillLevel}
                        onChange={changeGameState}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="title">Number of Players: </label>
                    <input type="numberOfPlayers" name="numberOfPlayers" required autoFocus className="form-control"
                        value={currentGame.numberOfPlayers}
                        onChange={changeGameState}
                    />
                </div>
            </fieldset>

            {/* TODO: create the rest of the input fields */}

            <button type="submit"
                onClick={evt => {
                    // Prevent form from being submitted
                    evt.preventDefault()

                    const game = {
                        maker: currentGame.maker,
                        title: currentGame.title,
                        numberOfPlayers: parseInt(currentGame.numberOfPlayers),
                        skillLevel: parseInt(currentGame.skillLevel),
                        gameTypeId: parseInt(currentGame.gameTypeId)
                    }

                    // Send POST request to your API
                    createGame(game)
                        .then(() => history.push("/"))
                }}
                className="btn icon-create">🌟Create</button>
        </form>
    </>)
}
