type CustomSocketObject = { // todo: make custom protocol library with types and everything that can be shared between client and server
	message: string
}

export function handleMessage(socketObject: CustomSocketObject){
	return 'echo: ' + socketObject.message
}
