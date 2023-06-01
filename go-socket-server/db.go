package main

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func init() {
	conn, err := gorm.Open(sqlite.Open("plants.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Error opening database")
	}
	db = conn
	db.AutoMigrate(&Reading{})
}

func GetDB() *gorm.DB {
	return db
}