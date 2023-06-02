import io from 'socket.io-client'

export const socket = io(
	process.env.NODE_ENV === 'development'
		? 'http://localhost:4000'
		: process.env.SOCKET_SERVER_URL ??
				'https://arduino-plant-moisture-production.up.railway.app',
)
