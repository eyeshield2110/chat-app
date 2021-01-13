const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    username = username.trim()
    room = room.trim()

    // validate
    if (!username || !room) {
        return {
            error: 'Username and room are required',
            user: undefined
        }
    }
    // existing user
    const existingUser = users.find((user) => {
        return user.room == room && user.username === username
    })
    // validate username
    if (existingUser) {
        return {
            error: 'Username already taken',
            user: undefined
        }
    }
    // store user
    const user = { id, username, room }
    users.push(user)
    return { error: undefined, user: user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

function getUser(id) {
    return users.find((user) => user.id == id) // or ===
}

function getUsersInRoom(room) {
    return users.filter((user) => user.room == room) // or ===
}
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

/* ---------------------------------- Testing ---------------------------------- */
/*let res = []
addUser({
        id:22,
        username:'Andy',
        room:'1'
    })
res.push(addUser({
        id:32,
        username:'George',
        room:'2'
    }))
addUser({
        id:13,
        username:'Jen',
        room:'1'
    })
res.push(addUser({
    id:3,
    username:"",
    room:""
}))

console.log("After adding users:", users)

console.log("Finding user id 22:", getUser(1))
console.log("Users in room 1:", getUsersInRoom(1))

removeUser(3)
removeUser(13)
removeUser(32)
removeUser(22)

console.log("After removing users:", users)*/

