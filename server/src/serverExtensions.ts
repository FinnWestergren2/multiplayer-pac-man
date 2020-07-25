import { ClientRequest, MessageType, ServerResponse } from "shared";

export function handleMessage(message: ClientRequest): ServerResponse {
	switch(message.type) {
		case MessageType.PING:
			return { type: MessageType.PONG, payload: (new Date()).getTime() - message.payload };
	}
}
