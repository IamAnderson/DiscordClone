import { Server as NetServer, Socket } from "net"
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Member, Profile, Server } from "@prisma/client";

export type ServerMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
  };

  export type NextApiResponseServerIo = {
    socket: {
      server: {
        io: SocketIOServer;
      } & NetServer;
    } & Socket;
  } & NextApiResponse;
  
  