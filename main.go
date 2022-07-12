package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/briandowns/openweathermap"
	"github.com/grandcat/zeroconf"
)

var deviceName string = "QuairMe"
var aqi int = -1
var apiKey string = "c769c9c8e3b504df816db5f30fe31c1c"
var coordinates openweathermap.Coordinates

func setup(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, strconv.Itoa(aqi))
}

func setupRpi(ssid string, password string, latitude float64, longitude float64) {
	coordinates = openweathermap.Coordinates{
		Latitude:  latitude,
		Longitude: longitude,
	}
	saveConfig()
}
func readDeviceName() {
	name, err := os.Hostname()
	if err != nil {
		return
	}
	deviceName = name
}

func zeroConf() {
	server, err := zeroconf.Register(deviceName, "_quairme._tcp", "local.", 80, []string{"txtv=0", "lo=1", "la=2"}, nil)
	if err != nil {
		panic(err)
	}
	defer server.Shutdown()
}

func loadConfig() {
	var savedCoordinates openweathermap.Coordinates = openweathermap.Coordinates{}
	data, err := ioutil.ReadFile("config.json")
	if err != nil {
		return
	}
	json.Unmarshal(data, &savedCoordinates)
	coordinates = savedCoordinates
}

func saveConfig() {
	data, _ := json.MarshalIndent(coordinates, "", " ")
	_ = ioutil.WriteFile("config.json", data, 0644)
}

func connected() (ok bool) {
	_, err := http.Get("http://clients3.google.com/generate_204")
	if err != nil {
		return false
	}
	return true
}

//func gpioUpdate() {
//
//}
//
//func gpioLoop() chan struct{} {
//	err := rpio.Open()
//	if err != nil {
//		fmt.Println(err)
//		os.Exit(1)
//	}
//  gpioUpdate()
//	ticker := time.NewTicker(5 * time.Second)
//	quit := make(chan struct{})
//	go func() {
//		for {
//			select {
//			case <-ticker.C:
//				gpioUpdate()
//			case <-quit:
//				rpio.Close()
//				return
//			}
//		}
//	}()
//	return quit
//}

func simulatedGpioUpdate() {
	fmt.Println(strconv.Itoa(aqi))
}

func simulatedGpioLoop() chan struct{} {
	ticker := time.NewTicker(5 * time.Second)
	simulatedGpioUpdate()
	quit := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				simulatedGpioUpdate()
			case <-quit:
				return
			}
		}
	}()
	return quit
}

func requestAqi() {
	if !connected() {
		aqi = -1
		return
	}
	pollution, err := openweathermap.NewPollution(apiKey)
	if err != nil {
		return
	}
	params := &openweathermap.PollutionParameters{
		Location: openweathermap.Coordinates{
			Latitude:  0.0,
			Longitude: 10.0,
		},
		Datetime: "current",
	}

	err = pollution.PollutionByParams(params)
	if err != nil {
		return
	}
	if len(pollution.List) == 0 {
		return
	}
	aqi = pollution.List[0].Main.Aqi
}

func updateTicker() chan struct{} {
	ticker := time.NewTicker(5 * time.Second)
	requestAqi()
	quit := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				requestAqi()
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()
	return quit
}

func main() {
	readDeviceName()
	loadConfig()
	zeroConf()
	ticker := updateTicker()
	defer close(ticker)
	//gpi := gpioLoop()
	//defer close(gpi)
	gpi := simulatedGpioLoop()
	defer close(gpi)
	http.HandleFunc("/setup", setup)
	http.ListenAndServe(":80", nil)
}
