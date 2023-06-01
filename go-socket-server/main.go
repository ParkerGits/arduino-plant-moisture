package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var (
	ANALOG_PINS = []string{"A0", "A1", "A2", "A3", "A4", "A5"}
	FIELD_PREFIX = "moisture_"
)

func main() {
	router := gin.New()
	router.SetTrustedProxies(nil)

	server := InitSocketServer()

	go func() {
		if err := server.Serve(); err != nil {
			log.Fatalf("socketio listen error: %s\n", err)
		}
	}()
	defer server.Close()
	http.Handle("/socket.io/", server)

	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}
	address := "0.0.0.0:" + port

	clientOrigin := os.Getenv("CLIENT")
	if clientOrigin == "" {
		clientOrigin = "http://localhost:3000"
	}


	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{clientOrigin},
		AllowMethods: []string{"POST", "OPTIONS", "GET", "PUT", "DELETE"},
		AllowHeaders: []string{"ORIGIN"},
		AllowCredentials: true,
	}))
	router.Use(func(ctx *gin.Context) {
		log.Println("Incoming request from", ctx.Request.UserAgent(), "on", ctx.Request.URL.Path, "with params", ctx.Request.URL.RawQuery)
	})
	router.GET("/socket.io/*any", gin.WrapH(server))
	router.POST("/socket.io/*any", gin.WrapH(server))
	router.GET("/", func(ctx *gin.Context) {
    ctx.JSON(http.StatusOK, gin.H{
      "message": "Hello from the Plant Moisture Tracker Server 🌿",
    })
  })
	router.GET("/readings", func(ctx *gin.Context) {
		readings := []Reading{}
		start := ctx.Query("start")
		end := ctx.Query("end")
		if start == "" && end == "" {
			if err := GetAllReadings(&readings); err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"error": "There was an error fetching all moisture readings from the database.",
				})
				return
			}
		} else {
			startMillis, err := strconv.ParseInt(start, 10, 64)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"error": "There was an error parsing query parameters.",
				})
				return	
			}
		  endMillis, err := strconv.ParseInt(end, 10, 64)		
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"error": "There was an error parsing query parameters.",
				})
				return	
			}
			if err := GetReadingsBetweenDates(&readings, time.UnixMilli(startMillis), time.UnixMilli(endMillis)); err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"error": "There was an error fetching all moisture readings from the database.",
				})
				return
			}	
		}	
		ctx.JSON(http.StatusOK, readings)
	})
	router.POST("/", func(ctx *gin.Context) {
		if err := ctx.Request.ParseForm(); err != nil {
			log.Println(err)
		}
		form := ctx.Request.Form

		moistureReadings := make(map[string]uint8)
		for _, pin := range ANALOG_PINS {
			field := FIELD_PREFIX + pin
			moistureReading := form.Get(field)
			if moistureReading == "" {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"error": "Missing moisture reading from pin " + pin,
				})
				return;
			}
			
			readingNum, err := strconv.ParseInt(moistureReading, 10, 64)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"error": "Could not parse reading from pin " + pin,
				})
				return;
			}
			if readingNum > 100 || readingNum < 0 {
				ctx.JSON(http.StatusBadRequest, gin.H{
					"error": "Invalid reading on pin " + pin,
				})
				return;
			}
			moisture := uint8(readingNum)
			moistureReadings[field] = moisture
		}
		if err := BatchCreateReadingsFromMap(&moistureReadings); err != nil {
			log.Println("Failed to create new readings in database.")
		}
		log.Println("Received moisture readings", moistureReadings, "from", ctx.Request.UserAgent(), ctx.ClientIP())
		server.BroadcastToNamespace("/", "newData", moistureReadings)
		ctx.JSON(http.StatusOK, moistureReadings)
	})

	if err := router.Run(address); err != nil {
		log.Fatal("failed run app: ", err)
	}
}
