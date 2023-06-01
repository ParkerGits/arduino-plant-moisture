package main

import (
	"log"
	socketio "github.com/googollee/go-socket.io"
)

func InitSocketServer() *socketio.Server {
	server := socketio.NewServer(nil)
	
	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		log.Println("connected:", s.ID())
		return nil
	})

	server.OnError("/", func(s socketio.Conn, e error) {
		log.Println("error:", e)
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		log.Println("closed: ", reason)
	})

	return server
}