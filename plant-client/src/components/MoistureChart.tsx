import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import moment from 'moment'
import {
	ANALOG_PIN_FIELDS,
	AnalogPinField,
	MoistureData,
	DataToggles,
	colors,
	names,
} from '@/utils/constants'

interface MoistureChartProps {
	data: MoistureData[]
	toggles: DataToggles
}

export default function MoistureChart({ data, toggles }: MoistureChartProps) {
	return (
		<LineChart
			id="moisture-chart"
			width={600}
			height={400}
			data={data}
			margin={{ bottom: 20, left: 10 }}>
			{ANALOG_PIN_FIELDS.filter((value) => toggles[value]).map((field) => (
				<Line
					type={'monotone'}
					key={field}
					dataKey={field}
					stroke={colors[field]}
					dot={{
						stroke: colors[field],
						fill: colors[field],
					}}
					animationDuration={500}
					animationEasing="ease"
				/>
			))}
			<Tooltip
				labelFormatter={(time) => moment(time).format('MMM Do h:mm:ss A')}
				formatter={(value, name) => [
					value + '%',
					names[name as AnalogPinField],
				]}
			/>
			<CartesianGrid />
			<XAxis
				dataKey={'timestamp'}
				domain={['auto', 'auto']}
				name="Timestamp"
				tickFormatter={(time) => moment(time).format('HH:mm:ss')}
				type="number"
				label={{ value: 'Time', position: 'insideBottom', dy: 20 }}
			/>
			<YAxis
				name="Moisture Percent"
				domain={[0, 100]}
				tickFormatter={(value) => value + '%'}
				label={{
					value: 'Moisture Percent',
					position: 'insideLeft',
					angle: -90,
					dy: 50,
				}}
			/>
		</LineChart>
	)
}
