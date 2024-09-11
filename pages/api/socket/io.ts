import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIo } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    const socket = res.socket;
    const server = socket.server;
    let io = server.io;

    if(!io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = server as any;

        const io = new ServerIo(httpServer, {
            path,
            addTrailingSlash: false,
        });

        server.io = io;
    }

    res.end();
}

export default ioHandler;