import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Router, Link } from '@reach/router'
import ApolloClient from 'apollo-boost'
import { ApolloProvider, Query } from 'react-apollo'
import gql from 'graphql-tag'

const client = new ApolloClient();

const GET_ROOMS = gql`
  query {
    rooms {
      id
      title
      
      lastMessage {
        id
        user
        text
        createdAt
      }
    }
  }
`

const MESSAGES_FOR_ROOM = gql`
  query ($roomId:Int!) {
    messagesForRoom(roomId:$roomId) {
      id
      user
      text
      createdAt
    }
  }
`

const Room = ({ id, title, lastMessage }) => (
  <Link
    to={`/room/${id}`}
    getProps={({ isCurrent }) => ({
      className: isCurrent ? 'list-group-item list-group-item-action bg-primary text-white' : 'list-group-item list-group-item-action bg-dark text-white'
    })}
  >
    <h4>{title}</h4>
    <span className="text-white-50">{lastMessage}</span>
  </Link>
)

const RoomList = () => (
  <div className="list-group">
    <Query query={GET_ROOMS}>
      {({ loading, error, data }) => {
        if (loading || error) return null

        return data.rooms.map((room) => (
          <Room key={room.id} id={room.id} title={room.title} lastMessage={room.lastMessage && room.lastMessage.text} />
        ))
      }}
    </Query>
  </div>
)

const NewMessageForm = () => {
  const [text, setText] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    setText('')
  }

  return (
    <form className="bg-white border-top d-flex p-3" onSubmit={onSubmit}>
      <input className="form-control" placeholder="Enter your message here." value={text} onChange={e => setText(e.currentTarget.value)} />
      <button className="btn btn-primary ml-2">Post</button>
    </form>
  )
}

const Message = ({ user, text }) => (
  <div className="row border-top py-3">
    <div className="col-md-2 text-secondary text-right">
      {user}
    </div>
    <div className="col-md-10">
      {text}
    </div>
  </div>
)

const MessageList = ({ roomId }) => (
  <div className="d-flex flex-column h-100">
    <div className="flex-grow-1 overflow-auto p-3 bg-light">
      <Query query={MESSAGES_FOR_ROOM} variables={{ roomId: parseInt(roomId) }}>
        {({ loading, error, data }) => {
          if (loading || error) return null

          return (data.messagesForRoom || []).map((message) => (
            <Message key={message.id} user={message.user} text={message.text} />
          ))
        }}
      </Query>
    </div>

    <NewMessageForm />
  </div>
)

const App = () => (
  <ApolloProvider client={client}>
    <div className="container">
      <div className="d-flex justify-content-between my-3">
        <h1>Chat</h1>
        <div>
          <input className="form-control" placeholder="Username" />
        </div>
      </div>

      <div className="row border rounded" style={{height: 600}}>
        <div className="col-md-3 h-100 overflow-auto px-0 bg-dark">
          <RoomList />
        </div>

        <div className="col-md-9 px-0 h-100">
          <Router className="h-100">
            <MessageList path="/room/:roomId" />
          </Router>
        </div>
      </div>
    </div>
  </ApolloProvider>
)

ReactDOM.render(<App />, document.querySelector('#app'))
