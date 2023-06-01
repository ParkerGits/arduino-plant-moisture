import { MoistureData, MoistureDataTimestamped } from '@/utils/constants'
import { useState, useEffect } from 'react'
import { socket } from '../socket'

export default function usePlantSocket() {
	const [isConnected, setIsConnected] = useState(socket.connected)
	const [data, setData] = useState<MoistureDataTimestamped[]>([])

	useEffect(() => {
		function onConnect() {
			setIsConnected(true)
		}

		function onDisconnect() {
			setIsConnected(false)
		}

		function onNewData(newData: MoistureData) {
			setData([...data, { ...newData, timestamp: Date.now() }])
		}

		socket.on('connect', onConnect)
		socket.on('disconnect', onDisconnect)
		socket.on('newData', onNewData)

		return () => {
			socket.off('connect', onConnect)
			socket.off('disconnect', onDisconnect)
			socket.off('newData', onNewData)
		}
	}, [data])

	return { isConnected, data }
}
