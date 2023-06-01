import { AnalogPinField, DataToggles, colors, names } from '@/utils/constants'
import { Dispatch, SetStateAction } from 'react'

type DataToggleProps = {
	field: AnalogPinField
	toggles: DataToggles
	setToggles: Dispatch<SetStateAction<DataToggles>>
}

export default function DataToggle({
	field,
	toggles,
	setToggles,
}: DataToggleProps) {
	return (
		<div
			className="mb-4 rounded-md cursor-pointer"
			key={field}
			style={{ backgroundColor: colors[field], color: 'white' }}>
			<label className="p-1">
				<input
					className="mr-1"
					type="checkbox"
					checked={toggles[field]}
					onChange={() => setToggles({ ...toggles, [field]: !toggles[field] })}
				/>
				<span>{names[field]}</span>
			</label>
		</div>
	)
}
