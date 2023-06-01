package main

import (
	"math/rand"
	"time"

	"gorm.io/gorm"
)

const (
	QUALITY_MEAN = 60
	QUALITY_STDEV = 10
)


type Reading struct {
	gorm.Model
	Sensor string
	Moisture uint8
	Quality uint8
}

func CreateReading(reading *Reading) error {
	result := db.Create(reading)
	return result.Error
}

func clamp(n, lo, hi float64) float64 {
	if n < lo {
		return lo
	}
	if n > hi {
		return hi
	}
	return n
}

func generateQuality() uint8 {
 return uint8(clamp(rand.NormFloat64() * QUALITY_STDEV + QUALITY_MEAN, 0, 100))
}

func CreateReadingFromData(pin string, moisture uint8) error {
	reading := new(Reading)
	reading.Moisture = moisture
	reading.Sensor = pin
	reading.Quality = generateQuality() 
  return CreateReading(reading)
}

func BatchCreateReadingsFromMap(moistureReadings *map[string]uint8) error {
	readings := make([]Reading, 0, 6)
	for pin, reading := range *moistureReadings {
		readings = append(readings, Reading{Moisture: reading, Sensor: pin, Quality: generateQuality() })
	}
	result := db.Create(&readings)
	return result.Error
}

func GetAllReadings(readings *[]Reading) error {
	result := db.Find(readings)
	return result.Error
}

func GetReadingsBetweenDates(readings *[]Reading, start, end time.Time) error {
	result := db.Where("created_at BETWEEN ? AND ?", start, end).Find(readings)
	return result.Error
}