export const ANALOG_PIN_FIELDS = [
	'moisture_A0',
	'moisture_A1',
	'moisture_A2',
	'moisture_A3',
	'moisture_A4',
	'moisture_A5',
] as const

export type AnalogPinField = (typeof ANALOG_PIN_FIELDS)[number]

export type MoistureDataTimestamped = MoistureData & { timestamp: number }
export type MoistureData = {
	[key in AnalogPinField]: number
}

export type DataToggles = {
	[key in AnalogPinField]: boolean
}

export const initialToggles: DataToggles = {
	moisture_A0: true,
	moisture_A1: true,
	moisture_A2: true,
	moisture_A3: true,
	moisture_A4: true,
	moisture_A5: true,
}

export const colors = {
	moisture_A0: 'red',
	moisture_A1: 'blue',
	moisture_A2: 'green',
	moisture_A3: 'brown',
	moisture_A4: 'orange',
	moisture_A5: 'purple',
} as const

export const names = {
	moisture_A0: 'Sensor A0',
	moisture_A1: 'Sensor A1',
	moisture_A2: 'Sensor A2',
	moisture_A3: 'Sensor A3',
	moisture_A4: 'Sensor A4',
	moisture_A5: 'Sensor A5',
} as const
