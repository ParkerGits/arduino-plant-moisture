import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import usePlantSocket from '@/hooks/usePlantSocket'
import { useEffect, useState } from 'react'
import {
	ANALOG_PIN_FIELDS,
	DataToggles,
	MoistureDataTimestamped,
	initialToggles,
} from '@/utils/constants'
import DataToggle from '@/components/DataToggle'
import axios from 'axios'

const inter = Inter({ subsets: ['latin'] })

const MoistureChart = dynamic(() => import('../components/MoistureChart'), {
	ssr: false,
})

export default function Home() {
	const { isConnected, data: liveData } = usePlantSocket()
	const [toggles, setToggles] = useState<DataToggles>(initialToggles)
	const [showHistory, setShowHistory] = useState<boolean>(false)
	const [startHistory, setStartHistory] = useState<number | null>(null)
	const [endHistory, setEndHistory] = useState<number | null>(null)
	const [historyData, setHistoryData] = useState<
		MoistureDataTimestamped[] | null
	>(null)
	// useEffect(() => {
	// 	const url =
	// 		process.env.NODE_ENV === 'development'
	// 			? 'http://localhost:4000'
	// 			: process.env.SOCKET_SERVER_URL ??
	// 			  'https://arduino-plant-moisture-production.up.railway.app'
	// 	axios
	// 		.get('/readings', {
	// 			baseURL: url,
	// 			params: {
	// 				start: startHistory ?? Date.now() - 6.048e8,
	// 				end: endHistory ?? Date.now(),
	// 			},
	// 		})
	// 		.then((data: any) => {
	// 			data.map((reading: any) => ({

	// 			}))
	// 		})
	// }, [startHistory, endHistory])
	if (!isConnected) return <p>Connecting...</p>
	return (
		<main
			className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}>
			<h1 className="text-2xl font-medium">🌱 moisture tracker</h1>
			<div className="flex flex-row gap-3">
				{ANALOG_PIN_FIELDS.map((field) => (
					<DataToggle
						key={field}
						field={field}
						toggles={toggles}
						setToggles={setToggles}
					/>
				))}
			</div>
			<MoistureChart toggles={toggles} data={liveData} />
			<div className="flex flex-col items-stretch justify-center">
				<label className="mx-auto">
					<span className="text-xs font-semibold inline-block py-1 px-2 rounded bg-orange-200 mr-2">
						Show History?
					</span>
					<input
						type="checkbox"
						checked={showHistory}
						onChange={() => setShowHistory(!showHistory)}
					/>
				</label>
				{showHistory && (
					<>
						<label>
							<span className="text-xs font-semibold inline-block py-1 px-2 w-16 text-center rounded bg-green-200 mr-2">
								Start
							</span>
							<input
								type="datetime-local"
								onChange={(e) =>
									setStartHistory(new Date(e.target.value).getTime())
								}
							/>
						</label>
						<label>
							<span className="text-xs font-semibold inline-block py-1 px-2 w-16 text-center rounded bg-red-200 mr-2">
								End
							</span>
							<input
								type="datetime-local"
								onChange={(e) =>
									setEndHistory(new Date(e.target.value).getTime())
								}
							/>
						</label>
					</>
				)}
			</div>
		</main>
	)
}
