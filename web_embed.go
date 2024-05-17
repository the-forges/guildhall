package main

import "embed"

//go:embed web/dist/*
var Static embed.FS
