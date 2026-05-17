import { io } from 'socket.io-client'

const SOCKET_URL = __DEV__
  ? 'http://192.168.0.100:6868'
  : 'https://taxi-mouine.de'

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: false,
})

export { socket as io }
