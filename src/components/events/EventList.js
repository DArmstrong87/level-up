import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { getEvents, joinEvent, leaveEvent } from "./EventManager.js"
import "./Event.css"

export const EventList = (props) => {
    const [events, setEvents] = useState([])
    const history = useHistory()

    const eventFetcher = () => {
        getEvents()
            .then(data => setEvents(data))
    }

    useEffect(() => {
        eventFetcher()
    }, [])

    return (
        <article className="events">
            <button className="btn btn-2 icon-create"
                onClick={() => {
                    history.push({ pathname: "/events/new" })
                }}
            >🌟 Schedule New Event</button>

            {
                events.map(event => {
                    return <section key={`event--${event.id}`} className="event">
                        <div className="event__title">{event.game.title}</div>
                        <div className="event__description">{event.description}</div>
                        <div className="event__datetime">{event.date} at {event.time}</div>
                        <div className="event__organizer">
                            {`Hosted by ${event.organizer.user.first_name} 
                            ${event.organizer.user.last_name}`}
                        </div>
                        <div>
                            {
                                event.joined
                                    ? <button className="btn btn-3"
                                        onClick={() => leaveEvent(event.id).then(() => eventFetcher())}
                                    >Leave</button>
                                    : <button className="btn btn-2"
                                        onClick={() => joinEvent(event.id).then(() => eventFetcher())}
                                    >Join</button>
                            }
                        </div>
                    </section>
                })
            }
        </article>
    )
}
