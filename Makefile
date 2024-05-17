SHELL = /bin/bash
CWD = $(shell pwd)
APP_NAME ?= guildhall
LOCAL_IP = $(shell curl guildhall.forges.work -o /dev/null -s -w '%{local_ip}')

migrations-dropall:
	@migrate -database "${DATABASE_URL}" -source file://${CWD}/db/migrations drop -f

migrations-create: NAME?=general-update
migrations-create:
	@migrate -database "${DATABASE_URL}" create -ext sql -dir ./db/migrations ${NAME}

migrations-up:
	@migrate -database "${DATABASE_URL}" -source file://${CWD}/db/migrations up

migrations-down:
	@migrate -database "${DATABASE_URL}" -source file://${CWD}/db/migrations down

build: clean
	@mkdir -p ${CWD}/build
	@go mod tidy
	@go build -o ${CWD}/build/${APP_NAME} .

run: PORT?=8000
run: build
	@${CWD}/build/${APP_NAME} -port ${PORT}

clean:
	@rm -rf ${CWD}/build