import React, { useState, useEffect, useRef } from "react"
import { useHistory, useParams } from 'react-router-dom'
import { createGame, getGame, getGameTypes, updateGame } from './GameManager.js'
import "../../index.css"

export const GameForm = () => {
    const history = useHistory()
    const [gameTypes, setGameTypes] = useState([])
    const skillLevel = useRef()
    const [editMode, setEditMode] = useState(false)
    const { gameId } = useParams()
    const [currentGame, setCurrentGame] = useState({})
    console.log(gameId)
    console.log(editMode)

    const getGameToEdit = () => {
        if (gameId) {
            setEditMode(true)
            getGame(gameId)
                .then(game => setCurrentGame(game))
        } else {
            setCurrentGame({
                skill_level: 1,
                number_of_players: 0,
                title: "",
                maker: "",
                gameTypeId: 0
            })
        }
    }

    useEffect(() => {
        getGameTypes()
            .then(types => setGameTypes(types))
        getGameToEdit()
    }, [])

    const changeGameState = (event) => {
        const newGameState = { ...currentGame }
        newGameState[event.target.name] = event.target.value
        setCurrentGame(newGameState)

        if (newGameState.skill_level > 5) {
            newGameState.skill_level = 0
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
            <h2 className="gameForm__title">
                {editMode ? 'Edit Game' : 'Register New Game'}
            </h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="title">Title: </label>
                    <input type="text" name="title" required autoFocus className="form-control"
                        value={currentGame?.title}
                        onChange={changeGameState}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="maker">Maker: </label>
                    <input type="text" name="maker" required autoFocus className="form-control"
                        value={currentGame?.maker}
                        onChange={changeGameState}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="maker">Game Type: </label>
                    <select type="text" name="gameTypeId" required autoFocus className="form-control"
                        defaultValue={0}
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
                    <input type="number" max='5' name="skill_level" required autoFocus className="form-control"
                        value={currentGame?.skill_level}
                        onChange={changeGameState}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="title">Number of Players: </label>
                    <input type="numberOfPlayers" name="number_of_players" required autoFocus className="form-control"
                        value={currentGame?.number_of_players}
                        onChange={changeGameState}
                    />
                </div>
            </fieldset>

            <button type="submit"
                onClick={evt => {
                    evt.preventDefault()

                    const game = {
                        maker: currentGame.maker,
                        title: currentGame.title,
                        numberOfPlayers: parseInt(currentGame.number_of_players),
                        skillLevel: parseInt(currentGame.skill_level),
                        gameTypeId: parseInt(currentGame.gameTypeId)
                    }
                    if (isNaN(game.gameTypeId)) {
                        game.gameTypeId = currentGame.game_type.id
                    } else {
                        game.gameTypeId = parseInt(currentGame.gameTypeId)
                    }

                    {
                        editMode ?
                            updateGame(game, gameId).then(() => history.push("/"))
                            : createGame(game)
                                .then(() => history.push("/"))
                    }
                }}
                className="btn icon-create">🌟 {editMode ? 'Save' : 'Create'}</button>
        </form>
    </>)
}
