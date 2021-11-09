import React, { useState, useEffect } from "react"
import { useHistory, useParams } from 'react-router-dom'
import "../../index.css"
import { getGames } from "../game/GameManager"
import { createEvent, getEvent, updateEvent } from "./EventManager"

export const EventForm = () => {
    const history = useHistory()
    const [games, setGames] = useState([])
    const [newEvent, setNewEvent] = useState({})
    const [editMode, setEditMode] = useState(false)

    const { eventId } = useParams()

    const getEventToEdit = () => {
        if (eventId) {
            setEditMode(true)
            getEvent(eventId)
                .then(event => setNewEvent(event))
        }
    }

    useEffect(() => {
        getGames()
            .then(types => setGames(types))
        getEventToEdit()
    }, [])

    const changeEventState = (event) => {
        const newEventState = { ...newEvent }
        if (event.target.name === 'gameId') {
            newEventState[event.target.name] = parseInt(event.target.value)
        } else {
            newEventState[event.target.name] = event.target.value
        }
        if (isNaN(newEventState.gameId)) {
            newEventState.game_id = newEvent.game?.id
        } else {
            newEventState.game_id = parseInt(newEvent.gameId)
        }
        setNewEvent(newEventState)
    }
    console.log(newEvent)

    return (<>

        <form className="eventForm">
            <h2 className="eventForm__title">{editMode ? 'Update Event' : 'Schedule New Event'}</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="maker">Game: </label>
                    <select type="text" name="gameId" required autoFocus className="form-control"
                        defaultValue={0}
                        onChange={changeEventState}
                    >
                        <option disabled value={0}>Select Game</option>
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


                    {
                        editMode ?
                            updateEvent(newEvent, eventId)
                                .then(() => history.push("/events"))
                            :
                            createEvent(newEvent)
                                .then(() => history.push("/events"))
                    }
                }}
                className="btn icon-create">🌟 {editMode ? 'Update' : 'Create'}</button>
        </form>
    </>)
}
