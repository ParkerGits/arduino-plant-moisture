import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import usePlantSocket from '@/hooks/usePlantSocket'
import { useState } from 'react'
import {
	ANALOG_PIN_FIELDS,
	DataToggles,
	initialToggles,
} from '@/utils/constants'
import DataToggle from '@/components/DataToggle'

const inter = Inter({ subsets: ['latin'] })

const MoistureChart = dynamic(() => import('../components/MoistureChart'), {
	ssr: false,
})

export default function Home() {
	const { isConnected, data } = usePlantSocket()
	const [toggles, setToggles] = useState<DataToggles>(initialToggles)
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
			<MoistureChart toggles={toggles} data={data} />
			<div className="flex flex-col items-center justify-center">
				<label>
					<span className="text-xs font-semibold inline-block py-1 px-2 rounded bg-green-200 mr-2">
						Start
					</span>
					<input type="datetime-local" />
				</label>
				<label>
					<span className="text-xs font-semibold inline-block py-1 px-3 rounded bg-red-200 mr-2">
						End
					</span>
					<input type="datetime-local" />
				</label>
			</div>
		</main>
	)
}
