package main

import (
	"fmt"
	"os"

	"github.com/stianeikeland/go-rpio/v4"
)

func main() {
	fmt.Println("test")
	if err := rpio.Open(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	defer rpio.Close()

	fmt.Print("test")
}
