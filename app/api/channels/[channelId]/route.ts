import { currentProfile } from "@/lib/current-profile,";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
  ) {
    try {
      const profile = await currentProfile();
      const { searchParams } = new URL(req.url);
  
      const serverId = searchParams.get("serverId");

      console.log("SERVERID:", serverId)
  
      if (!profile) {
        return new NextResponse("Unauthorized" ,{ status: 401 });
      }
  
      if (!serverId) {
        return new NextResponse("Server ID missing", { status: 400 });
      }
  
      if (!params.channelId) {
        return new NextResponse("Member ID missing", { status: 400 });
      }
  
    const server = await prisma?.server.update({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id,
                    role: {
                        in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                    }
                }
            }
        }, 
        data: {
            channels: {
                deleteMany: {
                    id: params?.channelId,
                    name: {
                        not: "general"
                    }
                }
            }
        }
    });
  
      return NextResponse.json(server);
    } catch (error) {
      console.log("[CHANNEL_ID_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  
  export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
  ) {
    try {
      const profile = await currentProfile();
      const { searchParams } = new URL(req.url);
  
      const serverId = searchParams.get("serverId");

      const { name, type } = await req.json();

      if(!name) {
        return new NextResponse("Name is missing", { status: 400 })
      }

      if(!type) {
        return new NextResponse("Type is missing", { status: 400 })
      }

      if(!params.channelId) {
        return new NextResponse("ChannelId is missing", { status: 400 })
      }
  
      if (!profile) {
        return new NextResponse("Unauthorized" ,{ status: 401 });
      }
  
      if (!serverId) {
        return new NextResponse("Server ID missing", { status: 400 });
      }
  
      if (!params.channelId) {
        return new NextResponse("Member ID missing", { status: 400 });
      }
  
      const server = await prisma?.server.update({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id,
                    role: {
                        in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                    }
                }
            }
        }, 
        data: {
            channels: {
                updateMany: {
               where: {
                id: params?.channelId,
                name: {
                    not: "general"
                }
               }, data : {
                name,
                type
               }
                }
            }
        }
    });

      return NextResponse.json(server);
    } catch (error) {
      console.log("[CHANNEL_ID_PATCH]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  