import React, { useState, useEffect, createContext, useContext, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Router, Link } from '@reach/router'
import ApolloClient, { HttpLink, ApolloLink, InMemoryCache } from 'apollo-boost'
import { ApolloProvider, Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const UserContext = createContext({ user: null, updateUser: () => true })

function useUser() {
  const { user, updateUser } = useContext(UserContext)
  return { user, updateUser }
}

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

const GET_MESSAGES_FOR_ROOM = gql`
  query ($roomId:Int!) {
    messagesForRoom(roomId:$roomId) {
      id
      user
      text
      createdAt
    }
  }
`

const ADD_MESSAGE_TO_ROOM = gql`
  mutation ($roomId:Int!, $user:String!, $text:String!) {
    messageCreate(roomId:$roomId, user:$user, text:$text) {
      message {
        id
        user
        text
      }
    }
  }
`

const Room = ({ id, title, lastMessage }) => {
  return (
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
}

const RoomList = ({ loading, error, data }) => {

  if (loading || error) return null
  return data.rooms.map((room) => (
    <Room
      key={room.id}
      id={room.id}
      title={room.title}
      lastMessage={room.lastMessage && room.lastMessage.text}
    />
  ))
}

const Rooms = () => (
  <div className="list-group">
    <Query
      query={GET_ROOMS}
      pollInterval={500}
    >
      {props => <RoomList {...props} />}
    </Query>
  </div>
)

const NewMessageForm = ({ roomId }) => {
  const [drafts, setDrafts] = useState({})
  const { user } = useUser()

  function onChange(e) {
    const value = e.currentTarget.value
    setDrafts({...drafts, [roomId]: value})
  }

  function onSubmit(addTodo) {
    return (e) => {
      e.preventDefault()

      if (!drafts[roomId] || drafts[roomId] === '') return

      addTodo({ variables: { roomId: parseInt(roomId), user, text: drafts[roomId] } })
        .then(({ data, error }) => {
          setDrafts({...drafts, [roomId]: ''})
        })
    }
  }

  return (
    <Mutation mutation={ADD_MESSAGE_TO_ROOM}>
      {(addTodo) => (
        <form className="bg-white border-top d-flex p-3" onSubmit={onSubmit(addTodo)}>
          <input className="form-control" placeholder="Enter your message here." value={drafts[roomId] || ''} onChange={onChange} />
          <button className="btn btn-primary ml-2" disabled={!drafts[roomId] || drafts[roomId] === ''}>Post</button>
        </form>
      )}
    </Mutation>
  )
}

const Message = ({ user, text }) => (
  <div className="row border-top py-3">
    <div className="col-2 text-secondary text-right">
      {user}
    </div>
    <div className="col-10">
      {text}
    </div>
  </div>
)

const MessageList = ({ roomId, loading, error, data }) => {
  const lastMessage = useRef()

  useEffect(() => {
    if (!lastMessage.current) return
    lastMessage.current.scrollIntoView({ behavior: 'smooth' })
  }, [(data.messagesForRoom || []).map(m => m.id)])

  if (loading || error) return null

  return (data.messagesForRoom || []).map((message) => (
    <div key={message.id} ref={lastMessage}>
      <Message user={message.user} text={message.text} />
    </div>
  ))
}

const Messages = ({ roomId }) => {
  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 overflow-auto p-3 bg-light">
        <Query
          query={GET_MESSAGES_FOR_ROOM}
          variables={{ roomId: parseInt(roomId) }}
          pollInterval={500}
        >
          {props => <MessageList roomId={roomId} {...props} />}
        </Query>
      </div>

      <NewMessageForm roomId={roomId} />
    </div>
  )
}

const UserInput = () => {
  const { user, updateUser } = useUser()
  const [ name, setName ] = useState(user)

  function onBlur() {
    updateUser(name)
  }

  function onChange(e) {
    setName(e.currentTarget.value)
  }

  return (
    <input type="text" className="form-control" placeholder="Username" value={name} onChange={onChange} onBlur={onBlur} />
  )
}

const App = () => {
  const [user, setUser] = useState('')

  return (
    <UserContext.Provider value={{ user, updateUser: setUser }}>
      <ApolloProvider client={client}>
        <div className="container">
          <div className="d-flex justify-content-between my-3">
            <h1>Chat</h1>
            <div>
              <UserInput />
            </div>
          </div>

          <div className="row border rounded" style={{height: 600}}>
            <div className="col-3 h-100 overflow-auto px-0 bg-dark">
              <Rooms />
            </div>

            <div className="col-9 px-0 h-100">
              <Router className="h-100">
                <Messages path="/room/:roomId" />
              </Router>
            </div>
          </div>
        </div>
      </ApolloProvider>
    </UserContext.Provider>
  )
}

ReactDOM.render(<App />, document.querySelector('#app'))
