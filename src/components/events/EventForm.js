import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import "../../index.css"
import { getGames } from "../game/GameManager"
import { createEvent } from "./EventManager"

export const EventForm = () => {
    const history = useHistory()
    const [games, setGames] = useState([])

    const [newEvent, setNewEvent] = useState({
        date: "",
        time: "",
        gameId: 0,
        description: ""
    })

    useEffect(() => {
        getGames()
            .then(games => setGames(games))
    }, [])

    const changeEventState = (event) => {
        const newEventState = { ...newEvent }
        if (event.target.name === 'gameId') {
            newEventState[event.target.name] = parseInt(event.target.value)
        } else {
            newEventState[event.target.name] = event.target.value
        }
        setNewEvent(newEventState)
    }
    console.log(newEvent)

    return (<>

        <form className="eventForm">
            <h2 className="eventForm__title">Schedule New Event</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="maker">Game Type: </label>
                    <select type="text" name="gameId" required autoFocus className="form-control"
                        value={newEvent.gameId}
                        onChange={changeEventState}
                    >
                        <option disabled value={0}>Select game type</option>
                        {games.map(game => {
                            return <option value={game.id}>{game.title}</option>
                        })}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description: </label>
                    <textarea type="text" name="description" required autoFocus className="form-control"
                        value={newEvent.description}
                        onChange={changeEventState}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date: </label>
                    <input type="date" name="date" required autoFocus className="form-control"
                        value={newEvent.date}
                        onChange={changeEventState}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="time">Time: </label>
                    <input type="time" name="time" required autoFocus className="form-control"
                        value={newEvent.time}
                        onChange={changeEventState}
                    />
                </div>
            </fieldset>

            <button type="submit"
                onClick={evt => {
                    evt.preventDefault()

                    createEvent(newEvent)
                        .then(() => history.push("/events"))
                }}
                className="btn icon-create">🌟 Create</button>
        </form>
    </>)
}
